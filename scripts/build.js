/* Static page generator — no framework, just Node + template literals.
   Run with: node scripts/build.js
   Produces, for each language in LANGS:
     /            (en, at the site root)
     /mne/ /sq/ /de/ /ru/        (homepage)
     /privacy/ /mne/privacy/ ... (privacy policy)
   Each page has its translated text baked directly into the HTML (not
   swapped in by JS after load), so search engines can index every
   language on its own URL. The generated files are committed to the
   repo — Netlify needs no build step, deploys stay exactly as fast and
   cheap as before. Re-run this script and commit the output whenever
   data.js or this script changes. */
const fs = require("fs");
const path = require("path");
const data = require("../data.js");
const { PRIVACY, PRIVACY_TURNSTILE } = require("../privacy-data.js");
const R = require("./render.js");

const ROOT = path.resolve(__dirname, "..");
const SITE_URL = "https://www.restaurantshasi.me";
const LANGS = data.LANGS;
const HREFLANG = { en: "en", mne: "sr-ME", sq: "sq", de: "de", ru: "ru" };

function langPrefix(lang) {
  return lang === "en" ? "" : "/" + lang;
}

const FRAME_CORNER_SVG = '<svg viewBox="0 0 42 42" fill="none"><path d="M2 2C12 6 16 16 13 27" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M2 2C9 9 10 18 6 25" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M2 2C16 4 24 11 26 22" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><g transform="translate(26,22)" fill="currentColor"><circle cx="0" cy="-3.2" r="2.1"/><circle cx="2.8" cy="-1" r="2.1"/><circle cx="1.7" cy="2.6" r="2.1"/><circle cx="-1.7" cy="2.6" r="2.1"/><circle cx="-2.8" cy="-1" r="2.1"/><circle cx="0" cy="0" r="1.3" fill-opacity=".6"/></g><g transform="translate(13,27)" fill="currentColor"><circle cx="0" cy="-2.3" r="1.5" fill-opacity=".9"/><circle cx="2" cy="-0.7" r="1.5" fill-opacity=".9"/><circle cx="1.2" cy="1.9" r="1.5" fill-opacity=".9"/><circle cx="-1.2" cy="1.9" r="1.5" fill-opacity=".9"/><circle cx="-2" cy="-0.7" r="1.5" fill-opacity=".9"/></g></svg>';
function frameCorners() {
  return `<span class="frame-corner tl" aria-hidden="true">${FRAME_CORNER_SVG}</span>
        <span class="frame-corner tr" aria-hidden="true">${FRAME_CORNER_SVG}</span>
        <span class="frame-corner bl" aria-hidden="true">${FRAME_CORNER_SVG}</span>
        <span class="frame-corner br" aria-hidden="true">${FRAME_CORNER_SVG}</span>`;
}

function headCommon() {
  return `<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<link rel="icon" type="image/png" sizes="64x64" href="${rel("media/favicon-64.png")}" />
<link rel="apple-touch-icon" href="${rel("media/apple-touch-icon.png")}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Karla:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="${rel("styles.css")}" />`;
}

/* `rel()` is rebound per page by buildPage()/buildPrivacyPage() to the right
   relative depth; declared here only so headCommon() can reference it */
let rel;

function hreflangLinks(pagePath) {
  const links = LANGS.map((l) =>
    `<link rel="alternate" hreflang="${HREFLANG[l]}" href="${SITE_URL}${langPrefix(l)}/${pagePath}" />`
  ).join("\n");
  return links + `\n<link rel="alternate" hreflang="x-default" href="${SITE_URL}/${pagePath}" />`;
}

function langSwitcher(lang, pagePath) {
  return LANGS.map((code) => {
    const active = code === lang;
    const href = `${SITE_URL}${langPrefix(code)}/${pagePath}`;
    return `<li><a href="${href}"${active ? ' class="active" aria-current="true"' : ""}>${esc(data.LANG_LABELS[code])}</a></li>`;
  }).join("\n");
}

const esc = R.esc;

