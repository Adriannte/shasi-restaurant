# Restaurant SHASI website

Static site (no framework — plain HTML/CSS/JS) + a few Netlify Functions
for the table reservation flow. Live at https://www.restaurantshasi.me/

## How the site is structured

- `data.js` — **all content and translations** (menu, hours, UI text, the
  About text). This is the only file to edit when prices, hours or copy
  change. It is Node-only at build time — never shipped to the browser.
- `scripts/build.js` + `scripts/render.js` — the static page generator.
  Reads `data.js` and `privacy-data.js` and writes fully-translated,
  ready-to-serve HTML for every language, to:
  - `/` (English, at the site root) and `/mne/`, `/sq/`, `/de/`, `/ru/`
  - `/privacy/` and `/mne/privacy/`, `/sq/privacy/`, `/de/privacy/`, `/ru/privacy/`
  - `site-data.js` (shared) and `i18n.js` per language — the small amount
    of data the reservation form's JS needs at runtime
  - `sitemap.xml`
- `script.js` / `styles.css` — the client-side behaviour (menu search,
  tabs, reservation form, hero video, etc.) and all styling. Shared by
  every generated page.
- `netlify/functions/` — the reservation backend (`reserve.js`,
  `respond.js`, plus shared helpers). See the comments in those files;
  `tests/functions.test.js` covers them (`npm test`).
- `netlify.toml` — security headers/CSP and the functions config. No
  build command is configured on purpose (see below).

## Updating content (menu, hours, prices, About text)

1. Edit `data.js` (and `privacy-data.js` for the privacy policy text).
2. Run `npm run build` — regenerates every language's HTML.
3. Review the diff, commit, and push (pushing to `main` auto-deploys on
   Netlify — see the project's own notes on only deploying when asked,
   since each deploy costs Netlify credits).

**Don't hand-edit the generated files** (`index.html`, `mne/`, `sq/`,
`de/`, `ru/`, `privacy/`, `site-data.js`, `i18n.js`, `sitemap.xml`) —
anything typed into them is overwritten by the next `npm run build`.

## Why the generated HTML is committed (no Netlify build step)

`npm run build` is run locally and its output is committed to the repo,
rather than having Netlify run it on every deploy. This keeps deploys
exactly as fast/cheap as a plain static site (no build minutes, nothing
that can fail on Netlify's infrastructure in a way that's hard to debug
remotely). The tradeoff is remembering to run `npm run build` before
pushing a content change — the generated files are deliberately committed
so that's visible in the diff if forgotten.

## Local development

```bash
npm install
npm run build        # generate the HTML from data.js
npm test             # run the reservation backend's test suite
python -m http.server 8000   # or any static file server, from this folder
```

The reservation form will show network errors when run this way, since
the Netlify Functions aren't running — that's expected locally.

## Environment variables (Netlify → Site configuration → Environment variables)

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | yes | Sends the reservation emails via [Resend](https://resend.com) |
| `RESERVATION_SECRET` | yes | Signs the confirm/decline links and rate-limit keys — keep secret |
| `OWNER_EMAIL` | no (defaults to the address in `data.js`) | Where new reservation requests are sent |
| `FROM_EMAIL` | no | Sender address for outgoing emails (needs a verified domain in Resend) |
| `TURNSTILE_SECRET_KEY` | no | Enables the Cloudflare Turnstile bot check — also set `SITE.turnstileSiteKey` in `data.js` |
