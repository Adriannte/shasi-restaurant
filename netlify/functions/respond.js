const {
  RESERVATION_SECRET,
  RESEND_API_KEY,
  verifyToken,
  sendEmail,
  confirmedEmailHtml,
  declinedEmailHtml,
  resultPageHtml,
  pageHtml,
  htmlResponse,
  esc,
  textFor
} = require("./_shared");
const { isSameOrigin, getDecision, markDecision, clearDecision } = require("./_guard");

const ENDPOINT = "/.netlify/functions/respond";

function detailsHtml(r) {
  const row = (k, v) => `<tr><td>${k}</td><td>${esc(v || "—")}</td></tr>`;
  return `<table>${row("Name", r.name)}${row("Email", r.email)}${row("Phone", r.phone)}${row("Date", r.date)}${row("Time", r.time + " (2h hold)")}${row("Guests", r.guests)}${row("Notes", r.notes)}</table>`;
}

/* Opening the emailed link only shows this page. Mail scanners and link
   previewers issue GET requests, so nothing is sent until a human presses a
   button (POST). */
function choicePage(r, token) {
  const btn = (action, cls, label) =>
    `<form method="POST" action="${ENDPOINT}"><input type="hidden" name="token" value="${esc(token)}"/><input type="hidden" name="action" value="${action}"/><button class="${cls}" type="submit">${label}</button></form>`;
  return pageHtml(
    "Reservation request",
    `<h1>Reservation request</h1>${detailsHtml(r)}${btn("confirm", "ok", "Confirm reservation")}${btn("decline", "no", "Decline (fully booked)")}
     <p style="font-size:12px">The guest is emailed as soon as you press a button.</p>`
  );
}

function alreadyPage(r, decision) {
  const word = decision === "confirm" ? "confirmed" : "declined";
  return resultPageHtml({
    title: `Already ${word}`,
    message: `The request from ${r.name} for ${r.date} at ${r.time} was already ${word}. No further email was sent.`
  });
}

function parseForm(event) {
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body || "", "base64").toString("utf8")
    : event.body || "";
  if (raw.length > 4000) return {};
  return Object.fromEntries(new URLSearchParams(raw));
}

exports.handler = async (event) => {
  const method = event.httpMethod;
  if (method !== "GET" && method !== "POST") {
    return htmlResponse(405, resultPageHtml({ title: "Method not allowed", message: "" }));
  }
  if (!RESERVATION_SECRET || !RESEND_API_KEY) {
    return htmlResponse(500, resultPageHtml({
      title: "Not configured",
      message: "The reservation system is not fully set up yet (missing API keys)."
    }));
  }

  const params = method === "POST" ? parseForm(event) : event.queryStringParameters || {};
  const { token, action } = params;

  if (action !== "confirm" && action !== "decline") {
    return htmlResponse(400, resultPageHtml({ title: "Invalid link", message: "This reservation link is malformed." }));
  }
  const reservation = verifyToken(token);
  if (!reservation || !reservation.id) {
    return htmlResponse(400, resultPageHtml({
      title: "Link expired or invalid",
      message: "This reservation link is no longer valid. It may have expired."
    }));
  }

  const earlier = await getDecision(event, reservation.id);
  if (earlier) return htmlResponse(200, alreadyPage(reservation, earlier.decision));

  if (method === "GET") return htmlResponse(200, choicePage(reservation, token));

  if (!isSameOrigin(event)) {
    return htmlResponse(403, resultPageHtml({ title: "Forbidden", message: "" }));
  }

  // claim the link first so a double click cannot email the guest twice
  await markDecision(event, reservation.id, action);
  const t = textFor(reservation.lang);
  try {
    if (action === "confirm") {
      await sendEmail({ to: reservation.email, subject: t.confirmedSubject, html: confirmedEmailHtml(reservation) });
      return htmlResponse(200, resultPageHtml({
        title: "Reservation confirmed",
        message: `${reservation.name} has been emailed a confirmation for ${reservation.date} at ${reservation.time} (${reservation.guests} guests).`
      }));
    }
    await sendEmail({ to: reservation.email, subject: t.declinedSubject, html: declinedEmailHtml(reservation) });
    return htmlResponse(200, resultPageHtml({
      title: "Reservation declined",
      message: `${reservation.name} has been emailed to say the table for ${reservation.date} at ${reservation.time} could not be confirmed.`
    }));
  } catch (err) {
    console.error("respond.js email error", err.message);
    await clearDecision(event, reservation.id);
    return htmlResponse(502, resultPageHtml({
      title: "Could not send email",
      message: "The email to the guest failed to send. Open the link in your email again and retry."
    }));
  }
};
