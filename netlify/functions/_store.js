/* Key-value layer on Netlify Blobs, used only for abuse protection:
   rate-limit counters (hashed keys) and one-time "claimed" markers for the
   confirm/decline links. No guest details are stored here.

   increment() and claim() use compare-and-swap (onlyIfNew/onlyIfMatch) so
   concurrent requests cannot race each other, and they THROW on any store
   failure — callers decide whether to fail open or closed. Only cleanup()
   is best-effort: housekeeping must never block the guest-facing flow. */

let backend = null; // tests inject a fake with setBackend()

function setBackend(b) {
  backend = b;
}

function realStore(event) {
  const { getStore, connectLambda } = require("@netlify/blobs");
  if (event) {
    try { connectLambda(event); } catch { /* already connected */ }
  }
  return getStore({ name: "shasi-guard", consistency: "strong" });
}

function use(event) {
  return backend || realStore(event);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* atomic +1 via compare-and-swap; returns the new count. Retries with
   jittered backoff under contention (many requests hitting the same
   bucket at once) and only throws once that's genuinely exhausted or the
   store itself is unreachable. */
async function increment(event, key) {
  const s = use(event);
  const MAX_ATTEMPTS = 20;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const existing = await s.getWithMetadata(key, { type: "json" });
    const n = (existing && existing.data && existing.data.n) || 0;
    const next = n + 1;
    const result = existing
      ? await s.setJSON(key, { n: next }, { onlyIfMatch: existing.etag })
      : await s.setJSON(key, { n: next }, { onlyIfNew: true });
    if (result.modified) return next;
    if (attempt < MAX_ATTEMPTS - 1) {
      await sleep(Math.random() * Math.min(20 * 2 ** attempt, 300));
    }
  }
  throw new Error("counter contention exceeded retries: " + key.split(":")[0]);
}

/* one-time claim: true if THIS call claimed it (first writer wins), false
   if something else already claimed it. Throws on store error. */
async function claim(event, key, value) {
  const s = use(event);
  const result = await s.setJSON(key, value, { onlyIfNew: true });
  return result.modified;
}

async function getJSON(event, key) {
  const s = use(event);
  return (await s.get(key, { type: "json" })) ?? null;
}

async function del(event, key) {
  const s = use(event);
  await s.delete(key);
}

/* remove stale markers so the store never grows without bound */
async function cleanup(event, { counterPrefixKeep, doneMaxAgeMs }) {
  try {
    const s = use(event);
    const now = Date.now();
    const { blobs } = await s.list({ prefix: "rl:" });
    for (const { key } of blobs) {
      if (!key.endsWith(":" + counterPrefixKeep.day) && !key.endsWith(":" + counterPrefixKeep.hour)) {
        await s.delete(key);
      }
    }
    const done = await s.list({ prefix: "done:" });
    for (const { key } of done.blobs) {
      const v = await s.get(key, { type: "json" });
      if (!v || now - v.ts > doneMaxAgeMs) await s.delete(key);
    }
  } catch (err) {
    console.error("store.cleanup failed", err.message);
  }
}

module.exports = { setBackend, increment, claim, getJSON, del, cleanup };
