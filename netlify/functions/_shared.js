const crypto = require("crypto");

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESERVATION_SECRET = process.env.RESERVATION_SECRET;
const OWNER_EMAIL = process.env.OWNER_EMAIL || "restorantshasi@gmail.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "Restaurant SHASI <onboarding@resend.dev>";
const SITE_URL = (process.env.URL || "https://restaurantshasi.me").replace(/\/$/, "");
const OWNER_PHONE = process.env.OWNER_PHONE || "+382 69 567 555";

const TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

function b64urlEncode(buf) {
  return Buffer.from(buf).toString("base64url");
}

function signPayload(payload) {
  const json = JSON.stringify({ ...payload, exp: Date.now() + TOKEN_TTL_MS });
  const body = b64urlEncode(json);
  const sig = crypto.createHmac("sha256", RESERVATION_SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifyToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", RESERVATION_SECRET).update(body).digest("base64url");
  const a = Buffer.from(sig || "");
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

async function sendEmail({ to, subject, html }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html, text: htmlToText(html) })
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Resend error ${res.status}: ${errText}`);
  }
  return res.json();
}

/* plain-text fallback derived from the HTML body — improves spam-filter trust
   for multipart emails and gives clients without HTML rendering something readable */
function htmlToText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/(p|div|tr|h1|h2|h3)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/* very small, safe HTML escaping for values interpolated into email markup */
function esc(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

function wrapEmail(bodyHtml) {
  return `<div style="font-family:Georgia,'Times New Roman',serif;background:#f4f1ea;padding:32px 16px;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #d8d3c4;border-radius:6px;padding:32px;">
      <p style="letter-spacing:.14em;text-transform:uppercase;font-size:12px;color:#7c8a68;margin:0 0 18px;">Restaurant SHASI</p>
      ${bodyHtml}
    </div>
  </div>`;
}

const RESERVE_TEXT = {
  en: {
    pendingSubject: "Your reservation request — Restaurant SHASI",
    pendingGreeting: (n) => `Hi ${esc(n)},`,
    pendingBody: "Thank you for your reservation request. Your table is not yet confirmed — the owner will review it shortly and you'll receive another email once it's confirmed or, if we're fully booked, declined.",
    confirmedSubject: "Your table is confirmed! — Restaurant SHASI",
    confirmedGreeting: (n) => `Dear ${esc(n)},`,
    confirmedBody: "Wonderful news — your table is confirmed! We can't wait to welcome you to Restaurant SHASI, on the shore of Lake Shasi.",
    declinedSubject: "About your reservation request — Restaurant SHASI",
    declinedGreeting: (n) => `Dear ${esc(n)},`,
    declinedBody: `Thank you for thinking of us. Unfortunately we are fully booked for the date and time you requested, so we're unable to confirm your table this time. Please feel free to try a different date or time, or call us directly at ${esc(OWNER_PHONE)}.`,
    date: "Date", time: "Time", guests: "Guests", duration: "Table held for 2 hours",
    signoff: "Warmly,<br/>Restaurant SHASI"
  },
  mne: {
    pendingSubject: "Vaš zahtjev za rezervaciju — Restoran SHASI",
    pendingGreeting: (n) => `Zdravo ${esc(n)},`,
    pendingBody: "Hvala na zahtjevu za rezervaciju. Vaš sto još nije potvrđen — vlasnik će uskoro pregledati zahtjev i dobićete još jedan email kada rezervacija bude potvrđena ili, ukoliko smo popunjeni, otkazana.",
    confirmedSubject: "Vaš sto je potvrđen! — Restoran SHASI",
    confirmedGreeting: (n) => `Poštovani/a ${esc(n)},`,
    confirmedBody: "Odlične vijesti — vaš sto je potvrđen! Jedva čekamo da vas dočekamo u restoranu SHASI, na obali Šaskog jezera.",
    declinedSubject: "O vašem zahtjevu za rezervaciju — Restoran SHASI",
    declinedGreeting: (n) => `Poštovani/a ${esc(n)},`,
    declinedBody: `Hvala što ste pomislili na nas. Nažalost, popunjeni smo za traženi datum i vrijeme, pa ovaj put ne možemo potvrditi vaš sto. Slobodno pokušajte sa drugim datumom ili vremenom, ili nas pozovite direktno na ${esc(OWNER_PHONE)}.`,
    date: "Datum", time: "Vrijeme", guests: "Broj gostiju", duration: "Sto se drži 2 sata",
    signoff: "Srdačno,<br/>Restoran SHASI"
  },
  sq: {
    pendingSubject: "Kërkesa juaj për rezervim — Restorant SHASI",
    pendingGreeting: (n) => `Përshëndetje ${esc(n)},`,
    pendingBody: "Faleminderit për kërkesën tuaj për rezervim. Tavolina juaj ende nuk është konfirmuar — pronari do ta shqyrtojë së shpejti dhe do të merrni një email tjetër sapo të konfirmohet, ose, nëse jemi plot, të refuzohet.",
    confirmedSubject: "Tavolina juaj është konfirmuar! — Restorant SHASI",
    confirmedGreeting: (n) => `I/E nderuar ${esc(n)},`,
    confirmedBody: "Lajme të mrekullueshme — tavolina juaj është konfirmuar! Mezi presim t'ju mirëpresim në Restorant SHASI, në breg të Liqenit të Shasit.",
    declinedSubject: "Rreth kërkesës suaj për rezervim — Restorant SHASI",
    declinedGreeting: (n) => `I/E nderuar ${esc(n)},`,
    declinedBody: `Faleminderit që na keni menduar. Fatkeqësisht jemi plot për datën dhe orën e kërkuar, kështu që këtë herë nuk mund të konfirmojmë tavolinën tuaj. Provoni një datë apo orë tjetër, ose na telefononi direkt në ${esc(OWNER_PHONE)}.`,
    date: "Data", time: "Ora", guests: "Numri i mysafirëve", duration: "Tavolina mbahet për 2 orë",
    signoff: "Përzemërsisht,<br/>Restorant SHASI"
  },
  de: {
    pendingSubject: "Ihre Reservierungsanfrage — Restaurant SHASI",
    pendingGreeting: (n) => `Hallo ${esc(n)},`,
    pendingBody: "Vielen Dank für Ihre Reservierungsanfrage. Ihr Tisch ist noch nicht bestätigt — der Inhaber wird Ihre Anfrage in Kürze prüfen, und Sie erhalten eine weitere E-Mail, sobald sie bestätigt oder, falls wir ausgebucht sind, abgelehnt wurde.",
    confirmedSubject: "Ihr Tisch ist bestätigt! — Restaurant SHASI",
    confirmedGreeting: (n) => `Liebe/r ${esc(n)},`,
    confirmedBody: "Großartige Neuigkeiten — Ihr Tisch ist bestätigt! Wir freuen uns darauf, Sie im Restaurant SHASI am Ufer des Shasi-Sees willkommen zu heißen.",
    declinedSubject: "Zu Ihrer Reservierungsanfrage — Restaurant SHASI",
    declinedGreeting: (n) => `Liebe/r ${esc(n)},`,
    declinedBody: `Vielen Dank, dass Sie an uns gedacht haben. Leider sind wir zum gewünschten Datum und zur gewünschten Uhrzeit ausgebucht und können Ihren Tisch dieses Mal nicht bestätigen. Versuchen Sie gerne ein anderes Datum oder eine andere Uhrzeit, oder rufen Sie uns direkt an: ${esc(OWNER_PHONE)}.`,
    date: "Datum", time: "Uhrzeit", guests: "Anzahl der Gäste", duration: "Tisch wird für 2 Stunden gehalten",
    signoff: "Herzliche Grüße,<br/>Restaurant SHASI"
  },
  ru: {
    pendingSubject: "Ваш запрос на бронирование — Ресторан SHASI",
    pendingGreeting: (n) => `Здравствуйте, ${esc(n)},`,
    pendingBody: "Спасибо за ваш запрос на бронирование. Ваш столик пока не подтверждён — владелец скоро рассмотрит запрос, и вы получите ещё одно письмо, как только бронирование будет подтверждено или, если мест нет, отклонено.",
    confirmedSubject: "Ваш столик подтверждён! — Ресторан SHASI",
    confirmedGreeting: (n) => `Уважаемый(ая) ${esc(n)},`,
    confirmedBody: "Отличные новости — ваш столик подтверждён! Мы с нетерпением ждём встречи с вами в ресторане SHASI, на берегу Шасского озера.",
    declinedSubject: "О вашем запросе на бронирование — Ресторан SHASI",
    declinedGreeting: (n) => `Уважаемый(ая) ${esc(n)},`,
    declinedBody: `Спасибо, что подумали о нас. К сожалению, на выбранную дату и время у нас нет свободных мест, поэтому в этот раз мы не можем подтвердить ваш столик. Пожалуйста, попробуйте другую дату или время, либо позвоните нам напрямую: ${esc(OWNER_PHONE)}.`,
    date: "Дата", time: "Время", guests: "Количество гостей", duration: "Столик удерживается 2 часа",
    signoff: "С наилучшими пожеланиями,<br/>Ресторан SHASI"
  }
};