function header(lang, pagePath) {
  const t = data.UI[lang];
  const home = langPrefix(lang) + "/";
  // pages with no dark hero (currently: privacy) need the dark-text header
  // styling from first paint, not just once script.js adds it on load
  const scrolledClass = pagePath === "" ? "" : " scrolled";
  return `<header class="site-header${scrolledClass}" id="top">
  <div class="header-inner">
    <a class="brand" href="${pagePath === "" ? "#top" : home}" aria-label="Restaurant SHASI"><img class="brand-logo" src="${rel("media/logo.svg")}" alt="Restaurant SHASI" width="58" height="58" /></a>

    <nav class="main-nav" id="main-nav">
      <a href="${pagePath === "" ? "#top" : home}">${esc(t.nav_home)}</a>
      <a href="${home}#about">${esc(t.nav_about)}</a>
      <a href="${home}#moments">${esc(t.nav_moments)}</a>
      <a href="${home}#menu">${esc(t.nav_menu)}</a>
      <a href="${home}#activities">${esc(t.nav_activities)}</a>
      <a href="${home}#reservations">${esc(t.nav_reservations)}</a>
      <a href="${home}#location">${esc(t.nav_location)}</a>
      <a href="${home}#contact">${esc(t.nav_contact)}</a>
    </nav>

    <div class="header-actions">
      <div class="lang-switch">
        <button class="lang-btn" id="lang-btn" aria-haspopup="listbox" aria-expanded="false">
          <span id="lang-current">${lang.toUpperCase()}</span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5"/></svg>
        </button>
        <ul class="lang-list" id="lang-list" role="listbox">
          ${langSwitcher(lang, pagePath)}
        </ul>
      </div>
      <button class="menu-toggle" id="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>`;
}

function footer(lang, pagePath) {
  const t = data.UI[lang];
  return `<footer class="site-footer">
  <div class="section-inner footer-inner">
    <span>Restaurant SHASI — Šasko Jezero, Ulcinj</span>
    <span>${esc(t.footer_rights)}</span>
    <a href="${langPrefix(lang)}/privacy/" class="footer-privacy">${esc(t.privacy_link)}</a>
  </div>
  <div class="section-inner footer-credit">
    Made by <a href="https://www.linkedin.com/in/adrian-m-193765139/" target="_blank" rel="noopener">Adrian Mehmeti</a>
  </div>
</footer>`;
}

