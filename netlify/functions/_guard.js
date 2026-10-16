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

/* Only Netlify's own edge-set header is trusted for rate-limit bucketing.
   client-ip / x-forwarded-for are caller-supplied and would let an
   attacker pick a fresh "IP" on every request to dodge the per-IP limit. */
function clientIp(event) {
  return (event.headers || {})["x-nf-client-connection-ip"] || "unknown";
}

/* POSTs must carry an Origin header that matches this site. A missing
   Origin is refused, not waved through — real browser form/fetch POSTs
   from this site always send one, so this only blocks non-browser or
   cross-site callers, which is the point. */
function isSameOrigin(event) {
  const h = event.headers || {};
  const origin = h.origin;
  if (!origin) return false;
  try {
    return new URL(origin).host === h.host;
  } catch {
    return false;
  }
}

/* returns { allowed, reason }. Any store failure fails CLOSED: if we can't
   reliably count requests we can't reliably limit them, so the request is
   refused rather than silently let through during an outage. */
async function checkRateLimit(event, { email }) {
  const now = Date.now();
  const hour = Math.floor(now / HOUR_MS);
  const day = Math.floor(now / DAY_MS);

  try {
    const ipCount = await store.increment(event, `rl:ip:${hash(clientIp(event))}:${hour}`);
    if (ipCount > LIMITS.ipPerHour) return { allowed: false, reason: "ip" };

    const emailCount = await store.increment(event, `rl:email:${hash(email)}:${day}`);
    if (emailCount > LIMITS.emailPerDay) return { allowed: false, reason: "email" };

    const globalCount = await store.increment(event, `rl:global:${day}`);
    if (globalCount === 1) {
      store.cleanup(event, { counterPrefixKeep: { day, hour }, doneMaxAgeMs: 30 * DAY_MS }).catch(() => {});
    }
    if (globalCount > LIMITS.globalPerDay) return { allowed: false, reason: "global" };

    return { allowed: true };
  } catch (err) {
    console.error("rate-limit store unavailable, failing closed:", err.message);
    return { allowed: false, reason: "store-unavailable" };
  }
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

module.exports = {
  LIMITS,
  clientIp,
  isSameOrigin,
  checkRateLimit,
  verifyTurnstile
};