function textFor(lang) {
  return RESERVE_TEXT[lang] || RESERVE_TEXT.en;
}

function detailsTableHtml(t, r) {
  return `<table style="width:100%;border-collapse:collapse;margin:18px 0;font-size:14px;color:#2c2c26;">
    <tr><td style="padding:6px 0;color:#7c8a68;">${esc(t.date)}</td><td style="padding:6px 0;text-align:right;">${esc(r.date)}</td></tr>
    <tr><td style="padding:6px 0;color:#7c8a68;">${esc(t.time)}</td><td style="padding:6px 0;text-align:right;">${esc(r.time)}</td></tr>
    <tr><td style="padding:6px 0;color:#7c8a68;">${esc(t.guests)}</td><td style="padding:6px 0;text-align:right;">${esc(r.guests)}</td></tr>
  </table>
  <p style="font-size:12px;color:#9a9382;margin:0 0 18px;">${esc(t.duration)}</p>`;
}

function pendingEmailHtml(r) {
  const t = textFor(r.lang);
  return wrapEmail(`
    <p style="margin:0 0 14px;font-size:16px;">${t.pendingGreeting(r.name)}</p>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#2c2c26;">${t.pendingBody}</p>
    ${detailsTableHtml(t, r)}
    <p style="margin:0;font-size:14px;color:#2c2c26;">${t.signoff}</p>
  `);
}

