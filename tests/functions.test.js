process.env.RESERVATION_SECRET = "test-secret-for-unit-tests-only";
process.env.RESEND_API_KEY = "re_test";
process.env.OWNER_EMAIL = "owner@example.com";
process.env.URL = "https://www.example.test";

const test = require("node:test");
const assert = require("node:assert/strict");

const store = require("../netlify/functions/_store");
const reserve = require("../netlify/functions/reserve").handler;
const respond = require("../netlify/functions/respond").handler;
const shared = require("../netlify/functions/_shared");

/* in-memory stand-in for Netlify Blobs */
function fakeBackend() {
  const m = new Map();
  return {
    async get(k) { return m.has(k) ? JSON.parse(m.get(k)) : null; },
    async setJSON(k, v) { m.set(k, JSON.stringify(v)); },
    async delete(k) { m.delete(k); },
    async list({ prefix }) { return { blobs: [...m.keys()].filter((k) => k.startsWith(prefix)).map((key) => ({ key })) }; }
  };
}

let sent;
let failSends;
let turnstileOk;
test.beforeEach(() => {
  store.setBackend(fakeBackend());
  sent = [];
  failSends = false;
  turnstileOk = true;
  global.fetch = async (url, opts) => {
    if (String(url).includes("turnstile")) {
      return { json: async () => ({ success: turnstileOk }) };
    }
    if (failSends) return { ok: false, status: 500, text: async () => "boom" };
    sent.push(JSON.parse(opts.body));
    return { ok: true, json: async () => ({ id: "x" }) };
  };
});

function tomorrow() {
  const d = new Date(Date.now() + 2 * 86400000);
  return d.toISOString().slice(0, 10);
}

function body(over = {}) {
  return {
    name: "Test Guest", email: "guest@example.com", phone: "", notes: "",
    date: tomorrow(), time: "19:30", guests: 4, lang: "en",
    elapsed: 9000, hp: "", ...over
  };
}

let ipCounter = 0;
function req(payload, headers = {}) {
  ipCounter += 1;
  return {
    httpMethod: "POST",
    headers: {
      "content-type": "application/json",
      host: "www.example.test",
      origin: "https://www.example.test",
      "x-nf-client-connection-ip": `10.0.0.${ipCounter}`,
      ...headers
    },
    body: typeof payload === "string" ? payload : JSON.stringify(payload)
  };
}

function tokenFromOwnerEmail(email) {
  const m = email.html.match(/respond\?action=confirm&amp;token=([^"&]+)|respond\?action=confirm&token=([^"&]+)/);
  return decodeURIComponent(m[1] || m[2]);
}

test("valid reservation emails owner first, then the guest", async () => {
  const res = await reserve(req(body()));
  assert.equal(res.statusCode, 200);
  assert.equal(sent.length, 2);
  assert.equal(sent[0].to, "owner@example.com");
  assert.equal(sent[1].to, "guest@example.com");
  assert.ok(sent[0].text.length > 0, "plain-text part present");
});

test("responses carry hardening headers", async () => {
  const res = await reserve(req(body()));
  assert.equal(res.headers["X-Content-Type-Options"], "nosniff");
  assert.equal(res.headers["Cache-Control"], "no-store");
});

test("honeypot and instant submits are silently dropped", async () => {
  assert.equal((await reserve(req(body({ hp: "http://spam" })))).statusCode, 200);
  assert.equal((await reserve(req(body({ elapsed: 500 })))).statusCode, 200);
  assert.equal(sent.length, 0);
});

test("missing elapsed, wrong content type, foreign origin are refused", async () => {
  const noElapsed = body(); delete noElapsed.elapsed;
  assert.equal((await reserve(req(noElapsed))).statusCode, 400);
  assert.equal((await reserve(req(body(), { "content-type": "text/plain" }))).statusCode, 415);
  assert.equal((await reserve(req(body(), { origin: "https://evil.example" }))).statusCode, 403);
  assert.equal(sent.length, 0);
});

test("invalid input is rejected", async () => {
  for (const bad of [
    { email: "a,b@example.com" },
    { email: "no-at-sign" },
    { guests: 0 },
    { guests: 500 },
    { time: "19:15" },
    { date: "2020-01-01" },
    { date: "2099-01-01" },
    { name: "   " }
  ]) {
    assert.equal((await reserve(req(body(bad)))).statusCode, 400, JSON.stringify(bad));
  }
  assert.equal((await reserve(req("not json"))).statusCode, 400);
  assert.equal(sent.length, 0);
});

test("header injection attempts are flattened", async () => {
  await reserve(req(body({ name: "Eve\r\nBcc: victim@example.com" })));
  assert.ok(!/[\r\n]/.test(sent[0].subject));
});

