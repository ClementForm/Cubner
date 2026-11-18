/* ==========================================================================
   CALCUB — Gabarit page SEO
   Tout est automatique : il suffit que chaque section de l'article
   soit une <section class="section" id="..."> contenant un <h2>.
   ========================================================================== */
(function () {
  "use strict";

  var article = document.querySelector("[data-article]");
  if (!article) return;
  document.documentElement.classList.add("js");

  var sections = Array.prototype.slice.call(article.querySelectorAll(".section[id]"));
  var tocList = document.querySelector("[data-toc-list]");
  var toc = document.querySelector("[data-toc]");
  var tocCurrent = document.querySelector("[data-toc-current]");
  var progressBars = document.querySelectorAll("[data-progress]");

  /* ---------- 1. Numérotation des sections + sommaire généré ---------- */
  sections.forEach(function (section, i) {
    var num = String(i + 1).padStart(2, "0");
    var badge = section.querySelector(".section__num");
    if (badge) badge.textContent = num;

    if (tocList) {
      var h2 = section.querySelector("h2");
      var label = section.getAttribute("data-toc-label") || (h2 ? h2.textContent.trim() : "");
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + section.id;
      a.textContent = label;
      li.appendChild(a);
      tocList.appendChild(li);
    }
  });

  var tocLinks = tocList ? Array.prototype.slice.call(tocList.querySelectorAll("a")) : [];

  /* ---------- 2. Temps de lecture ---------- */
  var words = (article.innerText || "").trim().split(/\s+/).length;
  var minutes = Math.max(1, Math.round(words / 220));
  document.querySelectorAll("[data-reading-time]").forEach(function (el) {
    el.textContent = minutes + " min de lecture";
  });

  /* ---------- 3. Progression de lecture + section active ---------- */
  function onScroll() {
    var rect = article.getBoundingClientRect();
    var total = article.offsetHeight - window.innerHeight * 0.6;
    var done = Math.min(1, Math.max(0, -rect.top / total));
    progressBars.forEach(function (bar) { bar.style.width = (done * 100).toFixed(1) + "%"; });

    var offset = window.innerHeight * 0.3;
    var activeIndex = -1;
    sections.forEach(function (s, i) {
      if (s.getBoundingClientRect().top - offset <= 0) activeIndex = i;
    });

    tocLinks.forEach(function (a, i) {
      a.classList.toggle("is-active", i === activeIndex);
      a.classList.toggle("is-read", i < activeIndex);
    });
    if (tocCurrent) {
      tocCurrent.textContent = activeIndex >= 0 ? tocLinks[activeIndex].textContent : "";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- 4. Sommaire repliable (mobile) ---------- */
  if (toc) {
    var head = toc.querySelector(".toc__head");
    head.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 960px)").matches) toc.classList.toggle("is-open");
    });
    tocLinks.forEach(function (a) {
      a.addEventListener("click", function () { toc.classList.remove("is-open"); });
    });
  }

  /* ---------- 5. Formats à l'échelle (barres proportionnelles) ---------- */
  var formats = document.querySelectorAll("[data-format]");
  var maxL = 0, maxH = 0;
  formats.forEach(function (f) {
    maxL = Math.max(maxL, parseFloat(f.dataset.length));
    maxH = Math.max(maxH, parseFloat(f.dataset.height));
  });
  function drawFormats() {
    formats.forEach(function (f) {
      var box = f.querySelector(".format__box");
      var scale = f.querySelector(".format__scale");
      if (!box || !scale) return;
      box.style.width = (parseFloat(f.dataset.length) / maxL * 100) + "%";
      box.style.height = (parseFloat(f.dataset.height) / maxH * scale.offsetHeight) + "px";
    });
  }

  /* ---------- 6. Apparition au scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-visible");
        if (e.target.querySelector("[data-format]")) drawFormats();
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
    drawFormats();
  }
  window.addEventListener("resize", drawFormats);

  /* ---------- 7. Galerie : vignettes, compteur, swipe, plein écran ---------- */
  var ICONS = {
    full: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>'
  };
  function countHTML(i, n) { return "<b>" + (i + 1) + "</b> / " + n; }

  // Une seule lightbox partagée par toutes les galeries de la page
  var lb = null, lbImgs = [], lbIndex = 0;
  function buildLightbox() {
    lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Photo en plein écran");
    lb.innerHTML =
      '<img class="lightbox__img" alt="">' +
      '<button class="lightbox__btn lightbox__close" type="button" aria-label="Fermer">' + ICONS.close + "</button>" +
      '<button class="lightbox__btn lightbox__prev" type="button" aria-label="Photo précédente">' + ICONS.prev + "</button>" +
      '<button class="lightbox__btn lightbox__next" type="button" aria-label="Photo suivante">' + ICONS.next + "</button>" +
      '<p class="lightbox__count"></p>';
    document.body.appendChild(lb);
    lb.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
    lb.querySelector(".lightbox__prev").addEventListener("click", function () { showLightbox(lbIndex - 1); });
    lb.querySelector(".lightbox__next").addEventListener("click", function () { showLightbox(lbIndex + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showLightbox(lbIndex - 1);
      if (e.key === "ArrowRight") showLightbox(lbIndex + 1);
    });
    addSwipe(lb, function (dir) { showLightbox(lbIndex + dir); });
  }
  function showLightbox(i) {
    var n = lbImgs.length;
    lbIndex = (i + n) % n;
    var img = lb.querySelector(".lightbox__img");
    img.src = lbImgs[lbIndex].currentSrc || lbImgs[lbIndex].src;
    img.alt = lbImgs[lbIndex].alt;
    lb.querySelector(".lightbox__count").innerHTML = n > 1 ? countHTML(lbIndex, n) : "";
  }
  function openLightbox(imgs, i) {
    if (!lb) buildLightbox();
    lbImgs = imgs;
    var multi = imgs.length > 1;
    lb.querySelector(".lightbox__prev").hidden = !multi;
    lb.querySelector(".lightbox__next").hidden = !multi;
    showLightbox(i);
    lb.classList.add("is-open");
    document.body.classList.add("no-scroll");
    lb.querySelector(".lightbox__close").focus();
  }
  function closeLightbox() {
    lb.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  }
  function addSwipe(el, cb) {
    var x0 = null;
    el.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    el.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) cb(dx < 0 ? 1 : -1);
      x0 = null;
    });
  }

  document.querySelectorAll("[data-gallery]").forEach(function (gallery) {
    var stage = gallery.querySelector(".gallery__stage");
    var items = Array.prototype.slice.call(gallery.querySelectorAll(".gallery__item"));
    var imgs = items.map(function (it) { return it.querySelector("img"); });
    var n = items.length;
    if (!stage || !n) return;
    var current = 0, thumbs = [], count = null;

    // Barre flottante
    var bar = document.createElement("div");
    bar.className = "gallery__bar";
    if (n > 1) {
      var list = document.createElement("div");
      list.className = "gallery__thumbs";
      imgs.forEach(function (img, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "gallery__thumb";
        b.setAttribute("aria-label", "Voir la photo " + (i + 1));
        b.innerHTML = '<img src="' + img.getAttribute("src") + '" alt="" loading="lazy">';
        b.addEventListener("click", function () { go(i); });
        list.appendChild(b);
        thumbs.push(b);
      });
      bar.appendChild(list);
      count = document.createElement("span");
      count.className = "gallery__count";
      bar.appendChild(count);
    }
    var full = document.createElement("button");
    full.type = "button";
    full.className = "gallery__full";
    full.setAttribute("aria-label", "Afficher en plein écran");
    full.innerHTML = ICONS.full;
    full.addEventListener("click", function () { openLightbox(imgs, current); });
    bar.appendChild(full);
    gallery.appendChild(bar);
    gallery.classList.add("gallery--has-bar");

    function go(i) {
      current = (i + n) % n;
      items.forEach(function (it, k) { it.classList.toggle("is-active", k === current); });
      thumbs.forEach(function (t, k) { t.classList.toggle("is-active", k === current); });
      if (count) count.innerHTML = countHTML(current, n);
      if (thumbs[current]) {
        var t = thumbs[current], l = t.parentNode;
        l.scrollTo({ left: t.offsetLeft - (l.clientWidth - t.offsetWidth) / 2, behavior: "smooth" });
      }
    }
    stage.addEventListener("click", function () { openLightbox(imgs, current); });
    if (n > 1) addSwipe(stage, function (dir) { go(current + dir); });
    go(0);
  });

  /* ---------- 8. Familles d'usage : mosaïque (une tuile ouverte à la fois) ---------- */
  document.querySelectorAll("[data-families]").forEach(function (root) {
    var fams = Array.prototype.slice.call(root.querySelectorAll(".family"));

    function toggle(f, on) {
      f.classList.toggle("is-active", on);
      f.querySelector(".family__tab").setAttribute("aria-expanded", on ? "true" : "false");
    }
    fams.forEach(function (f) {
      var count = f.querySelector(".family__count");
      if (count) {
        var n = f.querySelectorAll(".family__links li:not(.family__extra)").length;
        count.textContent = n + (n > 1 ? " solutions" : " solution");
      }
      f.querySelector(".family__tab").addEventListener("click", function () {
        var open = !f.classList.contains("is-active");
        fams.forEach(function (x) { toggle(x, false); });
        toggle(f, open);
      });
    });
  });
})();
