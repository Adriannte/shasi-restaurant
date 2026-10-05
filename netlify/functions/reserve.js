const crypto = require("crypto");
const {
  RESERVATION_SECRET,
  RESEND_API_KEY,
  OWNER_EMAIL,
  SITE_URL,
  signPayload,
  sendEmail,
  pendingEmailHtml,
  ownerEmailHtml,
  jsonResponse,
  textFor
} = require("./_shared");
const { isSameOrigin, checkRateLimit, verifyTurnstile } = require("./_guard");

const LANGS = ["en", "mne", "sq", "de", "ru"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;
const EMAIL_RE = /^[A-Za-z0-9._%+'-]{1,64}@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const MAX_BODY = 4000;
const MIN_FILL_MS = 3000; // a person cannot fill this form faster

/* single line, no control characters, bounded length */
function clean(str, max) {
  return String(str ?? "").replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max);
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { ok: false, error: "Method not allowed" });
  }
  if (!RESERVATION_SECRET || !RESEND_API_KEY) {
    return jsonResponse(500, { ok: false, error: "Reservation system is not configured yet." });
  }
  if (!isSameOrigin(event)) {
    return jsonResponse(403, { ok: false, error: "Forbidden" });
  }
  const type = (event.headers || {})["content-type"] || "";
  if (!type.includes("application/json")) {
    return jsonResponse(415, { ok: false, error: "Unsupported request." });
  }
  if ((event.body || "").length > MAX_BODY) {
    return jsonResponse(413, { ok: false, error: "Request too large." });
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { ok: false, error: "Invalid request." });
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return jsonResponse(400, { ok: false, error: "Invalid request." });
  }

  // bot traps: a filled hidden field or an impossibly fast submit looks like
  // success to the sender but nothing is sent
  const elapsed = Number(data.elapsed);
  if (!Number.isFinite(elapsed)) {
    return jsonResponse(400, { ok: false, error: "Invalid request." });
  }
  if (clean(data.hp, 50) || elapsed < MIN_FILL_MS) {
    return jsonResponse(200, { ok: true });
  }

  if (!(await verifyTurnstile(event, data["cf-turnstile-response"]))) {
    return jsonResponse(400, { ok: false, error: "Bot check failed. Please reload the page and try again." });
  }

  const name = clean(data.name, 100);
  const email = clean(data.email, 150);
  const phone = clean(data.phone, 40);
  const notes = clean(data.notes, 400);
  const date = clean(data.date, 10);
  const time = clean(data.time, 5);
  const guests = typeof data.guests === "number" ? data.guests : parseInt(data.guests, 10);
  const lang = LANGS.includes(data.lang) ? data.lang : "en";

  if (!name || !EMAIL_RE.test(email) || !DATE_RE.test(date) || !TIME_RE.test(time) ||
      !Number.isInteger(guests) || guests < 1 || guests > 60) {
    return jsonResponse(400, { ok: false, error: "Please check the form — some details look invalid." });
  }
  if (!["00", "30"].includes(time.slice(3))) {
    return jsonResponse(400, { ok: false, error: "Please choose a time on the hour or half hour." });
  }

  const requestedAt = new Date(`${date}T${time}:00`);
  const now = Date.now();
  if (Number.isNaN(requestedAt.getTime()) || requestedAt.getTime() < now - 60 * 60 * 1000) {
    return jsonResponse(400, { ok: false, error: "Please choose a date and time in the future." });
  }
  if (requestedAt.getTime() > now + 366 * 24 * 60 * 60 * 1000) {
    return jsonResponse(400, { ok: false, error: "Please choose a date within the next year." });
  }

  const limit = await checkRateLimit(event, { email });
  if (!limit.allowed) {
    console.warn("reservation rate-limited:", limit.reason);
    return jsonResponse(429, { ok: false, error: "Too many requests. Please try again later or call us." });
  }

  const reservation = { id: crypto.randomUUID(), name, email, phone, notes, date, time, guests, lang };
  const token = signPayload(reservation);
  const respondUrl = (action) =>
    `${SITE_URL}/.netlify/functions/respond?action=${action}&token=${encodeURIComponent(token)}`;

  // the owner must receive the request; if that fails the guest is told so
  try {
    await sendEmail({
      to: OWNER_EMAIL,
      subject: `New reservation request — ${name} (${guests} guests, ${date} ${time})`,
      html: ownerEmailHtml(reservation, respondUrl("confirm"), respondUrl("decline"))
    });
  } catch (err) {
    console.error("reserve.js owner email error", err.message);
    return jsonResponse(502, { ok: false, error: "Could not send your request. Please try again shortly." });
  }

  // the guest's "received" note is a courtesy: the request already exists
  try {
    await sendEmail({
      to: email,
      subject: textFor(lang).pendingSubject,
      html: pendingEmailHtml(reservation)
    });
  } catch (err) {
    console.error("reserve.js guest email error", err.message);
  }

  return jsonResponse(200, { ok: true });
};