function confirmedEmailHtml(r) {
  const t = textFor(r.lang);
  return wrapEmail(`
    <p style="margin:0 0 14px;font-size:16px;">${t.confirmedGreeting(r.name)}</p>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#2c2c26;">${t.confirmedBody}</p>
    ${detailsTableHtml(t, r)}
    <p style="margin:0;font-size:14px;color:#2c2c26;">${t.signoff}</p>
  `);
}

function declinedEmailHtml(r) {
  const t = textFor(r.lang);
  return wrapEmail(`
    <p style="margin:0 0 14px;font-size:16px;">${t.declinedGreeting(r.name)}</p>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#2c2c26;">${t.declinedBody}</p>
    ${detailsTableHtml(t, r)}
    <p style="margin:0;font-size:14px;color:#2c2c26;">${t.signoff}</p>
  `);
}

function ownerEmailHtml(r, confirmUrl, declineUrl) {
  return wrapEmail(`
    <p style="margin:0 0 14px;font-size:16px;">New table reservation request</p>
    <table style="width:100%;border-collapse:collapse;margin:0 0 20px;font-size:14px;color:#2c2c26;">
      <tr><td style="padding:5px 0;color:#7c8a68;">Name</td><td style="padding:5px 0;text-align:right;">${esc(r.name)}</td></tr>
      <tr><td style="padding:5px 0;color:#7c8a68;">Email</td><td style="padding:5px 0;text-align:right;">${esc(r.email)}</td></tr>
      <tr><td style="padding:5px 0;color:#7c8a68;">Phone</td><td style="padding:5px 0;text-align:right;">${esc(r.phone || "—")}</td></tr>
      <tr><td style="padding:5px 0;color:#7c8a68;">Date</td><td style="padding:5px 0;text-align:right;">${esc(r.date)}</td></tr>
      <tr><td style="padding:5px 0;color:#7c8a68;">Time</td><td style="padding:5px 0;text-align:right;">${esc(r.time)} (2h hold)</td></tr>
      <tr><td style="padding:5px 0;color:#7c8a68;">Guests</td><td style="padding:5px 0;text-align:right;">${esc(r.guests)}</td></tr>
      <tr><td style="padding:5px 0;color:#7c8a68;">Notes</td><td style="padding:5px 0;text-align:right;">${esc(r.notes || "—")}</td></tr>
      <tr><td style="padding:5px 0;color:#7c8a68;">Language</td><td style="padding:5px 0;text-align:right;">${esc(r.lang)}</td></tr>
    </table>
    <div style="text-align:center;">
      <a href="${confirmUrl}" style="display:inline-block;margin:0 8px 10px;padding:12px 22px;background:#5c7a5f;color:#fff;text-decoration:none;border-radius:4px;font-size:14px;">Confirm reservation</a>
      <a href="${declineUrl}" style="display:inline-block;margin:0 8px 10px;padding:12px 22px;background:#b5533d;color:#fff;text-decoration:none;border-radius:4px;font-size:14px;">Decline (fully booked)</a>
    </div>
    <p style="margin:18px 0 0;font-size:12px;color:#9a9382;">One click confirms or declines and emails the guest automatically. No login needed.</p>
  `);
}

function resultPageHtml({ title, message }) {
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${esc(title)}</title>
  <style>
    body{font-family:Georgia,'Times New Roman',serif;background:#f4f1ea;color:#2c2c26;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:24px;}
    .card{max-width:420px;background:#fff;border:1px solid #d8d3c4;border-radius:6px;padding:36px;text-align:center;}
    h1{font-size:20px;margin:0 0 12px;}
    p{font-size:15px;line-height:1.6;color:#4a4a3f;}
  </style></head>
  <body><div class="card"><h1>${esc(title)}</h1><p>${esc(message)}</p></div></body></html>`;
}

module.exports = {
  RESEND_API_KEY,
  RESERVATION_SECRET,
  OWNER_EMAIL,
  SITE_URL,
  signPayload,
  verifyToken,
  sendEmail,
  esc,
  pendingEmailHtml,
  confirmedEmailHtml,
  declinedEmailHtml,
  ownerEmailHtml,
  resultPageHtml,
  textFor
};
