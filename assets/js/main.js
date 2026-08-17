/* =========================================================
   Lauren Gorman — site interactions
   ========================================================= */
(function () {
  "use strict";

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---- Current year ---- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Header state: transparent over hero, solid after ---- */
  var header = $("#site-header");
  var hero = $(".hero");

  if (header && hero && "IntersectionObserver" in window) {
    var headerObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        // Hero visible (any part) → transparent header; hero out of view → solid.
        header.classList.toggle("scrolled", !e.isIntersecting);
      });
    }, { rootMargin: "-72px 0px 0px 0px", threshold: 0 });
    headerObs.observe(hero);
  } else if (header) {
    // Fallback: scroll listener
    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.scrollY > (window.innerHeight - 80));
    }, { passive: true });
  }

  /* ---- Mobile nav toggle ---- */
  var toggle = $("#nav-toggle");
  var nav = $("#primary-nav");

  function closeNav() {
    if (!nav) return;
    nav.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Close on nav-link click (smooth-scroll then close)
    $$("a", nav).forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---- Scroll reveal (single + staggered) ---- */
  var revealEls = $$(".reveal, .reveal-stagger");
  if ("IntersectionObserver" in window) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { revObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---- Scroll-spy: highlight current section in nav ---- */
  var navLinks = $$('#primary-nav a[href^="#"]');
  var sectionIds = navLinks
    .map(function (a) { return a.getAttribute("href"); })
    .filter(function (h) { return h && h.length > 1; });
  var sections = sectionIds
    .map(function (id) { return document.querySelector(id); })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + id);
    });
  }

  if (sections.length && "IntersectionObserver" in window) {
    // Track which sections are intersecting; pick the one closest to top-visible.
    var visible = new Set();
    var spyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.add(e.target.id);
        else visible.delete(e.target.id);
      });
      // Pick the visible section with the smallest boundingClientRect.top >= 0-ish
      var best = null;
      var bestTop = Infinity;
      sections.forEach(function (sec) {
        if (!visible.has(sec.id)) return;
        var t = sec.getBoundingClientRect().top;
        // Prefer sections whose top is in the upper half of the viewport
        var score = Math.abs(t - 90); // 90px = below sticky header
        if (score < bestTop) { bestTop = score; best = sec.id; }
      });
      if (best) setActive(best);
    }, { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.1, 0.5, 1] });

    sections.forEach(function (sec) { spyObs.observe(sec); });
  }

  /* ---- Gallery lightbox (fade + scale) ---- */
  var lightbox = $("#lightbox");
  var lightboxImg = $("#lightbox-img");
  var closeBtn = lightbox ? $(".lightbox-close", lightbox) : null;

  function openLightbox(src, alt) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    // Clear src after the fade-out completes to avoid a flash of the previous image
    setTimeout(function () { lightboxImg.src = ""; }, 450);
  }

  if (lightbox) {
    $$(".gallery-item[data-full]").forEach(function (fig) {
      fig.addEventListener("click", function () {
        var img = $("img", fig);
        openLightbox(fig.getAttribute("data-full"), img ? img.alt : "");
      });
    });
    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
    });
  }
})();
