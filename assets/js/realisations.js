/* ==========================================================================
   CALCUB — Page Réalisations
   - Filtres par secteur ([data-rz-filters] + .rz-card[data-secteur])
   - Clic sur une carte : photo agrandie avec légende (titre, secteur, résumé),
     navigation entre les réalisations affichées par le filtre en cours.
     Styles .lightbox de seo-page.css (+ légende dans calcub-page.css)
   ========================================================================== */
(function () {
  "use strict";

  var cards = [].slice.call(document.querySelectorAll(".rz-grid .rz-card"));
  if (!cards.length) return;

  /* ---------- Filtres ---------- */
  var filters = document.querySelector("[data-rz-filters]");
  if (filters) {
    var buttons = [].slice.call(filters.querySelectorAll(".rz-filter"));
    var empty = document.querySelector("[data-rz-empty]");
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        var f = b.getAttribute("data-filter"), shown = 0;
        buttons.forEach(function (o) { o.classList.toggle("is-active", o === b); o.setAttribute("aria-pressed", o === b); });
        cards.forEach(function (c) {
          var ok = f === "tous" || c.getAttribute("data-secteur") === f;
          c.hidden = !ok; if (ok) shown++;
        });
        if (empty) empty.hidden = shown > 0;
      });
    });
  }

  /* ---------- Photo agrandie ---------- */
  var list = [], idx = 0, last = null;
  var lb = document.createElement("div");
  lb.className = "lightbox rz-lightbox";
  lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Photo de la réalisation");
  lb.innerHTML = '<figure class="rz-lightbox__figure"><img class="lightbox__img" alt="">' +
    '<figcaption class="rz-lightbox__caption"><span class="rz-lightbox__tag"></span><strong></strong><span class="rz-lightbox__text"></span></figcaption></figure>' +
    '<button class="lightbox__btn lightbox__close" type="button" aria-label="Fermer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
    '<button class="lightbox__btn lightbox__prev" type="button" aria-label="Réalisation précédente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg></button>' +
    '<button class="lightbox__btn lightbox__next" type="button" aria-label="Réalisation suivante"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg></button>' +
    '<p class="lightbox__count"></p>';
  document.body.appendChild(lb);
  var big = lb.querySelector(".lightbox__img");
  var cap = {
    tag: lb.querySelector(".rz-lightbox__tag"),
    title: lb.querySelector(".rz-lightbox__caption strong"),
    text: lb.querySelector(".rz-lightbox__text")
  };
  var prev = lb.querySelector(".lightbox__prev"), next = lb.querySelector(".lightbox__next");

  function show(i) {
    idx = (i + list.length) % list.length;
    var c = list[idx], img = c.querySelector(".rz-card__media img");
    big.src = img.currentSrc || img.src; big.alt = img.alt;
    cap.tag.textContent = c.querySelector(".rz-card__tag").textContent;
    cap.title.textContent = c.querySelector(".rz-card__title").textContent;
    cap.text.textContent = c.querySelector(".rz-card__body p").textContent;
    lb.querySelector(".lightbox__count").innerHTML = list.length > 1 ? "<b>" + (idx + 1) + "</b> / " + list.length : "";
  }
  function open(card, trigger) {
    list = cards.filter(function (c) { return !c.hidden; });
    var multi = list.length > 1;
    prev.hidden = !multi; next.hidden = !multi;
    last = trigger; show(list.indexOf(card));
    lb.classList.add("is-open"); document.body.classList.add("no-scroll");
    lb.querySelector(".lightbox__close").focus();
  }
  function close() {
    lb.classList.remove("is-open"); document.body.classList.remove("no-scroll");
    if (last) last.focus();
  }
  cards.forEach(function (c) {
    var btn = c.querySelector("[data-rz-zoom]");
    btn.addEventListener("click", function () { open(c, btn); });
  });
  lb.querySelector(".lightbox__close").addEventListener("click", close);
  prev.addEventListener("click", function () { show(idx - 1); });
  next.addEventListener("click", function () { show(idx + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (list.length > 1 && e.key === "ArrowLeft") show(idx - 1);
    if (list.length > 1 && e.key === "ArrowRight") show(idx + 1);
  });
  var x0 = null;
  lb.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (x0 === null || list.length < 2) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();
