const {
  RESERVATION_SECRET,
  RESEND_API_KEY,
  OWNER_EMAIL,
  SITE_URL,
  signPayload,
  sendEmail,
  pendingEmailHtml,
  ownerEmailHtml
} = require("./_shared");

const LANGS = ["en", "mne", "sq", "de", "ru"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

function json(status, body) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };
}

function clean(str, max) {
  return String(str ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }
  if (!RESERVATION_SECRET || !RESEND_API_KEY) {
    return json(500, { ok: false, error: "Reservation system is not configured yet." });
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { ok: false, error: "Invalid request." });
  }

  const name = clean(data.name, 100);
  const email = clean(data.email, 150);
  const phone = clean(data.phone, 40);
  const notes = clean(data.notes, 400);
  const date = clean(data.date, 10);
  const time = clean(data.time, 5);
  const guests = parseInt(data.guests, 10);
  const lang = LANGS.includes(data.lang) ? data.lang : "en";

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || !emailRe.test(email) || !DATE_RE.test(date) || !TIME_RE.test(time) ||
      !Number.isInteger(guests) || guests < 1 || guests > 60) {
    return json(400, { ok: false, error: "Please check the form — some details look invalid." });
  }

  const requestedAt = new Date(`${date}T${time}:00`);
  if (Number.isNaN(requestedAt.getTime()) || requestedAt.getTime() < Date.now() - 60 * 60 * 1000) {
    return json(400, { ok: false, error: "Please choose a date and time in the future." });
  }

  const reservation = { name, email, phone, notes, date, time, guests, lang };
  const token = signPayload(reservation);
  const confirmUrl = `${SITE_URL}/.netlify/functions/respond?action=confirm&token=${encodeURIComponent(token)}`;
  const declineUrl = `${SITE_URL}/.netlify/functions/respond?action=decline&token=${encodeURIComponent(token)}`;

  try {
    await sendEmail({
      to: email,
      subject: require("./_shared").textFor(lang).pendingSubject,
      html: pendingEmailHtml(reservation)
    });
    await sendEmail({
      to: OWNER_EMAIL,
      subject: `New reservation request — ${name} (${guests} guests, ${date} ${time})`,
      html: ownerEmailHtml(reservation, confirmUrl, declineUrl)
    });
  } catch (err) {
    console.error("reserve.js email error", err);
    return json(502, { ok: false, error: "Could not send the confirmation email. Please try again shortly." });
  }

  return json(200, { ok: true });
};