test("same email is limited per day, same IP per hour", async () => {
  for (let i = 0; i < 3; i++) {
    assert.equal((await reserve(req(body()))).statusCode, 200);
  }
  assert.equal((await reserve(req(body()))).statusCode, 429);

  const ipHeaders = { "x-nf-client-connection-ip": "203.0.113.9" };
  const codes = [];
  for (let i = 0; i < 7; i++) {
    codes.push((await reserve(req(body({ email: `p${i}@example.com` }), ipHeaders))).statusCode);
  }
  assert.deepEqual(codes, [200, 200, 200, 200, 200, 429, 429]);
});

test("owner email failure is reported; guest email failure is not", async () => {
  failSends = true;
  assert.equal((await reserve(req(body()))).statusCode, 502);
});

test("turnstile is enforced only when configured", async () => {
  process.env.TURNSTILE_SECRET_KEY = "secret";
  try {
    turnstileOk = false;
    assert.equal((await reserve(req(body({ "cf-turnstile-response": "tok" })))).statusCode, 400);
    assert.equal((await reserve(req(body()))).statusCode, 400);
    turnstileOk = true;
    assert.equal((await reserve(req(body({ "cf-turnstile-response": "tok" })))).statusCode, 200);
  } finally {
    delete process.env.TURNSTILE_SECRET_KEY;
  }
});

async function makeToken() {
  await reserve(req(body()));
  const token = tokenFromOwnerEmail(sent[0]);
  sent.length = 0;
  return token;
}

function getReq(action, token) {
  return {
    httpMethod: "GET", headers: { host: "www.example.test" },
    queryStringParameters: { action, token }
  };
}
function postReq(action, token, headers = {}) {
  return {
    httpMethod: "POST",
    headers: { host: "www.example.test", origin: "https://www.example.test", ...headers },
    body: new URLSearchParams({ action, token }).toString()
  };
}

test("opening the link only shows a page — nothing is emailed", async () => {
  const token = await makeToken();
  const res = await respond(getReq("confirm", token));
  assert.equal(res.statusCode, 200);
  assert.match(res.body, /Confirm reservation/);
  assert.equal(sent.length, 0);
});

test("confirm sends the guest email exactly once", async () => {
  const token = await makeToken();
  const first = await respond(postReq("confirm", token));
  assert.equal(first.statusCode, 200);
  assert.match(first.body, /Reservation confirmed/);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, "guest@example.com");

  const again = await respond(postReq("decline", token));
  assert.match(again.body, /Already confirmed/);
  assert.equal(sent.length, 1);
  assert.match((await respond(getReq("confirm", token))).body, /Already confirmed/);
});

test("a failed send releases the link so the owner can retry", async () => {
  const token = await makeToken();
  failSends = true;
  assert.equal((await respond(postReq("decline", token))).statusCode, 502);
  failSends = false;
  const retry = await respond(postReq("decline", token));
  assert.match(retry.body, /Reservation declined/);
  assert.equal(sent.length, 1);
});

test("tampered, malformed and expired links are refused", async () => {
  const token = await makeToken();
  const [b, sig] = token.split(".");
  assert.equal((await respond(getReq("confirm", b + "." + sig.slice(0, -2) + "xx"))).statusCode, 400);
  assert.equal((await respond(getReq("confirm", "junk"))).statusCode, 400);
  assert.equal((await respond(getReq("delete", token))).statusCode, 400);

  const realNow = Date.now;
  Date.now = () => realNow() + 15 * 86400000;
  try {
    assert.equal((await respond(getReq("confirm", token))).statusCode, 400);
  } finally {
    Date.now = realNow;
  }
  assert.equal(sent.length, 0);
});

test("a cross-site POST to respond is refused", async () => {
  const token = await makeToken();
  const res = await respond(postReq("confirm", token, { origin: "https://evil.example" }));
  assert.equal(res.statusCode, 403);
  assert.equal(sent.length, 0);
});

test("guest-supplied text is escaped in the owner page and emails", async () => {
  await reserve(req(body({ name: "<script>alert(1)</script>", notes: "<img src=x onerror=1>" })));
  assert.ok(!sent[0].html.includes("<script>alert"));
  assert.ok(!sent[0].html.includes("<img src=x"));
  const token = tokenFromOwnerEmail(sent[0]);
  const page = await respond(getReq("confirm", token));
  assert.ok(!page.body.includes("<script>alert"));
  assert.ok(page.body.includes("&lt;script&gt;"));
});

test("signing helpers reject a token signed with another secret", () => {
  const good = shared.signPayload({ id: "1", name: "x" });
  assert.ok(shared.verifyToken(good));
  const [b] = good.split(".");
  assert.equal(shared.verifyToken(b + ".AAAA"), null);
});
