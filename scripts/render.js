/* Pure HTML-string renderers used only by scripts/build.js (Node, no DOM).
   These mirror what script.js used to build client-side with
   document.createElement — now baked into the static HTML at build time,
   so search engines see real content and the browser ships far less JS. */
const data = require("../data.js");

function esc(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

function priceStr(v) {
  return v.toFixed(2) + " €";
}

function itemRow(name, weight, price) {
  return (
    '<div class="menu-item">' +
    '<div><div class="menu-item-name">' + esc(name) + "</div>" +
    (weight ? '<span class="menu-item-weight">' + esc(weight) + "</span>" : "") +
    "</div>" +
    '<div class="menu-item-leader"></div>' +
    '<div class="menu-item-price">' + priceStr(price) + "</div>" +
    "</div>"
  );
}

/* Food-like categories: FOOD_MENU, DRINKS_MENU, KIDS_MENU all share this shape */
function renderFoodLike(categories, lang) {
  return categories.map((cat) => {
    const name = cat.name[lang];
    const items = cat.items
      .map((item) => itemRow(typeof item.name === "string" ? item.name : item.name[lang], item.weight, item.price))
      .join("");
    const note = cat.note ? `<p class="menu-note">${esc(cat.note[lang])}</p>` : "";
    return `<div class="menu-category" data-cat-name="${esc(name.toLowerCase())}">
      <h3>${esc(name)}</h3>
      ${note}
      ${items}
    </div>`;
  }).join("");
}

function renderWine(lang) {
  return data.WINE_MENU.map((cat) => {
    const name = cat.name[lang];
    const groups = cat.groups.map((g) => {
      const heading = g.country ? `<h4>${esc(g.country[lang])}</h4>` : "";
      const items = g.items.map((it) => itemRow(it.name, it.vol, it.price)).join("");
      return `<div class="wine-group">${heading}${items}</div>`;
    }).join("");
    return `<div class="menu-category" data-cat-name="${esc(name.toLowerCase())}">
      <h3>${esc(name)}</h3>
      ${groups}
    </div>`;
  }).join("");
}

function renderActivities(lang) {
  return data.ACTIVITIES_MENU.map((cat) => {
    const items = cat.items.map((item) => itemRow(item.name[lang], item.unit[lang], item.price)).join("");
    const note = cat.note ? `<p class="menu-note menu-note-spaced">${esc(cat.note[lang])}</p>` : "";
    return `<div class="menu-category">
      <h3>${esc(cat.name[lang])}</h3>
      ${items}
      ${note}
    </div>`;
  }).join("");
}

function renderHours(lang) {
  return data.HOURS.map((row) =>
    `<div class="hours-row"><span class="hours-period">${esc(row.period[lang])}</span><span class="hours-time">${esc(row.time)}</span></div>`
  ).join("");
}

const PHONE_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
const MAIL_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>';

/* identical in every language — phone numbers/email aren't translated */
function renderPhoneList() {
  const phones = data.SITE.phones.map((p) =>
    `<a href="tel:${esc(p.replace(/\s+/g, ""))}">${PHONE_ICON}<span>${esc(p)}</span></a>`
  ).join("");
  const email = data.SITE.email
    ? `<a href="mailto:${esc(data.SITE.email)}">${MAIL_ICON}<span>${esc(data.SITE.email)}</span></a>`
    : "";
  return phones + email;
}

module.exports = { esc, priceStr, itemRow, renderFoodLike, renderWine, renderActivities, renderHours, renderPhoneList };
