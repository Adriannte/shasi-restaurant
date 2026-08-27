(function () {
  "use strict";

  let currentLang = localStorage.getItem("shasi_lang") || "en";
  if (!LANGS.includes(currentLang)) currentLang = "en";
  let currentTab = "food";
  let searchTerm = "";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const PHONE_ICON =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
  const MAIL_ICON =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>';

  /* ---------- static links ---------- */
  function initStaticLinks() {
    document.getElementById("booking-link").href = SITE.booking;
    document.getElementById("hero-book").href = SITE.booking;
    document.getElementById("ig-link").href = SITE.instagram;
    document.getElementById("tripadvisor-link").href = SITE.tripadvisor;
    document.getElementById("google-review-link").href = SITE.googleReview;

    const fbLink = document.getElementById("fb-link");
    if (SITE.facebook) {
      fbLink.href = SITE.facebook;
      fbLink.hidden = false;
    }

    document.getElementById("map-frame").src = SITE.mapEmbedSrc;
    const directionsUrl =
      "https://www.google.com/maps/dir/?api=1&destination=" +
      encodeURIComponent(SITE.mapQuery);
    document.getElementById("directions-link").href = directionsUrl;
    document.getElementById("map-fallback-link").href = directionsUrl;

    const phoneList = document.getElementById("phone-list");
    phoneList.innerHTML = "";
    SITE.phones.forEach((p) => {
      const a = document.createElement("a");
      a.href = "tel:" + p.replace(/\s+/g, "");
      a.innerHTML = PHONE_ICON + "<span>" + p + "</span>";
      phoneList.appendChild(a);
    });
    if (SITE.email) {
      const a = document.createElement("a");
      a.href = "mailto:" + SITE.email;
      a.innerHTML = MAIL_ICON + "<span>" + SITE.email + "</span>";
      phoneList.appendChild(a);
    }
  }

  function renderHours() {
    const list = document.getElementById("hours-list");
    list.innerHTML = "";
    HOURS.forEach((row) => {
      const line = document.createElement("div");
      line.className = "hours-row";
      line.innerHTML =
        '<span class="hours-period">' + row.period[currentLang] + "</span>" +
        '<span class="hours-time">' + row.time + "</span>";
      list.appendChild(line);
    });
  }

  function renderActivities() {
    const container = document.getElementById("activities-content");
    container.innerHTML = "";
    ACTIVITIES_MENU.forEach((cat) => {
      const block = document.createElement("div");
      block.className = "menu-category";
      const h3 = document.createElement("h3");
      h3.textContent = cat.name[currentLang];
      block.appendChild(h3);
      cat.items.forEach((item) => {
        const row = document.createElement("div");
        row.className = "menu-item";
        row.innerHTML = itemRowHtml(item.name[currentLang], item.unit[currentLang], item.price);
        block.appendChild(row);
      });
      if (cat.note) {
        const note = document.createElement("p");
        note.className = "menu-note";
        note.textContent = cat.note[currentLang];
        note.style.marginTop = "10px";
        block.appendChild(note);
      }
      container.appendChild(block);
    });
  }

  /* ---------- language ---------- */
  function buildLangMenu() {
    const list = document.getElementById("lang-list");
    list.innerHTML = "";
    LANGS.forEach((code) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.textContent = LANG_LABELS[code];
      btn.dataset.lang = code;
      if (code === currentLang) btn.classList.add("active");
      btn.addEventListener("click", () => {
        setLang(code);
        document.getElementById("lang-list").classList.remove("open");
        document.getElementById("lang-btn").setAttribute("aria-expanded", "false");
      });
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  function setLang(code) {
    currentLang = code;
    localStorage.setItem("shasi_lang", code);
    document.documentElement.lang = code === "mne" ? "sr" : code;
    document.getElementById("lang-current").textContent = code.toUpperCase();
    document.querySelectorAll("#lang-list button").forEach((b) => {
      b.classList.toggle("active", b.dataset.lang === code);
    });
    applyTranslations();
    renderMenu();
  }

  function applyTranslations() {
    const dict = UI[currentLang];
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key]) el.placeholder = dict[key];
    });
    document.getElementById("about-text").textContent = ABOUT[currentLang];
    document.getElementById("footer-rights").textContent = dict.footer_rights;
    document.getElementById("no-results").textContent = dict.no_results;
    renderHours();
    renderActivities();
  }

  /* ---------- menu rendering ---------- */
  function priceStr(v) {
    return v.toFixed(2) + " €";
  }

  function matchesSearch(text) {
    if (!searchTerm) return true;
    return text.toLowerCase().includes(searchTerm);
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function itemRowHtml(name, weight, price) {
    return (
      '<div><div class="menu-item-name">' + escapeHtml(name) + "</div>" +
      (weight ? '<span class="menu-item-weight">' + escapeHtml(weight) + "</span>" : "") +
      "</div>" +
      '<div class="menu-item-leader"></div>' +
      '<div class="menu-item-price">' + priceStr(price) + "</div>"
    );
  }

  function renderFoodLike(containerId, categories) {
    const el = document.getElementById(containerId);
    el.innerHTML = "";
    let anyVisible = false;

    categories.forEach((cat) => {
      const visibleItems = cat.items.filter((item) => {
        const name = typeof item.name === "string" ? item.name : item.name[currentLang];
        return matchesSearch(name) || matchesSearch(cat.name[currentLang]);
      });
      if (!visibleItems.length) return;
      anyVisible = true;

      const block = document.createElement("div");
      block.className = "menu-category";

      const h3 = document.createElement("h3");
      h3.textContent = cat.name[currentLang];
      block.appendChild(h3);

      if (cat.note) {
        const note = document.createElement("p");
        note.className = "menu-note";
        note.textContent = cat.note[currentLang];
        block.appendChild(note);
      }

      visibleItems.forEach((item) => {
        const name = typeof item.name === "string" ? item.name : item.name[currentLang];
        const row = document.createElement("div");
        row.className = "menu-item";
        row.innerHTML = itemRowHtml(name, item.weight, item.price);
        block.appendChild(row);
      });

      el.appendChild(block);
    });

    return anyVisible;
  }

  function renderWine(containerId) {
    const el = document.getElementById(containerId);
    el.innerHTML = "";
    let anyVisible = false;

    WINE_MENU.forEach((cat) => {
      const groupsWithItems = cat.groups
        .map((g) => ({
          country: g.country,
          items: g.items.filter((it) => matchesSearch(it.name) || matchesSearch(cat.name[currentLang]))
        }))
        .filter((g) => g.items.length);

      if (!groupsWithItems.length) return;
      anyVisible = true;

      const block = document.createElement("div");
      block.className = "menu-category";
      const h3 = document.createElement("h3");
      h3.textContent = cat.name[currentLang];
      block.appendChild(h3);

      groupsWithItems.forEach((g) => {
        const wrap = document.createElement("div");
        wrap.className = "wine-group";
        if (g.country) {
          const h4 = document.createElement("h4");
          h4.textContent = g.country[currentLang];
          wrap.appendChild(h4);
        }
        g.items.forEach((item) => {
          const row = document.createElement("div");
          row.className = "menu-item";
          row.innerHTML = itemRowHtml(item.name, item.vol, item.price);
          wrap.appendChild(row);
        });
        block.appendChild(wrap);
      });

      el.appendChild(block);
    });

    return anyVisible;
  }

  function renderMenu() {
    const visibility = {
      food: renderFoodLike("panel-food", FOOD_MENU),
      wine: renderWine("panel-wine"),
      drinks: renderFoodLike("panel-drinks", DRINKS_MENU),
      kids: renderFoodLike("panel-kids", KIDS_MENU)
    };
    document.getElementById("no-results").hidden = visibility[currentTab];
  }

  /* ---------- tabs ---------- */
  function initTabs() {
    document.querySelectorAll(".menu-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentTab = btn.dataset.tab;
        document.querySelectorAll(".menu-tab").forEach((b) => {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-selected", b === btn ? "true" : "false");
        });
        document.querySelectorAll(".menu-panel").forEach((p) => {
          p.classList.toggle("active", p.dataset.panel === currentTab);
        });
        renderMenu();
      });
    });
  }

  /* ---------- search ---------- */
  function initSearch() {
    const input = document.getElementById("menu-search");
    input.addEventListener("input", () => {
      searchTerm = input.value.trim().toLowerCase();
      renderMenu();
    });
  }

  /* ---------- reservations ---------- */
  function initReservationForm() {
    const form = document.getElementById("reservation-form");
    const status = document.getElementById("reservation-status");
    const submitBtn = document.getElementById("reserve-submit");
    const dateInput = form.querySelector('input[name="date"]');

    const today = new Date();
    dateInput.min = today.toISOString().slice(0, 10);

    function showStatus(key, kind) {
      status.textContent = UI[currentLang][key];
      status.hidden = false;
      status.className = "reservation-status " + kind;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) {
        showStatus("reserve_error_fields", "error");
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      data.guests = parseInt(data.guests, 10);
      data.lang = currentLang;

      submitBtn.disabled = true;
      showStatus("reserve_sending", "pending");

      try {
        const res = await fetch("/.netlify/functions/reserve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("request failed");
        showStatus("reserve_success", "success");
        form.reset();
        dateInput.min = today.toISOString().slice(0, 10);
      } catch (err) {
        showStatus("reserve_error", "error");
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  /* ---------- moments (official Instagram embeds, no scraping) ---------- */
  function initMoments() {
    const grid = document.getElementById("moments-embeds");
    const fallback = document.getElementById("moments-fallback");

    if (!MOMENTS || !MOMENTS.length) {
      fallback.href = SITE.instagram;
      fallback.hidden = false;
      return;
    }

    MOMENTS.forEach((url) => {
      const bq = document.createElement("blockquote");
      bq.className = "instagram-media";
      bq.setAttribute("data-instgrm-permalink", url);
      bq.setAttribute("data-instgrm-version", "14");
      grid.appendChild(bq);
    });

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    document.body.appendChild(script);
  }

  /* ---------- header scroll state ---------- */
  function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- reveal-on-scroll ---------- */
  function initReveal() {
    if (prefersReducedMotion) return;
    const targets = document.querySelectorAll(
      ".about-copy, .about-media, .moments-head, .moments-grid, .moments-fallback, " +
      ".location-copy, .map-wrap, .contact-grid"
    );
    targets.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach((el) => io.observe(el));
  }

  /* ---------- cinematic hero: real video if present, animated fallback otherwise ---------- */
  function initHeroVideo() {
    const video = document.getElementById("hero-video");
    if (!SITE.heroVideo) return;
    if (SITE.heroPoster) video.poster = SITE.heroPoster;

    const source = document.createElement("source");
    source.src = SITE.heroVideo;
    source.type = "video/mp4";
    video.appendChild(source);

    const tryPlay = () => video.play().catch(() => {});
    video.addEventListener("loadeddata", () => {
      video.classList.add("ready");
      tryPlay();
    });
    // mobile networks often haven't buffered enough right after load() —
    // keep retrying as more data arrives instead of giving up after one try
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("canplaythrough", tryPlay);
    video.addEventListener("error", () => video.remove());
    video.load();
    tryPlay();
  }

  function initHeroCanvas() {
    const canvas = document.getElementById("hero-canvas");
    const ctx = canvas.getContext("2d");
    let w, h, dpr;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const reeds = Array.from({ length: 22 }, (_, i) => ({
      x: Math.random(),
      h: 0.16 + Math.random() * 0.22,
      sway: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.4,
      w: 1.4 + Math.random() * 1.6
    }));
    const glints = Array.from({ length: 14 }, () => ({
      x: Math.random(),
      y: 0.62 + Math.random() * 0.32,
      r: 6 + Math.random() * 30,
      phase: Math.random() * Math.PI * 2,
      speed: 0.25 + Math.random() * 0.35
    }));

    function draw(t) {
      const time = t / 1000;
      ctx.clearRect(0, 0, w, h);

      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#0e211f");
      sky.addColorStop(0.45, "#16302e");
      sky.addColorStop(0.62, "#2c463a");
      sky.addColorStop(1, "#0e211f");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      const sunX = w * 0.72;
      const sunY = h * 0.42;
      const halo = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, h * 0.5);
      halo.addColorStop(0, "rgba(204,158,77,0.55)");
      halo.addColorStop(0.35, "rgba(204,158,77,0.14)");
      halo.addColorStop(1, "rgba(204,158,77,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);
      ctx.beginPath();
      ctx.fillStyle = "rgba(230,190,110,0.9)";
      ctx.arc(sunX, sunY, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#0a1a18";
      ctx.fillRect(0, h * 0.62, w, h * 0.38);

      glints.forEach((g) => {
        const yy = h * g.y;
        const flicker = 0.5 + 0.5 * Math.sin(time * g.speed + g.phase);
        ctx.globalAlpha = 0.12 + flicker * 0.28;
        ctx.fillStyle = "#e8c98a";
        ctx.fillRect(g.x * w, yy, g.r, 1.6);
        ctx.globalAlpha = 1;
      });

      reeds.forEach((r) => {
        const baseX = r.x * w;
        const baseY = h;
        const topH = r.h * h;
        const swayX = Math.sin(time * r.speed + r.sway) * 10;
        ctx.strokeStyle = "rgba(181,137,60,0.55)";
        ctx.lineWidth = r.w;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.quadraticCurveTo(baseX + swayX * 0.6, baseY - topH * 0.6, baseX + swayX, baseY - topH);
        ctx.stroke();
      });

      requestAnimationFrame(draw);
    }

    if (prefersReducedMotion) {
      draw(0);
    } else {
      requestAnimationFrame(draw);
    }
  }

  /* ---------- nav / lang toggles ---------- */
  function initHeaderInteractions() {
    const toggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("main-nav");

    // header is position:fixed, so anchoring straight to its #top id is
    // unreliable across browsers — scroll to the very top explicitly instead
    document.querySelectorAll('a[href="#top"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      });
    });
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );

    const langBtn = document.getElementById("lang-btn");
    const langList = document.getElementById("lang-list");
    langBtn.addEventListener("click", () => {
      const open = langList.classList.toggle("open");
      langBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".lang-switch")) {
        langList.classList.remove("open");
        langBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- init ---------- */
  function init() {
    initStaticLinks();
    buildLangMenu();
    initHeaderInteractions();
    initHeaderScroll();
    initTabs();
    initSearch();
    initReservationForm();
    initMoments();
    initHeroCanvas();
    initHeroVideo();
    setLang(currentLang);
    initReveal();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