function buildPage(lang) {
  rel = () => ""; // overwritten below once we know relative depth
  const depth = lang === "en" ? "./" : "../";
  rel = (p) => depth + p;

  const t = data.UI[lang];
  const canonical = `${SITE_URL}${langPrefix(lang)}/`;
  const title = `${t.hero_title} — Lake Shasi, Ulcinj`;
  const description = `${t.hero_subtitle}. ${t.location_text}.`;
  const ogLocale = { en: "en_US", mne: "sr_ME", sq: "sq_AL", de: "de_DE", ru: "ru_RU" }[lang];

  const html = `<!doctype html>
<html lang="${HREFLANG[lang].split("-")[0]}">
<head>
${headCommon()}
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${canonical}" />
${hreflangLinks("")}

<meta property="og:type" content="website" />
<meta property="og:site_name" content="Restaurant SHASI" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:image" content="${SITE_URL}/media/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="${ogLocale}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="${SITE_URL}/media/og-image.jpg" />

<script type="application/ld+json">
${JSON.stringify(structuredData(lang), null, 2)}
</script>
</head>
<body>

${header(lang, "")}

<main>

  <!-- CINEMATIC HERO -->
  <section class="hero" id="hero">
    <div class="hero-visual" aria-hidden="true">
      <canvas id="hero-canvas"></canvas>
      <video id="hero-video" muted loop autoplay playsinline preload="auto"></video>
      <div class="hero-visual-fade"></div>
    </div>
    <div class="section-inner hero-content-wrap">
      <div class="hero-copy">
        <span class="eyebrow">${esc(t.hero_tag)}</span>
        <h1>${esc(t.hero_title)}</h1>
        <p>${esc(t.hero_subtitle)}</p>
        <div class="hero-actions">
          <a href="#reservations" class="btn btn-primary">${esc(t.cta_reserve)}</a>
          <a href="#menu" class="btn btn-outline-light">${esc(t.cta_menu)}</a>
          <a id="hero-book" href="${esc(data.SITE.booking)}" target="_blank" rel="noopener" class="btn btn-ghost">${esc(t.cta_book)}</a>
        </div>
      </div>
    </div>
  </section>

  <!-- ABOUT -->
  <section class="section" id="about">
    <div class="section-inner about-grid">
      <div class="about-copy">
        <span class="eyebrow eyebrow-dark">${esc(t.about_title)}</span>
        <p class="about-text">${esc(data.ABOUT[lang])}</p>
      </div>
      <div class="about-media" aria-hidden="true">
        <svg viewBox="0 0 360 460" class="lake-illustration">
          <rect x="0" y="0" width="360" height="460" fill="none"/>
          <path d="M0 300 C 60 270 100 320 180 300 C 260 280 300 320 360 300 V460 H0 Z" fill="var(--dusk)"/>
          <path d="M0 340 C 60 320 110 355 180 335 C 250 315 300 350 360 335 V460 H0 Z" fill="var(--dusk-deep)"/>
          <g stroke="var(--reed-gold)" stroke-width="2" stroke-linecap="round" opacity="0.85">
            <path class="reed" d="M40 300 C 34 260 46 230 40 190"/>
            <path class="reed" d="M58 305 C 54 270 64 245 60 210"/>
            <path class="reed" d="M300 296 C 296 256 308 226 302 186"/>
            <path class="reed" d="M320 302 C 316 268 326 240 322 206"/>
          </g>
          <circle cx="255" cy="95" r="34" fill="var(--reed-gold)" opacity="0.9"/>
        </svg>
      </div>
    </div>
  </section>

  <!-- MOMENTS -->
  <section class="section section-alt" id="moments">
    <div class="section-inner">
      <div class="moments-head">
        <span class="eyebrow eyebrow-dark">${esc(t.moments_title)}</span>
        <p>${esc(t.moments_subtitle)}</p>
      </div>
      <div id="moments-embeds" class="moments-grid"></div>
      <a id="moments-fallback" class="moments-fallback" href="${esc(data.SITE.instagram)}" target="_blank" rel="noopener" hidden>
        <span class="moments-fallback-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 2.2c3.2 0 3.6 0 4.85.07 3.25.15 4.77 1.7 4.92 4.92.06 1.25.07 1.62.07 4.81s-.01 3.56-.07 4.81c-.15 3.2-1.66 4.77-4.92 4.92-1.25.06-1.62.07-4.85.07s-3.6-.01-4.85-.07c-3.26-.15-4.77-1.72-4.92-4.92-.06-1.25-.07-1.62-.07-4.81s.02-3.56.07-4.81C2.38 3.97 3.9 2.42 7.15 2.27 8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.14 0-3.5.01-4.74.07-2.27.1-3.34 1.19-3.44 3.44C3.76 8.75 3.75 9.11 3.75 12s.01 3.25.07 4.49c.1 2.25 1.16 3.34 3.44 3.44 1.24.06 1.6.07 4.74.07s3.5-.01 4.74-.07c2.27-.1 3.34-1.18 3.44-3.44.06-1.24.07-1.6.07-4.49s-.01-3.25-.07-4.49c-.1-2.25-1.17-3.34-3.44-3.44C15.5 4.01 15.14 4 12 4zm0 3.7a4.3 4.3 0 1 1 0 8.6 4.3 4.3 0 0 1 0-8.6zm0 1.8a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm4.5-2.1a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
        </span>
        <span id="moments-cta-text">${esc(t.moments_cta)}</span>
      </a>
    </div>
  </section>

  <!-- MENU -->
  <section class="section" id="menu">
    <div class="section-inner">
      <span class="eyebrow eyebrow-dark">${esc(t.menu_title)}</span>

      <div class="menu-frame">
        ${frameCorners()}

        <div class="menu-controls">
          <div class="menu-tabs" role="tablist" id="menu-tabs">
            <button class="menu-tab active" data-tab="food" role="tab" aria-selected="true">${esc(t.tab_food)}</button>
            <button class="menu-tab" data-tab="wine" role="tab" aria-selected="false">${esc(t.tab_wine)}</button>
            <button class="menu-tab" data-tab="drinks" role="tab" aria-selected="false">${esc(t.tab_drinks)}</button>
            <button class="menu-tab" data-tab="kids" role="tab" aria-selected="false">${esc(t.tab_kids)}</button>
          </div>
          <div class="menu-search">
            <input type="search" id="menu-search" placeholder="${esc(t.search_placeholder)}" />
          </div>
        </div>

        <div id="menu-panels">
          <div class="menu-panel active" data-panel="food" id="panel-food">${R.renderFoodLike(data.FOOD_MENU, lang)}</div>
          <div class="menu-panel" data-panel="wine" id="panel-wine">${R.renderWine(lang)}</div>
          <div class="menu-panel" data-panel="drinks" id="panel-drinks">${R.renderFoodLike(data.DRINKS_MENU, lang)}</div>
          <div class="menu-panel" data-panel="kids" id="panel-kids">${R.renderFoodLike(data.KIDS_MENU, lang)}</div>
        </div>
        <p class="no-results" id="no-results" hidden>${esc(t.no_results)}</p>
      </div>
    </div>
  </section>

  <!-- ACTIVITIES & CAMPING -->
  <section class="section" id="activities">
    <div class="section-inner">
      <span class="eyebrow eyebrow-dark">${esc(t.activities_title)}</span>
      <div class="activities-grid" id="activities-content">${R.renderActivities(lang)}</div>
    </div>
  </section>

  <!-- RESERVATIONS -->
  <section class="section" id="reservations">
    <div class="section-inner reservations-wrap">
      <span class="eyebrow eyebrow-dark">${esc(t.reserve_title)}</span>
      <p class="reserve-subtitle">${esc(t.reserve_subtitle)}</p>

      <div class="reservation-frame">
        ${frameCorners()}

        <form id="reservation-form" class="reservation-form" novalidate>
        <div class="form-row">
          <label>
            <span>${esc(t.reserve_name)}</span>
            <input type="text" name="name" required autocomplete="name" maxlength="100" />
          </label>
          <label>
            <span>${esc(t.reserve_guests)}</span>
            <input type="number" name="guests" min="1" max="60" value="2" required inputmode="numeric" />
          </label>
        </div>
        <div class="form-row">
          <label>
            <span>${esc(t.reserve_date)}</span>
            <input type="date" name="date" required />
          </label>
          <label>
            <span>${esc(t.reserve_time)}</span>
            <select name="time" required></select>
          </label>
        </div>
        <div class="form-row">
          <label>
            <span>${esc(t.reserve_email)}</span>
            <input type="email" name="email" required autocomplete="email" maxlength="150" />
          </label>
          <label>
            <span>${esc(t.reserve_phone)}</span>
            <input type="tel" name="phone" autocomplete="tel" maxlength="40" />
          </label>
        </div>
        <label class="form-full">
          <span>${esc(t.reserve_notes)}</span>
          <textarea name="notes" rows="2" maxlength="400"></textarea>
        </label>

        <div class="hp-field" aria-hidden="true"><label>Leave this empty<input type="text" name="hp" tabindex="-1" autocomplete="off" /></label></div>

        <button type="submit" class="btn btn-primary" id="reserve-submit">
          <span>${esc(t.reserve_submit)}</span>
        </button>
        <p class="reserve-consent"><span>${esc(t.reserve_consent)}</span> <a href="${langPrefix(lang)}/privacy/">${esc(t.reserve_consent_link)}</a>.</p>
        <p class="reservation-status" id="reservation-status" role="status" hidden></p>
        </form>
      </div>
    </div>
  </section>

  <!-- LOCATION -->
  <section class="section section-alt" id="location">
    <div class="section-inner location-grid">
      <div class="location-copy">
        <span class="eyebrow eyebrow-dark">${esc(t.location_title)}</span>
        <p>${esc(t.location_text)}</p>
        <a id="directions-link" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(data.SITE.mapQuery)}" target="_blank" rel="noopener" class="btn btn-outline-dark">${esc(t.directions)}</a>
      </div>
      <div class="map-wrap">
        <iframe
          id="map-frame"
          title="Restaurant SHASI location"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          src="${esc(data.SITE.mapEmbedSrc)}">
        </iframe>
        <a class="map-fallback" id="map-fallback-link" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(data.SITE.mapQuery)}" target="_blank" rel="noopener">
          <span>${esc(t.directions)}</span> ↗
        </a>
      </div>
    </div>
  </section>

  <!-- CONTACT -->
  <section class="section" id="contact">
    <div class="section-inner">
      <span class="eyebrow eyebrow-dark">${esc(t.contact_title)}</span>
      <div class="contact-grid">
        <div class="contact-card">
          <h3>${esc(t.phone_label)}</h3>
          <div id="phone-list" class="phone-list">${R.renderPhoneList()}</div>
        </div>
        <div class="contact-card">
          <h3>${esc(t.hours_label)}</h3>
          <div id="hours-list" class="hours-list">${R.renderHours(lang)}</div>
        </div>
        <div class="contact-card">
          <h3>${esc(t.rooms_label)}</h3>
          <p>${esc(t.rooms_text)}</p>
        </div>
        <div class="contact-card">
          <h3>${esc(t.book_label)}</h3>
          <a id="booking-link" href="${esc(data.SITE.booking)}" target="_blank" rel="noopener" class="btn btn-outline-dark">Booking.com ↗</a>
        </div>
        <div class="contact-card">
          <h3>${esc(t.follow_label)}</h3>
          <div class="social-links">
            <a id="ig-link" href="${esc(data.SITE.instagram)}" target="_blank" rel="noopener" class="social-btn" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 2.2c3.2 0 3.6 0 4.85.07 3.25.15 4.77 1.7 4.92 4.92.06 1.25.07 1.62.07 4.81s-.01 3.56-.07 4.81c-.15 3.2-1.66 4.77-4.92 4.92-1.25.06-1.62.07-4.85.07s-3.6-.01-4.85-.07c-3.26-.15-4.77-1.72-4.92-4.92-.06-1.25-.07-1.62-.07-4.81s.02-3.56.07-4.81C2.38 3.97 3.9 2.42 7.15 2.27 8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.14 0-3.5.01-4.74.07-2.27.1-3.34 1.19-3.44 3.44C3.76 8.75 3.75 9.11 3.75 12s.01 3.25.07 4.49c.1 2.25 1.16 3.34 3.44 3.44 1.24.06 1.6.07 4.74.07s3.5-.01 4.74-.07c2.27-.1 3.34-1.18 3.44-3.44.06-1.24.07-1.6.07-4.49s-.01-3.25-.07-4.49c-.1-2.25-1.17-3.34-3.44-3.44C15.5 4.01 15.14 4 12 4zm0 3.7a4.3 4.3 0 1 1 0 8.6 4.3 4.3 0 0 1 0-8.6zm0 1.8a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm4.5-2.1a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
              Instagram
            </a>
            ${data.SITE.facebook ? `<a id="fb-link" href="${esc(data.SITE.facebook)}" target="_blank" rel="noopener" class="social-btn" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.25-1.5 1.55-1.5H16.7V3.7C16.4 3.65 15.4 3.55 14.25 3.55c-2.4 0-4.05 1.47-4.05 4.15v2.25H7.5V13h2.7v8h3.3z"/></svg>
              Facebook
            </a>` : ""}
          </div>
        </div>
        <div class="contact-card">
          <h3>${esc(t.review_label)}</h3>
          <div class="social-links">
            <a id="tripadvisor-link" href="${esc(data.SITE.tripadvisor)}" target="_blank" rel="noopener" class="social-btn" aria-label="TripAdvisor">
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm0 5.2a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4Z"/><path fill="currentColor" d="M24 9.3c-1-.05-1.87.2-2.5.66C19.6 8.2 16 7.2 12 7.2S4.4 8.2 2.5 9.96c-.63-.46-1.5-.7-2.5-.66l1.5 1.65A6.2 6.2 0 0 0 0 15.2a6.15 6.15 0 0 0 10.9 3.9L12 20.4l1.1-1.3a6.15 6.15 0 0 0 10.9-3.9c0-1.7-.72-3.24-1.87-4.3L24 9.3ZM5.85 19.6a4.4 4.4 0 1 1 0-8.8 4.4 4.4 0 0 1 0 8.8Zm12.3 0a4.4 4.4 0 1 1 0-8.8 4.4 4.4 0 0 1 0 8.8ZM12 8.9c1.5 0 2.94.16 4.24.46a6.14 6.14 0 0 0-4.24 2.16 6.14 6.14 0 0 0-4.24-2.16C9.06 9.06 10.5 8.9 12 8.9Z"/></svg>
              TripAdvisor
            </a>
            <a id="google-review-link" href="${esc(data.SITE.googleReview)}" target="_blank" rel="noopener" class="social-btn" aria-label="Google">
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/><path fill="currentColor" d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"/></svg>
              Google
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

</main>

${footer(lang, "")}

<script src="${rel("site-data.js")}"></script>
<script src="i18n.js"></script>
<script src="${rel("script.js")}"></script>
</body>
</html>
`;
  return html;
}

