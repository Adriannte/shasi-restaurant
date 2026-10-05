const crypto = require("crypto");
const store = require("./_store");

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

const LIMITS = {
  ipPerHour: parseInt(process.env.LIMIT_IP_PER_HOUR || "5", 10),
  emailPerDay: parseInt(process.env.LIMIT_EMAIL_PER_DAY || "3", 10),
  // each reservation sends up to 3 emails and Resend's free plan allows
  // 100/day, so cap the whole site well below that
  globalPerDay: parseInt(process.env.LIMIT_RESERVATIONS_PER_DAY || "30", 10)
};

function hash(value) {
  return crypto
    .createHmac("sha256", process.env.RESERVATION_SECRET || "")
    .update(String(value).toLowerCase())
    .digest("hex")
    .slice(0, 32);
}

function clientIp(event) {
  const h = event.headers || {};
  return (
    h["x-nf-client-connection-ip"] ||
    h["client-ip"] ||
    (h["x-forwarded-for"] || "").split(",")[0].trim() ||
    "unknown"
  );
}

/* POSTs from other websites are refused: if the browser sent an Origin it
   must be this site */
function isSameOrigin(event) {
  const h = event.headers || {};
  const origin = h.origin;
  if (!origin) return true; // non-browser callers carry no Origin; other checks still apply
  try {
    return new URL(origin).host === h.host;
  } catch {
    return false;
  }
}

async function bump(event, key) {
  const current = (await store.get(event, key)) || { n: 0 };
  current.n += 1;
  await store.set(event, key, current);
  return current.n;
}

/* returns { allowed, reason } — counters are keyed by hashed values only */
async function checkRateLimit(event, { email }) {
  const now = Date.now();
  const hour = Math.floor(now / HOUR_MS);
  const day = Math.floor(now / DAY_MS);

  const ipCount = await bump(event, `rl:ip:${hash(clientIp(event))}:${hour}`);
  if (ipCount > LIMITS.ipPerHour) return { allowed: false, reason: "ip" };

  const emailCount = await bump(event, `rl:email:${hash(email)}:${day}`);
  if (emailCount > LIMITS.emailPerDay) return { allowed: false, reason: "email" };

  const globalCount = await bump(event, `rl:global:${day}`);
  if (globalCount === 1) {
    await store.cleanup(event, { counterPrefixKeep: { day, hour }, doneMaxAgeMs: 30 * DAY_MS });
  }
  if (globalCount > LIMITS.globalPerDay) return { allowed: false, reason: "global" };

  return { allowed: true };
}

/* Cloudflare Turnstile (optional): enforced only when a secret is configured */
async function verifyTurnstile(event, token) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token || typeof token !== "string") return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: clientIp(event) })
    });
    const out = await res.json();
    return out.success === true;
  } catch (err) {
    console.error("turnstile verify failed", err.message);
    return false;
  }
}

/* one-time use of a confirm/decline link */
async function getDecision(event, id) {
  return store.get(event, `done:${id}`);
}
async function markDecision(event, id, decision) {
  return store.set(event, `done:${id}`, { decision, ts: Date.now() });
}
async function clearDecision(event, id) {
  return store.del(event, `done:${id}`);
}

module.exports = {
  LIMITS,
  clientIp,
  isSameOrigin,
  checkRateLimit,
  verifyTurnstile,
  getDecision,
  markDecision,
  clearDecision
};
