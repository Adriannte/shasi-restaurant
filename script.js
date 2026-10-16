(function () {
  "use strict";

  let currentTab = "food";
  let searchTerm = "";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- menu search: filters the already-rendered static markup
     (the menu/wine/activities HTML is baked in at build time — see
     scripts/build.js — so there's no client-side data to re-render) ---------- */
  function matchesSearch(text) {
    return !searchTerm || text.toLowerCase().includes(searchTerm);
  }

  function applySearchFilter() {
    document.querySelectorAll(".menu-panel").forEach((panel) => {
      let panelVisible = false;
      panel.querySelectorAll(".menu-category").forEach((cat) => {
        const catName = cat.dataset.catName || "";
        let catVisible = false;

        cat.querySelectorAll(".wine-group").forEach((group) => {
          let groupVisible = false;
          group.querySelectorAll(".menu-item").forEach((item) => {
            const match = matchesSearch(catName) || matchesSearch(item.textContent);
            item.hidden = !match;
            if (match) groupVisible = true;
          });
          group.hidden = !groupVisible;
          if (groupVisible) catVisible = true;
        });

        // categories with plain items (no wine-group wrapper)
        if (!cat.querySelector(".wine-group")) {
          cat.querySelectorAll(".menu-item").forEach((item) => {
            const match = matchesSearch(catName) || matchesSearch(item.textContent);
            item.hidden = !match;
            if (match) catVisible = true;
          });
        }

        cat.hidden = !catVisible;
        if (catVisible) panelVisible = true;
      });
      panel.dataset.anyVisible = panelVisible ? "1" : "0";
    });
    updateNoResults();
  }

  function updateNoResults() {
    const active = document.querySelector(".menu-panel.active");
    document.getElementById("no-results").hidden = !active || active.dataset.anyVisible !== "0";
  }

  function initSearch() {
    const input = document.getElementById("menu-search");
    if (!input) return; // no menu on this page (e.g. the privacy page)
    input.addEventListener("input", () => {
      searchTerm = input.value.trim().toLowerCase();
      applySearchFilter();
    });
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
        updateNoResults();
      });
    });
  }

  /* ---------- reservations ---------- */
  function initReservationForm() {
    const form = document.getElementById("reservation-form");
    if (!form) return; // no reservation form on this page (e.g. the privacy page)
    const status = document.getElementById("reservation-status");
    const submitBtn = document.getElementById("reserve-submit");
    const dateInput = form.querySelector('input[name="date"]');
    const timeSelect = form.querySelector('select[name="time"]');
    const formReadyAt = Date.now();

    // optional bot check: only active when SITE.turnstileSiteKey is set
    if (SITE.turnstileSiteKey) {
      const widget = document.createElement("div");
      widget.className = "cf-turnstile";
      widget.dataset.sitekey = SITE.turnstileSiteKey;
      form.insertBefore(widget, submitBtn);
      const ts = document.createElement("script");
      ts.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      ts.async = true;
      ts.defer = true;
      document.head.appendChild(ts);
    }
    // local calendar date, not UTC — toISOString() would show "yesterday"
    // for anyone in a timezone ahead of UTC during the first hour or two
    // of their day (e.g. Montenegro, UTC+1/+2)
    const localISODate = (d) =>
      d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    const today = new Date();
    dateInput.min = localISODate(today);

    const toMin = (hhmm) => parseInt(hhmm.slice(0, 2), 10) * 60 + parseInt(hhmm.slice(3, 5), 10);
    const toHHMM = (m) =>
      String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");

    // 30-minute slots for the opening hours of the chosen date's season;
    // today's already-passed slots are left out
    function buildTimeSlots() {
      const previous = timeSelect.value;
      const chosen = dateInput.value ? new Date(dateInput.value + "T00:00:00") : new Date();
      const season = HOURS.find((h) => h.months.includes(chosen.getMonth() + 1));
      const isToday = chosen.toDateString() === new Date().toDateString();
      const nowMin = new Date().getHours() * 60 + new Date().getMinutes();

      timeSelect.innerHTML = "";
      const first = document.createElement("option");
      first.value = "";
      first.textContent = "--:--";
      first.disabled = true;
      first.selected = true;
      timeSelect.appendChild(first);

      const last = toMin(season.close) - LAST_SEATING_BEFORE_CLOSE_MIN;
      for (let m = toMin(season.open); m <= last; m += SLOT_STEP_MIN) {
        if (isToday && m <= nowMin) continue;
        const opt = document.createElement("option");
        opt.value = opt.textContent = toHHMM(m);
        timeSelect.appendChild(opt);
      }
      if (previous && [...timeSelect.options].some((o) => o.value === previous)) {
        timeSelect.value = previous;
      }
      if (timeSelect.options.length === 1) first.textContent = RESERVE_UI.reserve_time_none;
    }
    dateInput.addEventListener("change", buildTimeSlots);
    dateInput.addEventListener("input", buildTimeSlots);
    buildTimeSlots();

    function showStatus(key, kind) {
      status.textContent = RESERVE_UI[key];
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
      data.lang = PAGE_LANG;
      data.elapsed = Date.now() - formReadyAt;

      submitBtn.disabled = true;
      showStatus("reserve_sending", "pending");

      try {
        const res = await fetch("/.netlify/functions/reserve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (res.status === 429) {
          showStatus("reserve_error_busy", "error");
          return;
        }
        if (!res.ok) throw new Error("request failed");
        showStatus("reserve_success", "success");
        form.reset();
        dateInput.min = localISODate(new Date());
        buildTimeSlots();
      } catch (err) {
        showStatus("reserve_error", "error");
      } finally {
        if (window.turnstile) window.turnstile.reset();
        submitBtn.disabled = false;
      }
    });
  }

  /* ---------- moments (official Instagram embeds, no scraping) ---------- */
  function initMoments() {
    const grid = document.getElementById("moments-embeds");
    const fallback = document.getElementById("moments-fallback");
    if (!grid) return; // no moments section on this page (e.g. the privacy page)

    if (!MOMENTS || !MOMENTS.length) {
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
    // the "scrolled" styling (dark text/logo) is the only one with enough
    // contrast against a plain light page — pages with no dark hero to
    // start over (e.g. the privacy page) should use it from the start,
    // not just after scrolling 60px
    if (!document.querySelector(".hero")) {
      header.classList.add("scrolled");
      return;
    }
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
    if (!video) return; // no hero video on this page (e.g. the privacy page)
    if (!SITE.heroVideo) return;
    if (SITE.heroPoster) video.poster = SITE.heroPoster;

    const source = document.createElement("source");
    source.src = SITE.heroVideo;
    source.type = "video/mp4";
    video.appendChild(source);

    const tryPlay = () => video.play().catch(() => {});
    // Only reveal the video once it's ACTUALLY playing — not just loaded.
    // iOS Low Power Mode (and similar battery-saver modes) blocks autoplay
    // outright: play() rejects, but the video would still have enough data
    // to show a paused frame with a native (non-functional, since taps on
    // it don't satisfy the OS-level autoplay block) play button. Waiting
    // for "playing" keeps the canvas fallback visible instead in that case.
    video.addEventListener("playing", () => video.classList.add("ready"));
    // mobile networks often haven't buffered enough right after load() —
    // keep retrying as more data arrives instead of giving up after one try
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("canplaythrough", tryPlay);
    video.addEventListener("error", () => video.remove());
    video.load();
    tryPlay();
  }

  function initHeroCanvas() {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return; // no hero on this page (e.g. the privacy page)
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

    // language links now navigate to the sibling URL (/mne/, /de/, …)
    // instead of swapping text in place — only the open/close state is JS
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
    initHeaderInteractions();
    initHeaderScroll();
    initTabs();
    initSearch();
    initReservationForm();
    initMoments();
    initHeroCanvas();
    initHeroVideo();
    initReveal();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