function structuredData(lang) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Restaurant SHASI",
    image: `${SITE_URL}/media/og-image.jpg`,
    url: `${SITE_URL}${langPrefix(lang)}/`,
    telephone: data.SITE.phones[0],
    servesCuisine: ["Seafood", "Mediterranean", "Montenegrin"],
    priceRange: "€€",
    acceptsReservations: "True",
    address: { "@type": "PostalAddress", streetAddress: "Šasko jezero", addressLocality: "Ulcinj", addressCountry: "ME" },
    geo: { "@type": "GeoCoordinates", latitude: 41.9799378, longitude: 19.3375589 },
    hasMap: "https://www.google.com/maps?q=Restaurant+SHASI+%C5%A0asko+jezero+Ulcinj",
    sameAs: [data.SITE.instagram, data.SITE.facebook, data.SITE.tripadvisor, data.SITE.booking].filter(Boolean),
    openingHoursSpecification: data.HOURS.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: h.open,
      closes: h.close
    }))
  };
}

function buildPrivacyPage(lang) {
  rel = (p) => (lang === "en" ? "../" : "../../") + p;
  const t = data.UI[lang];
  const p = PRIVACY[lang];
  const canonical = `${SITE_URL}${langPrefix(lang)}/privacy/`;
  const sections = p.sections.map(([h, body], i) => {
    let text = body.replace(/\{email\}/g, data.SITE.email);
    if (i === 3 && data.SITE.turnstileSiteKey) text += PRIVACY_TURNSTILE[lang];
    return `<h2>${esc(h)}</h2><p>${esc(text)}</p>`;
  }).join("\n");

  return `<!doctype html>
<html lang="${HREFLANG[lang].split("-")[0]}">
<head>
${headCommon()}
<title>${esc(p.title)} — Restaurant SHASI</title>
<meta name="description" content="How Restaurant SHASI handles personal data collected through the table reservation form." />
<meta name="robots" content="noindex" />
<link rel="canonical" href="${canonical}" />
${hreflangLinks("privacy/")}
</head>
<body>

${header(lang, "privacy/")}

<main class="privacy-page">
  <div class="section-inner privacy-inner">
    <a href="${langPrefix(lang)}/" class="privacy-back">${esc(p.back)}</a>
    <h1>${esc(p.title)}</h1>
    <p class="privacy-updated">${esc(p.updated)}</p>
    ${sections}
  </div>
</main>

${footer(lang, "privacy/")}

<script src="${rel("script.js")}"></script>
</body>
</html>
`;
}

