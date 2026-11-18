// ============================================================================
// Page « Nos conteneurs maritimes » (catalogue des gammes Cubner)
//   Le contenu (gammes + modèles) est défini ici, pas dans l'Excel.
//   Les fiches produit n'existent pas encore : les liens pointent vers « # ».
//   Présentation : sélecteur de gammes (onglets) + cartes modèles avec une
//   silhouette de conteneur dessinée à l'échelle (longueur, hauteur, type).
// ============================================================================
const FILE = "conteneurs-maritimes.html";
const SEO = require("./seo-gammes-data.js");
const SHOP_PRODUCTS = require("./conteneurs-produits.json");
// Liens : page SEO de chaque gamme (+ sous-pages), fiche boutique de chaque modèle
const seoPage = id => SEO.pages.find(p => p.id === id);
const RANGE_SEO = { "Standard": "standards", "Frigorifique": "frigorifiques", "Spécifique": "specifiques", "Stockage": "stockage", "Occasion": "occasion", "Off-Shore": "offshore" };
const RANGE_SUBS = { "Standard": ["petits", "20-pieds", "40-pieds", "location-maritime"], "Frigorifique": ["location-frigorifique"] };
const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/specifique /g, "").replace(/pallets/g, "pallet").replace(/\s+/g, " ").trim();
const ALIAS = { "conteneur 40 pieds pallet wide": "conteneur-40-pieds-hc-pallet-wide" };
const linkFor = (range, prefix, label) => {
  if (/occasion/i.test(prefix + " " + label)) return seoPage("occasion").file;
  if (/^location$/i.test(label)) return seoPage("location-frigorifique").file;
  const key = norm(prefix + " " + label);
  const id = ALIAS[key] || Object.keys(SHOP_PRODUCTS).find(k => norm(SHOP_PRODUCTS[k].name) === key);
  if (!id) { console.warn("  ⚠ Pas de fiche boutique pour : " + prefix + " " + label); return "#"; }
  return SEO.SHOP + SHOP_PRODUCTS[id].url;
};
const BASE_URL = "https://www.cubner.com/";

// Chaque gamme : titre, photo (provisoire si besoin), couleur des silhouettes, modèles.
// Modèle = [préfixe, libellé affiché]. Le préfixe reste dans le lien (SEO, lecteurs
// d'écran) mais n'est pas affiché : l'onglet indique déjà la gamme.
// { group } = ancien intertitre de la maquette (remplacé ici par les filtres de taille).
const RANGES = [
  { title: "Standard", img: "conteneur-maritime-levage.png", contain: true, color: "#00518c", items: [
    { group: "Petits conteneurs" },
    ["Conteneur", "10 pieds dry HC"], ["Conteneur", "10 pieds dry"], ["Conteneur", "8 pieds dry"],
    ["Conteneur", "6 pieds dry"], ["Conteneur", "10 pieds half height"],
    { group: "20 pieds" },
    ["Conteneur", "20 pieds occasion"], ["Conteneur", "20 pieds dry"], ["Conteneur", "20 pieds dry HC"],
    ["Conteneur", "20 pieds half height"],
    { group: "40 pieds" },
    ["Conteneur", "45 pieds pallets wide HC"], ["Conteneur", "40 pieds dry"], ["Conteneur", "40 pieds dry HC"],
    ["Conteneur", "40 pieds pallets wide"],
  ] },
  { title: "Frigorifique", img: "familles/frigorifiques.jpg", color: "#dfe6ec", reefer: true, items: [
    ["Conteneur frigorifique", "ICE MAX CAPACITE"], ["Conteneur frigorifique", "45 pieds pallet wide"],
    ["Conteneur frigorifique", "40 pieds blast HC"], ["Conteneur frigorifique", "40 pieds High cube"],
    ["Conteneur frigorifique", "20 pieds ATEX"], ["Conteneur frigorifique", "20 pieds"],
    ["Conteneur frigorifique", "20 pieds HC"], ["Conteneur frigorifique", "10 pieds"],
    ["Conteneur frigorifique", "10 pieds HC"], ["Conteneur frigorifique", "ISO sans groupe froid", { noUnit: true }],
    ["Conteneur frigorifique", "location"],
  ] },
  { title: "Spécifique", img: "galerie/container-stand-marche.jpg", color: "#f49b27", items: [
    ["Conteneur spécifique", "40 pieds OPEN SIDE HC"], ["Conteneur spécifique", "40 pieds OPEN TOP"],
    ["Conteneur spécifique", "40 pieds DOUBLE DOOR"], ["Conteneur spécifique", "20 pieds OPEN TOP"],
    ["Conteneur spécifique", "20 pieds DOUBLE DOOR"], ["Conteneur spécifique", "20 pieds OPEN SIDE"],
    ["Conteneur spécifique", "ISOTANK"], ["Conteneur spécifique", "FLAT RACK 20 pieds"],
    ["Conteneur spécifique", "FLAT RACK 40 pieds"],
  ] },
  { title: "Stockage", img: "galerie/containers-empiles-cafe.jpg", color: "#298e30", items: [
    ["Conteneur stockage", "5 pieds"], ["Conteneur stockage", "6 pieds"], ["Conteneur stockage", "7 pieds"],
    ["Conteneur stockage", "8 pieds"], ["Conteneur stockage", "10 pieds"], ["Conteneur stockage", "15 pieds"],
  ] },
  { title: "Occasion", img: "amenagement-containers.jpg", color: "#9a6b3f", items: [
    ["Conteneur occasion", "10 pieds"], ["Conteneur occasion", "20 pieds"], ["Conteneur occasion", "40 pieds"],
  ] },
  { title: "Off-Shore", color: "#e63d11", items: [
    ["Conteneur Off-shore", "10 pieds"], ["Conteneur Off-shore", "20 pieds"],
  ] },
];

