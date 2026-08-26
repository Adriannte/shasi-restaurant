const {
  RESERVATION_SECRET,
  RESEND_API_KEY,
  verifyToken,
  sendEmail,
  confirmedEmailHtml,
  declinedEmailHtml,
  resultPageHtml,
  textFor
} = require("./_shared");

function html(status, body) {
  return { statusCode: status, headers: { "Content-Type": "text/html; charset=utf-8" }, body };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return html(405, resultPageHtml({ title: "Method not allowed", message: "" }));
  }
  if (!RESERVATION_SECRET || !RESEND_API_KEY) {
    return html(500, resultPageHtml({
      title: "Not configured",
      message: "The reservation system is not fully set up yet (missing API keys)."
    }));
  }

  const { token, action } = event.queryStringParameters || {};
  if (action !== "confirm" && action !== "decline") {
    return html(400, resultPageHtml({ title: "Invalid link", message: "This reservation link is malformed." }));
  }

  const reservation = verifyToken(token);
  if (!reservation) {
    return html(400, resultPageHtml({
      title: "Link expired or invalid",
      message: "This reservation link is no longer valid. It may have already been used or has expired."
    }));
  }

  const t = textFor(reservation.lang);

  try {
    if (action === "confirm") {
      await sendEmail({ to: reservation.email, subject: t.confirmedSubject, html: confirmedEmailHtml(reservation) });
      return html(200, resultPageHtml({
        title: "Reservation confirmed",
        message: `${reservation.name} has been emailed a confirmation for ${reservation.date} at ${reservation.time} (${reservation.guests} guests). See you at the lake!`
      }));
    } else {
      await sendEmail({ to: reservation.email, subject: t.declinedSubject, html: declinedEmailHtml(reservation) });
      return html(200, resultPageHtml({
        title: "Reservation declined",
        message: `${reservation.name} has been emailed to let them know the table for ${reservation.date} at ${reservation.time} could not be confirmed.`
      }));
    }
  } catch (err) {
    console.error("respond.js email error", err);
    return html(502, resultPageHtml({
      title: "Could not send email",
      message: "The action was recognized but the email to the guest failed to send. Please try clicking the link again."
    }));
  }
};
