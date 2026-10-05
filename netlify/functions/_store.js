/* Tiny key-value layer on Netlify Blobs, used only for abuse protection:
   rate-limit counters (hashed keys) and "already answered" markers for the
   confirm/decline links. No guest details are stored here.

   Every call is best-effort: if the store is unavailable the guest-facing
   flow still works (fail open) and the problem is logged. */

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

async function get(event, key) {
  try {
    return (await use(event).get(key, { type: "json" })) ?? null;
  } catch (err) {
    console.error("store.get failed", key.split(":")[0], err.message);
    return null;
  }
}

async function set(event, key, value) {
  try {
    await use(event).setJSON(key, value);
    return true;
  } catch (err) {
    console.error("store.set failed", key.split(":")[0], err.message);
    return false;
  }
}

async function del(event, key) {
  try {
    await use(event).delete(key);
  } catch (err) {
    console.error("store.delete failed", key.split(":")[0], err.message);
  }
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

module.exports = { setBackend, get, set, del, cleanup };