const slug = s => "gamme-" + s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
const models = r => r.items.filter(it => !it.group);

// ---------------------------------------------------------------- modèles
// Caractéristiques déduites du libellé
const parse = (label, range, opts = {}) => {
  const m = label.match(/(\d+)\s*pieds?/i);
  const feet = m ? +m[1] : null;
  const type = /flat rack/i.test(label) ? "flatrack" : /isotank/i.test(label) ? "isotank"
    : /open top/i.test(label) ? "opentop" : /open side/i.test(label) ? "openside" : "box";
  return {
    feet, type,
    hc: /\bHC\b|high cube/i.test(label), half: /half height/i.test(label),
    reefer: !!range.reefer && !opts.noUnit,
  };
};
// Silhouette 3D (vue oblique : côté + dessus + face des portes), à l'échelle réelle :
// longueur en pieds (45 pieds = 13,72 m = 196 unités), hauteur 2,59 m (dry), 2,90 m (HC), 1,30 m (half height).
const U_PER_M = 196 / 13.716;
const DX = 13, DY = 8; // profondeur de la vue oblique
const shade = (hex, f) => "#" + hex.slice(1).match(/../g).map(h => Math.max(0, Math.min(255, Math.round(parseInt(h, 16) * f))).toString(16).padStart(2, "0")).join("");
const f1 = n => (Math.round(n * 10) / 10).toString();
const poly = (pts, fill, extra = "") => `<polygon points="${pts.map(p => p.map(f1).join(",")).join(" ")}" fill="${fill}"${extra}/>`;
function silhouette(p, color) {
  const feet = p.feet || 20;
  const w = feet * 0.3048 * U_PER_M;
  const h = (p.hc ? 2.896 : p.half ? 1.295 : 2.591) * U_PER_M;
  const x = 6, base = 66, y = base - h;
  const pale = color === "#dfe6ec";
  const side = color, top = shade(color, pale ? 1.04 : 1.22), end = shade(color, pale ? .86 : .8), line = shade(color, pale ? .7 : .62);
  // Faces de la boîte
  const topFace = [[x, y], [x + w, y], [x + w + DX, y - DY], [x + DX, y - DY]];
  const endFace = [[x + w, y], [x + w + DX, y - DY], [x + w + DX, base - DY], [x + w, base]];
  const along = (t, yy) => [x + w + DX * t, yy - DY * t]; // point sur la face des portes
  let out = "";
  // Ombre au sol
  out += `<ellipse cx="${f1(x + (w + DX) / 2)}" cy="${f1(base + 1)}" rx="${f1((w + DX) / 2 + 4)}" ry="2.6" fill="rgb(0 55 94 / 18%)"/>`;

  if (p.type === "flatrack") {
    const slab = 5;
    out += poly([[x, base - slab], [x + w, base - slab], [x + w + DX, base - slab - DY], [x + DX, base - slab - DY]], top);
    out += `<rect x="${f1(x)}" y="${f1(base - slab)}" width="${f1(w)}" height="${slab}" fill="${side}"/>`;
    out += poly([[x + w, base - slab], [x + w + DX, base - slab - DY], [x + w + DX, base - DY], [x + w, base]], end);
    for (const px of [x, x + w - 4]) { // montants d'extrémité
      out += `<rect x="${f1(px)}" y="${f1(y)}" width="4" height="${f1(h - slab)}" fill="${side}"/>`;
      out += poly([[px, y], [px + 4, y], [px + 4 + DX, y - DY], [px + DX, y - DY]], top);
    }
    out += poly([[x + w, y], [x + w + DX, y - DY], [x + w + DX, base - slab - DY], [x + w, base - slab]], end, ` opacity=".85"`);
  } else if (p.type === "isotank") {
    const rail = 3;
    out += `<rect x="${f1(x + 5)}" y="${f1(y + 5)}" width="${f1(w - 10 + DX * .4)}" height="${f1(h - 10)}" rx="${f1((h - 10) / 2)}" fill="#dfe6ec" stroke="#9fb0bf" stroke-width="1.2"/>`;
    out += `<path d="M${f1(x + 5 + (h - 10) / 2)} ${f1(y + 8)}H${f1(x + w - 5)}" stroke="#fff" stroke-width="2" opacity=".8"/>`;
    out += poly(topFace, top, ` opacity=".35"`);
    out += `<path d="M${f1(x)} ${f1(y)}H${f1(x + w)}L${f1(x + w + DX)} ${f1(y - DY)}M${f1(x)} ${f1(base)}H${f1(x + w)}L${f1(x + w + DX)} ${f1(base - DY)}" stroke="${side}" stroke-width="${rail}" fill="none"/>`;
    out += `<path d="M${f1(x + 1.5)} ${f1(y)}V${f1(base)}M${f1(x + w - 1.5)} ${f1(y)}V${f1(base)}M${f1(x + w + DX - 1)} ${f1(y - DY)}V${f1(base - DY)}" stroke="${side}" stroke-width="${rail}"/>`;
    out += `<path d="M${f1(x + 1.5)} ${f1(y)}L${f1(x + 12)} ${f1(base)}M${f1(x + w - 1.5)} ${f1(y)}L${f1(x + w - 12)} ${f1(base)}" stroke="${line}" stroke-width="1.2"/>`;
  } else {
    const open = p.type === "openside";
    // dessus (bâche pour l'open top)
    out += poly(topFace, p.type === "opentop" ? "#c9d3dd" : top);
    if (p.type === "opentop") out += `<path d="M${f1(x + DX / 2 + 2)} ${f1(y - DY / 2)}H${f1(x + w + DX / 2 - 2)}" stroke="#fff" stroke-width="1.4" stroke-dasharray="4 3"/>`;
    // côté
    out += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${open ? shade(color, 1.3) : side}"/>`;
    if (open) {
      out += `<path d="${[1, 2, 3].map(i => `M${f1(x + i * w / 4)} ${f1(y)}V${f1(base)}`).join("")}" stroke="${line}" stroke-width="1.2"/>`;
    } else {
      const n = Math.max(2, Math.round(w / 4.2));
      out += `<path d="${Array.from({ length: n }, (_, i) => `M${f1(x + 3 + (i + .5) * (w - 6) / n)} ${f1(y + 2.5)}V${f1(base - 2.5)}`).join("")}" stroke="${line}" stroke-width=".9" opacity=".5"/>`;
    }
    out += `<path d="M${f1(x)} ${f1(y + 1)}H${f1(x + w)}M${f1(x)} ${f1(base - 1)}H${f1(x + w)}" stroke="${line}" stroke-width="2"/>`;
    // face des portes (ou groupe froid)
    if (p.reefer) {
      out += poly(endFace, "#8796a3");
      out += `<path d="${[.25, .4, .55, .7].map(t => { const a = along(.15, y + h * t), b = along(.85, y + h * t); return `M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`; }).join("")}" stroke="#cfd8e0" stroke-width="1"/>`;
    } else {
      out += poly(endFace, end);
      out += `<path d="${[.33, .66].map(t => { const a = along(t, y + 2), b = along(t, base - 2); return `M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`; }).join("")}" stroke="${line}" stroke-width="1"/>`;
    }
    // arêtes et pièces de coin
    out += `<path d="M${f1(x + w)} ${f1(y)}V${f1(base)}" stroke="${line}" stroke-width="1.2"/>`;
    for (const [cx, cy] of [[x, y], [x + w - 3, y], [x, base - 3], [x + w - 3, base - 3]]) out += `<rect x="${f1(cx)}" y="${f1(cy)}" width="3" height="3" fill="${line}"/>`;
  }
  return `<svg class="cm-model__svg" viewBox="0 0 220 72" preserveAspectRatio="xMinYMax meet" aria-hidden="true">${out}</svg>`;
}

