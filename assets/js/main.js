/* =========================================================
   Lauren Gorman — site interactions (multi-page)
   ========================================================= */
(function () {
  "use strict";

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---- Current year in footer ---- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Header state: transparent over Home hero, solid otherwise ---- */
  var header = $("#site-header");
  var hero = $(".hero");
  if (header && hero && "IntersectionObserver" in window) {
    // On Home, .site-header does NOT start with .scrolled — it toggles based on hero visibility.
    var headerObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        header.classList.toggle("scrolled", !e.isIntersecting);
      });
    }, { rootMargin: "-72px 0px 0px 0px", threshold: 0 });
    headerObs.observe(hero);
  }
  // On inner pages, .site-header already has .scrolled from the HTML, so nothing else to do.

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
    $$("a", nav).forEach(function (link) { link.addEventListener("click", closeNav); });
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

  /* ---- Gallery lightbox (only present on gallery.html) ---- */
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