function write(relPath, content) {
  const full = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log("wrote", relPath);
}

function main() {
  LANGS.forEach((lang) => {
    write(lang === "en" ? "index.html" : `${lang}/index.html`, buildPage(lang));
    write(lang === "en" ? "privacy/index.html" : `${lang}/privacy/index.html`, buildPrivacyPage(lang));
  });

  // site-data.js: one copy at the root, shared by every language (the
  // reservation form's slot builder only needs months/open/close, not the
  // translated period labels, so this is deliberately a reduced HOURS)
  const siteData = `/* generated by scripts/build.js — do not edit by hand */
const SITE = ${JSON.stringify(data.SITE, null, 2)};
const HOURS = ${JSON.stringify(data.HOURS.map((h) => ({ months: h.months, open: h.open, close: h.close })), null, 2)};
const SLOT_STEP_MIN = ${data.SLOT_STEP_MIN};
const LAST_SEATING_BEFORE_CLOSE_MIN = ${data.LAST_SEATING_BEFORE_CLOSE_MIN};
const MOMENTS = ${JSON.stringify(data.MOMENTS)};
`;
  write("site-data.js", siteData);

  // i18n.js: tiny, per-language — only the strings the reservation form's
  // JS needs at runtime (status messages); everything else is already
  // baked into the page's static HTML
  LANGS.forEach((lang) => {
    const t = data.UI[lang];
    const i18n = `/* generated by scripts/build.js — do not edit by hand */
const PAGE_LANG = "${lang}";
const RESERVE_UI = ${JSON.stringify({
      reserve_time_none: t.reserve_time_none,
      reserve_sending: t.reserve_sending,
      reserve_success: t.reserve_success,
      reserve_error: t.reserve_error,
      reserve_error_busy: t.reserve_error_busy,
      reserve_error_fields: t.reserve_error_fields
    }, null, 2)};
`;
    write(lang === "en" ? "i18n.js" : `${lang}/i18n.js`, i18n);
  });

  // sitemap covers every generated URL
  const urls = [];
  LANGS.forEach((lang) => {
    urls.push({ loc: `${SITE_URL}${langPrefix(lang)}/`, priority: lang === "en" ? "1.0" : "0.8" });
    urls.push({ loc: `${SITE_URL}${langPrefix(lang)}/privacy/`, priority: "0.1" });
  });
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u.loc}</loc><changefreq>monthly</changefreq><priority>${u.priority}</priority></url>`).join("\n") +
    `\n</urlset>\n`;
  write("sitemap.xml", sitemap);

  console.log(`\nBuilt ${LANGS.length} languages x 2 pages = ${LANGS.length * 2} pages.`);
}

main();
