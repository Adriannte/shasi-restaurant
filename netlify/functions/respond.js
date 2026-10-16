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
const { isSameOrigin } = require("./_guard");
const store = require("./_store");

const ENDPOINT = "/.netlify/functions/respond";

function unavailablePage() {
  return resultPageHtml({
    title: "Temporarily unavailable",
    message: "This could not be checked right now. Please open the link again in a minute."
  });
}

function hiddenFields(token, action) {
  return `<input type="hidden" name="token" value="${esc(token)}"/><input type="hidden" name="action" value="${esc(action)}"/>`;
}

/* Opening the emailed link (a GET) only ever shows this: no guest details
   yet. Mail/link-scanning services that prefetch URLs found in emails only
   issue GETs, so this keeps the guest's name/email/phone/notes out of
   whatever fetched the link — a human has to press a button to see them. */
function teaserPage(token) {
  return pageHtml(
    "Reservation request",
    `<h1>Reservation request</h1><p>A new table reservation is waiting for your decision.</p>
     <form method="POST" action="${ENDPOINT}">${hiddenFields(token, "view")}<button class="ok" type="submit">View &amp; respond</button></form>`
  );
}

function detailsHtml(r) {
  const row = (k, v) => `<tr><td>${k}</td><td>${esc(v || "—")}</td></tr>`;
  return `<table>${row("Name", r.name)}${row("Email", r.email)}${row("Phone", r.phone)}${row("Date", r.date)}${row("Time", r.time + " (2h hold)")}${row("Guests", r.guests)}${row("Notes", r.notes)}</table>`;
}

function choicePage(r, token) {
  const btn = (action, cls, label) =>
    `<form method="POST" action="${ENDPOINT}">${hiddenFields(token, action)}<button class="${cls}" type="submit">${label}</button></form>`;
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

  if (!["confirm", "decline", "view"].includes(action)) {
    return htmlResponse(400, resultPageHtml({ title: "Invalid link", message: "This reservation link is malformed." }));
  }
  if (action !== "view" && method === "POST" && !isSameOrigin(event)) {
    return htmlResponse(403, resultPageHtml({ title: "Forbidden", message: "" }));
  }
  if (action === "view" && !isSameOrigin(event)) {
    return htmlResponse(403, resultPageHtml({ title: "Forbidden", message: "" }));
  }

  const reservation = verifyToken(token);
  if (!reservation || !reservation.id) {
    return htmlResponse(400, resultPageHtml({
      title: "Link expired or invalid",
      message: "This reservation link is no longer valid. It may have expired."
    }));
  }

  // GET only ever shows the no-detail teaser, regardless of which link
  // (confirm/decline) was clicked — the real choice is made on the next page
  if (method === "GET") {
    let earlier;
    try {
      earlier = await store.getJSON(event, `done:${reservation.id}`);
    } catch (err) {
      console.error("respond.js status check failed", err.message);
      return htmlResponse(503, unavailablePage());
    }
    if (earlier) return htmlResponse(200, alreadyPage(reservation, earlier.decision));
    return htmlResponse(200, teaserPage(token));
  }

  // POST action=view: a human pressed the button, now show the real details
  if (action === "view") {
    let earlier;
    try {
      earlier = await store.getJSON(event, `done:${reservation.id}`);
    } catch (err) {
      console.error("respond.js status check failed", err.message);
      return htmlResponse(503, unavailablePage());
    }
    if (earlier) return htmlResponse(200, alreadyPage(reservation, earlier.decision));
    return htmlResponse(200, choicePage(reservation, token));
  }

  // POST action=confirm|decline: atomically claim the link so a double
  // click (or a race between two requests) cannot email the guest twice
  let claimed;
  try {
    claimed = await store.claim(event, `done:${reservation.id}`, { decision: action, ts: Date.now() });
  } catch (err) {
    console.error("respond.js claim failed", err.message);
    return htmlResponse(503, unavailablePage());
  }
  if (!claimed) {
    let earlier;
    try {
      earlier = await store.getJSON(event, `done:${reservation.id}`);
    } catch {
      earlier = null;
    }
    return htmlResponse(200, alreadyPage(reservation, (earlier && earlier.decision) || action));
  }

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
    await store.del(event, `done:${reservation.id}`); // release the claim so the owner can retry
    return htmlResponse(502, resultPageHtml({
      title: "Could not send email",
      message: "The email to the guest failed to send. Open the link in your email again and retry."
    }));
  }
};