module.exports = function conteneursMaritimes({ SPRITE, TOPBAR, headerFor, FOOTER, esc, escA }) {
  const title = "Conteneurs maritimes neufs et d'occasion | Cubner";
  const meta = "Conteneurs maritimes Cubner : standard, frigorifiques, spécifiques, stockage, occasion et off-shore, du 5 au 45 pieds. Neufs ou d'occasion, disponibles immédiatement.";

  const thumb = (r, cls) => r.img
    ? `<span class="${cls}${r.contain ? ` ${cls}--contain` : ""}"><img src="assets/img/${r.img}" alt="" loading="lazy"></span>`
    : `<span class="${cls} ${cls}--icon"><svg><use href="#i-container"/></svg></span>`;

  const tab = (r, i) => `
          <button class="cm-tab" type="button" role="tab" id="tab-${slug(r.title)}" aria-controls="${slug(r.title)}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ""} style="--range:${r.color}">
            ${thumb(r, "cm-tab__img")}
            <span class="cm-tab__name">${esc(r.title)}</span>
            <span class="cm-tab__count">${models(r).length}</span>
          </button>`;

  const panel = r => {
    const list = models(r).map(it => ({ it, p: parse(it[1], r, it[2]) }));
    return `
        <section class="cm-panel" role="tabpanel" id="${slug(r.title)}" aria-labelledby="tab-${slug(r.title)}" style="--range:${r.color}">
          <header class="cm-panel__head">
            <span class="cm-panel__kicker">Conteneurs maritimes</span>
            <div class="cm-panel__line">
              <h3 class="cm-panel__title"><a href="${seoPage(RANGE_SEO[r.title]).file}">${esc(r.title)}</a></h3>
              <span class="cm-panel__count">${list.length} modèle${list.length > 1 ? "s" : ""}</span>
            </div>${RANGE_SUBS[r.title] ? `
            <ul class="cm-panel__subs">${RANGE_SUBS[r.title].map(id => `<li><a href="${seoPage(id).file}">${esc(seoPage(id).nav === "Location frigorifique" ? "Location" : seoPage(id).nav)}</a></li>`).join("")}</ul>` : ""}
          </header>
          <ul class="cm-models">
${list.map(({ it, p }) => `            <li class="cm-model">
              <a href="${linkFor(r.title, it[0], it[1])}">
                <span class="cm-model__visual">${silhouette(p, r.color)}${p.feet ? `<span class="cm-model__feet">${p.feet}'</span>` : ""}</span>
                <span class="cm-model__label"><span class="sr-only">${esc(it[0])} </span>${esc(it[1])}</span>
                <span class="cm-model__go" aria-hidden="true"><svg><use href="#i-arrow"/></svg></span>
              </a>
            </li>`).join("\n")}
          </ul>
        </section>`;
  };

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- ===== SEO ===== -->
  <title>${esc(title)}</title>
  <meta name="description" content="${escA(meta)}">
  <meta name="keywords" content="conteneur maritime, container maritime, conteneur 20 pieds, conteneur 40 pieds, conteneur frigorifique, conteneur occasion, conteneur stockage">
  <link rel="canonical" href="${BASE_URL}conteneurs-maritimes/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escA(title)}">
  <meta property="og:description" content="${escA(meta)}">
  <meta property="og:locale" content="fr_FR">

  <link rel="preconnect" href="https://api.fontshare.com">
  <link href="https://api.fontshare.com/v2/css?f[]=switzer@300,400,500,600,700,800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/seo-page.css">
  <link rel="stylesheet" href="assets/css/conteneurs-page.css">

  <script type="application/ld+json">
  ${JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Conteneurs maritimes" }] })}
  </script>
</head>
<body class="theme-cubner">

<!-- ===================== Icônes (sprite) ===================== -->
${SPRITE}

${TOPBAR}${headerFor("conteneurs")}

<main>
  <!-- ===================== HERO ===================== -->
  <section class="cm-hero">
    <div class="cm-hero__deco" aria-hidden="true"></div>
    <div class="container">
      <div class="cm-hero__text">
        <nav class="breadcrumb" aria-label="Fil d'Ariane">
          <a href="/">Accueil</a> / <span aria-current="page">Conteneurs maritimes</span>
        </nav>
        <h1>Nos <span class="accent">conteneurs maritimes</span></h1>
        <p class="cm-hero__lead">Découvrez la gamme complète de containers CUBNER.</p>
        <div class="cm-hero__body">
          <p>Spécialiste du stockage et du module en acier, nous proposons une <strong>gamme complète de conteneurs</strong> répondant à tous les besoins des professionnels et des particuliers.</p>
          <p>Du modèle compact au grand volume, nos conteneurs neufs ou d'occasion offrent une solution fiable, sécurisée et immédiatement disponible.</p>
        </div>
        <div class="cm-hero__cta">
          <span class="cm-hero__line" aria-hidden="true"></span>
          <span class="cm-hero__chevron" aria-hidden="true"></span>
          <a class="btn btn--red" href="#gammes">Découvrez tous nos conteneurs</a>
        </div>
      </div>
      <div class="cm-hero__media">
        <img src="assets/img/conteneur-maritime-levage.png" alt="Conteneur maritime 20 pieds bleu Cubner soulevé par un palonnier" width="999" height="987" fetchpriority="high">
        <span class="cm-hero__shadow" aria-hidden="true"></span>
      </div>
    </div>
  </section>

  <!-- ===================== GAMMES : sélecteur + modèles ===================== -->
  <section class="cm-ranges" id="gammes">
    <div class="container">
      <h2>Découvrez toutes nos gammes de <span class="accent">conteneurs maritimes</span></h2>
      <div class="cm-explorer">
        <div class="cm-tabs" role="tablist" aria-label="Gammes de conteneurs" aria-orientation="vertical">${RANGES.map(tab).join("")}
        </div>
        <div class="cm-panels">${RANGES.map(panel).join("")}
        </div>
      </div>
    </div>
  </section>
</main>

${FOOTER}<script src="assets/js/seo-page.js"></script>
<script>
  // Sélecteur de gammes (onglets accessibles).
  // Sans JavaScript, toutes les gammes restent affichées les unes sous les autres.
  (function () {
    var root = document.querySelector(".cm-explorer");
    if (!root) return;
    root.classList.add("is-js");
    var tabs = [].slice.call(root.querySelectorAll(".cm-tab"));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute("aria-controls")); });

    function select(i, focus, scroll) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      panels[i].classList.remove("is-in"); void panels[i].offsetWidth; panels[i].classList.add("is-in");
      if (focus) tabs[i].focus();
      if (scroll && window.matchMedia("(max-width: 1199px)").matches) tabs[i].scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
      if (history.replaceState) history.replaceState(null, "", "#" + panels[i].id);
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i, false, true); });
      t.addEventListener("keydown", function (e) {
        var k = e.key, n = tabs.length, j = null;
        if (k === "ArrowDown" || k === "ArrowRight") j = (i + 1) % n;
        if (k === "ArrowUp" || k === "ArrowLeft") j = (i - 1 + n) % n;
        if (k === "Home") j = 0; if (k === "End") j = n - 1;
        if (j !== null) { e.preventDefault(); select(j, true, true); }
      });
    });
    var start = Math.max(0, panels.findIndex(function (p) { return "#" + p.id === location.hash; }));
    select(start, false, false);
    if (start > 0) document.getElementById("gammes").scrollIntoView();
  })();
</script>
</body>
</html>
`;
  return { file: FILE, html };
};
module.exports.silhouette = silhouette;
module.exports.parse = parse;
module.exports.RANGES = RANGES;
