// ============================================================================
// Pages SEO « conteneurs » : gabarit
//   Contenu : build/seo-gammes-data.js — modèles : build/conteneurs-produits.json
//   Style : assets/css/gamme-page.css (+ seo-page.css, conteneurs-page.css)
//   Les cartes modèles renvoient vers les fiches produit de la boutique.
// ============================================================================
const DATA = require("./seo-gammes-data.js");
const PRODUCTS = require("./conteneurs-produits.json");
const { silhouette, parse, RANGES } = require("./conteneurs-maritimes.js");
const BASE_URL = "https://www.cubner.com/";
const CATALOGUE = "conteneurs-maritimes.html";
const PAGES = DATA.pages;
const byId = Object.fromEntries(PAGES.map(p => [p.id, p]));

// ---------------------------------------------------------------- utilitaires
const f1 = n => (Math.round(n * 10) / 10).toString();
const pts = a => a.map(p => p.map(f1).join(",")).join(" ");
const mm = s => s ? +s.replace(/\D/g, "") : null;                       // "6 058 mm" → 6058
const m2 = n => (n / 1000).toFixed(2).replace(".", ",");                 // 6058 → "6,06"
const dims = a => a && a.every(Boolean) ? `${m2(mm(a[0]))} × ${m2(mm(a[1]))} × ${m2(mm(a[2]))} m` : "—";
// Centre une silhouette du catalogue (dessinée à gauche dans un viewBox de 220) sans changer l'échelle
const centered = (svg, feet) => { const dw = (feet || 20) * .3048 * 196 / 13.716 + 13 + 8; return svg.replace('viewBox="0 0 220 72"', `viewBox="${f1(-(220 - dw) / 2 + 3)} 0 220 72"`); };
const sil = q => (color) => centered(silhouette(q, color), q.feet);
const rangeOf = title => RANGES.find(r => r.title === title) || RANGES[0];
const shopUrl = p => DATA.SHOP + p.url;

// Modèle → caractéristiques de silhouette (pieds déduits de la longueur si absents du nom)
function shapeOf(prod, rangeTitle) {
  const r = rangeOf(rangeTitle);
  const q = parse(prod.name, r);
  const L = prod.ext && mm(prod.ext[0]), H = prod.ext && mm(prod.ext[2]);
  if (!/\d+\s*pieds/i.test(prod.name) && L) q.feet = Math.round(L / 304.8);
  if (H) { q.hc = q.hc || H >= 2850; q.half = q.half || H < 1500; }
  if (/sans groupe/i.test(prod.name)) q.reefer = false;
  return q;
}
// Produit d'une page : identifiant du JSON, ou objet libre (occasion…)
function resolve(item, page) {
  if (typeof item === "string") {
    const p = PRODUCTS[item]; if (!p) throw new Error("Produit inconnu : " + item);
    return { ...p, id: item, href: shopUrl(p), rangeTitle: page.range, external: true };
  }
  const like = item.like && PRODUCTS[item.like];
  return { ...(like || {}), ...item, url: null, rangeTitle: item.range || page.range, href: item.href };
}
// Petite étiquette sous une silhouette : 20' HC, 40' OT…
const tag = (q, name) => `${q.feet}'` + (q.hc ? " HC" : q.half ? " HH" : "") + (/open top/i.test(name) ? " OT" : /open side/i.test(name) ? " OS" : /double door/i.test(name) ? " DD" : /flat rack/i.test(name) ? " FR" : /isotank/i.test(name) ? " ISO" : "");

// Rangée de silhouettes à l'échelle (visuel des pages sans photo)
function lineup(items) {
  const seen = new Set(), list = [];
  for (const it of items) { const q = shapeOf(it, it.rangeTitle); const k = tag(q, it.name) + q.type; if (!seen.has(k)) { seen.add(k); list.push({ q, it }); } }
  list.sort((a, b) => a.q.feet - b.q.feet);
  const unit = feet => (feet || 20) * .3048 * 196 / 13.716 + 13 + 14; // largeur occupée (même échelle que le catalogue)
  const MAX = 430, ROW = 96, rows = [[]]; let w = 0;
  for (const e of list) { const u = unit(e.q.feet); if (w + u > MAX && rows[rows.length - 1].length) { rows.push([]); w = 0; } rows[rows.length - 1].push(e); w += u; }
  const width = Math.max(...rows.map(r => r.reduce((s, e) => s + unit(e.q.feet), 0)));
  let out = "";
  rows.forEach((r, ri) => {
    let x = (width - r.reduce((s, e) => s + unit(e.q.feet), 0)) / 2;
    for (const e of r) {
      const color = rangeOf(e.it.rangeTitle).color;
      const svg = silhouette(e.q, color).replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
      out += `<svg x="${f1(x - 6)}" y="${ri * ROW}" width="220" height="72" viewBox="0 0 220 72" overflow="visible">${svg}</svg>`;
      out += `<text x="${f1(x + (unit(e.q.feet) - 14) / 2)}" y="${ri * ROW + 86}" text-anchor="middle" font-family="Switzer, Arial, sans-serif" font-size="11" font-weight="700" fill="#7d8b97">${tag(e.q, e.it.name)}</text>`;
      x += unit(e.q.feet);
    }
  });
  return `<svg class="gp-lineup" viewBox="-4 -14 ${f1(width + 8)} ${rows.length * ROW + 4}" role="img" aria-label="Formats de la gamme dessinés à l'échelle">${out}</svg>`;
}

// Schéma coté au trait (perspective cavalière)
function schema(ext) {
  const [L, W, H] = ext.map(v => mm(v) / 1000), S = 110;
  const Lw = L * S, Hh = H * S, dx = W * S * .5 * Math.cos(Math.PI / 6), dy = W * S * .5 * Math.sin(Math.PI / 6);
  const x0 = 88, y0 = 40 + dy, base = y0 + Hh, xr = x0 + Lw;
  const Wd = Math.ceil(xr + dx + 64), Ht = Math.ceil(base + 70), B = "#00518c", O = "#f49b27";
  const along = (t, y) => [xr + dx * t, y - dy * t];
  const line = (d, w = 1.6, extra = "") => `<path d="${d}" stroke="${B}" stroke-width="${w}" fill="none" stroke-linejoin="round"${extra}/>`;
  let o = `<defs><marker id="gp-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="${O}"/></marker></defs>`;
  o += `<polygon points="${pts([[x0, y0], [xr, y0], [xr + dx, y0 - dy], [x0 + dx, y0 - dy]])}" fill="#f4f8fb" stroke="${B}" stroke-width="1.6" stroke-linejoin="round"/>`;
  o += `<rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(Lw)}" height="${f1(Hh)}" fill="#fff" stroke="${B}" stroke-width="1.6"/>`;
  o += `<polygon points="${pts([[xr, y0], [xr + dx, y0 - dy], [xr + dx, base - dy], [xr, base]])}" fill="#eaf2f8" stroke="${B}" stroke-width="1.6" stroke-linejoin="round"/>`;
  const n = Math.round((Lw - 24) / 20), step = (Lw - 24) / n;
  o += line(Array.from({ length: n }, (_, i) => { const x = x0 + 12 + (i + .5) * step; return `M${f1(x)} ${f1(y0 + 12)}V${f1(base - 12)}`; }).join(""), 1, ' opacity=".45"');
  o += line(`M${f1(x0)} ${f1(y0 + 9)}H${f1(xr)}M${f1(x0)} ${f1(base - 9)}H${f1(xr)}M${f1(x0 + 9)} ${f1(y0)}V${f1(base)}M${f1(xr - 9)} ${f1(y0)}V${f1(base)}`, 1.2);
  const seg = (t, y1, y2, w, extra = "") => { const a = along(t, y1), b = along(t, y2); return line(`M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`, w, extra); };
  o += seg(.5, y0 + 9, base - 9, 1.4);
  for (const t of [.08, .92]) o += seg(t, y0 + 9, base - 9, 1.1);
  for (const t of [.2, .36, .64, .8]) o += seg(t, y0 + 14, base - 14, 1.1, ' opacity=".7"');
  for (const t of [.27, .43, .57, .73]) { const a = along(t, y0 + Hh * .56); o += `<rect x="${f1(a[0] - 2)}" y="${f1(a[1] - 8)}" width="4" height="16" rx="2" fill="${B}" opacity=".8"/>`; }
  for (const [cx, cy] of [[x0, y0], [xr - 10, y0], [x0, base - 10], [xr - 10, base - 10], [xr + dx - 10, y0 - dy], [xr + dx - 10, base - dy - 10]]) o += `<rect x="${f1(cx)}" y="${f1(cy)}" width="10" height="10" fill="#fff" stroke="${B}" stroke-width="1.4"/>`;
  const label = (x, y, txt, anchor = "middle") => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}" fill="#1c1c1b" font-family="Switzer, Arial, sans-serif" font-weight="600" font-size="15">${txt}</text>`;
  const arrow = (ax, ay, bx, by) => `<path d="M${f1(ax)} ${f1(ay)}L${f1(bx)} ${f1(by)}" stroke="${O}" stroke-width="2" marker-start="url(#gp-ar)" marker-end="url(#gp-ar)"/>`;
  const fmt = v => v.toFixed(2).replace(".", ",") + " m";
  const yl = y0 - dy - 18, xh = x0 - 22, ox = 14, oy = 24;
  o += arrow(x0 + dx, yl, xr + dx, yl) + label(x0 + dx + Lw / 2, yl - 10, fmt(L));
  o += arrow(xh, y0, xh, base) + label(xh - 10, y0 + Hh / 2 + 5, fmt(H), "end");
  o += arrow(xr + ox, base + oy, xr + dx + ox, base - dy + oy) + label(xr + dx / 2 + ox + 14, base - dy / 2 + oy + 22, fmt(W), "start");
  return `<svg class="gp-schema" viewBox="-10 0 ${Wd + 10} ${Ht}" role="img" aria-label="Dimensions extérieures : longueur ${fmt(L)}, largeur ${fmt(W)}, hauteur ${fmt(H)}">${o}</svg>`;
}

// Pictos au trait des chiffres clés
const FIG_ICONS = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none"><defs>
  <symbol id="gp-len" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 20h30M5 15v10M35 15v10M10 16.5 6 20l4 3.5M30 16.5l4 3.5-4 3.5"/></symbol>
  <symbol id="gp-vol" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M8 13 20 7l12 6v14l-12 6-12-6z"/><path d="m8 13 12 6 12-6M20 19v14"/></symbol>
  <symbol id="gp-pallet" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M5 17 20 10l15 7-15 7z"/><path d="M5 17v4l15 7 15-7v-4M20 24v4"/><path d="M5 25v3l15 7 15-7v-3"/></symbol>
</defs></svg>`;

module.exports = function seoGammes({ SPRITE, TOPBAR, headerFor, FOOTER, esc, escA }) {
  // Texte : **gras**, [texte](lien), [texte](@id) = autre page SEO
  const href = h => h.startsWith("@") ? byId[h.slice(1)].file : h;
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\[(.+?)\]\((.+?)\)/g, (m, t, h) => `<a href="${escA(href(h))}">${t}</a>`);
  const plain = s => s.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[(.+?)\]\((.+?)\)/g, "$1");
  const h2 = ([a, b], cls = "gp-title") => `<h2 class="${cls}">${esc(a)} <span class="accent">${esc(b)}</span></h2>`;
  const crumbsOf = p => [["Accueil", "/", BASE_URL], ["Conteneurs maritimes", CATALOGUE, BASE_URL + "conteneurs-maritimes/"],
    ...(p.parent ? [[byId[p.parent].h1.join(" "), byId[p.parent].file, BASE_URL + byId[p.parent].path]] : []), [p.h1.join(" "), null, BASE_URL + p.path]];
  const TOP = PAGES.filter(p => !p.parent);

  const card = (it) => {
    const q = shapeOf(it, it.rangeTitle), r = rangeOf(it.rangeTitle);
    const figs = [["len", it.len], ["vol", it.vol], ["pallet", it.pallets]].filter(f => f[1]);
    const short = it.name.replace(/^Conteneur\s+/, "");
    return `          <li class="gp-card" style="--range:${r.color}">
            <a href="${escA(href(it.href))}">
              <span class="gp-card__visual">${sil(q)(r.color)}${q.feet ? `<span class="cm-model__feet">${q.feet}'</span>` : ""}</span>
              <span class="gp-card__body">
                <span class="gp-card__range">${esc(it.rangeTitle)}</span>
                <span class="gp-card__name"><span class="sr-only">Conteneur </span>${esc(short.charAt(0).toUpperCase() + short.slice(1))}</span>
${figs.length ? `                <span class="gp-card__figs">${figs.map(([ic, v]) => `<span><svg aria-hidden="true"><use href="#gp-${ic}"/></svg>${esc(v)}</span>`).join("")}</span>\n` : ""}                <span class="gp-card__foot">${it.external ? "Voir la fiche produit" : "Découvrir"}<span class="gp-card__go" aria-hidden="true"><svg><use href="#i-arrow"/></svg></span></span>
              </span>
            </a>
          </li>`;
  };

  return PAGES.map(p => {
    const items = p.products.map(x => resolve(x, p));
    const range = rangeOf(p.range);
    const crumbs = crumbsOf(p);
    const withData = items.filter(i => i.ext);
    const sheet = p.sheet && PRODUCTS[p.sheet];
    const heroImg = p.hero.img ? `assets/img/${p.hero.img}` : null;
    const siblings = p.parent ? PAGES.filter(x => x.parent === p.parent) : [];
    const children = (p.children || []).map(([id, txt]) => ({ page: byId[id], txt }));

    const ld = [
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map(([n, , u], i) => ({ "@type": "ListItem", position: i + 1, name: n, ...(i < crumbs.length - 1 ? { item: u } : {}) })) },
      { "@context": "https://schema.org", "@type": "CollectionPage", name: p.h1.join(" "), description: p.meta, url: BASE_URL + p.path, inLanguage: "fr-FR",
        isPartOf: { "@type": "WebSite", name: "Cubner", url: BASE_URL },
        mainEntity: { "@type": "ItemList", numberOfItems: items.length, itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: it.external ? it.href : (it.href.startsWith("http") ? it.href : BASE_URL + byId.occasion.path) })) } },
      { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: p.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a.map(plain).join(" ") } })) },
    ];

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- ===== SEO ===== -->
  <title>${esc(p.seoTitle)}</title>
  <meta name="description" content="${escA(p.meta)}">
  <meta name="keywords" content="${escA(p.keywords)}">
  <link rel="canonical" href="${BASE_URL}${p.path}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Cubner">
  <meta property="og:title" content="${escA(p.seoTitle)}">
  <meta property="og:description" content="${escA(p.meta)}">
  <meta property="og:url" content="${BASE_URL}${p.path}">
  <meta property="og:locale" content="fr_FR">${heroImg ? `\n  <meta property="og:image" content="${BASE_URL}${heroImg}">` : ""}

  <link rel="preconnect" href="https://api.fontshare.com">
  <link href="https://api.fontshare.com/v2/css?f[]=switzer@300,400,500,600,700,800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/seo-page.css">
  <link rel="stylesheet" href="assets/css/conteneurs-page.css">
  <link rel="stylesheet" href="assets/css/gamme-page.css">
${ld.map(o => `  <script type="application/ld+json">\n  ${JSON.stringify(o)}\n  </script>`).join("\n")}
</head>
<body class="theme-cubner">

<!-- ===================== Icônes (sprite) ===================== -->
${SPRITE}
${FIG_ICONS}

${TOPBAR}${headerFor("conteneurs")}

<main>
  <!-- ===================== EN-TÊTE ===================== -->
  <section class="gp-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Fil d'Ariane">
        ${crumbs.map(([n, f], i) => i < crumbs.length - 1 ? `<a href="${f}">${esc(n)}</a>` : `<span aria-current="page">${esc(n)}</span>`).join(" / ")}
      </nav>
      <div class="gp-hero__grid">
        <div class="gp-hero__text">
          <h1>${esc(p.h1[0])} <span class="accent">${esc(p.h1[1])}</span></h1>
          <p class="gp-hero__lead">${esc(p.lead)}</p>
${p.intro.map(t => `          <p>${md(t)}</p>`).join("\n")}
          <div class="gp-hero__cta">
            <a class="btn btn--red" href="#modeles">Voir les ${items.length} modèles</a>
            <a class="gp-phone" href="tel:+33553072682"><svg aria-hidden="true"><use href="#i-phone"/></svg>+33 (0)5 53 07 26 82</a>
          </div>
        </div>
        <div class="gp-hero__visual${p.hero.lineup ? " gp-hero__visual--lineup" : ""}${p.hero.contain ? " gp-hero__visual--contain" : ""}">
          ${heroImg ? `<img src="${heroImg}" alt="${escA(p.hero.alt)}"${p.hero.w ? ` width="${p.hero.w}" height="${p.hero.h}"` : ""} fetchpriority="high">` : lineup(items)}
        </div>
      </div>
    </div>
  </section>

  <!-- ===================== NAVIGATION ENTRE GAMMES ===================== -->
  <nav class="gp-ranges" aria-label="Gammes de conteneurs">
    <div class="container">
      <ul>
${TOP.map(x => `        <li><a href="${x.file}"${x.id === p.id || x.id === p.parent ? ' aria-current="page"' : ""}>${esc(x.nav)}</a></li>`).join("\n")}
      </ul>${siblings.length || PAGES.some(x => x.parent === p.id) ? `
      <ul class="gp-ranges__sub">
${(p.parent ? [byId[p.parent], ...siblings] : [p, ...PAGES.filter(x => x.parent === p.id)]).map((x, i) => `        <li><a href="${x.file}"${x.id === p.id ? ' aria-current="page"' : ""}>${i === 0 ? "Tous" : esc(x.nav)}</a></li>`).join("\n")}
      </ul>` : ""}
    </div>
  </nav>
${children.length ? `
  <!-- ===================== SOUS-GAMMES ===================== -->
  <section class="gp-block gp-children">
    <div class="container">
      ${h2(p.childrenTitle)}
      <ul class="gp-subs">
${children.map(({ page: c, txt }) => {
  const sample = c.products.map(x => resolve(x, c)).filter(x => x.ext);
  const rep = sample[Math.min(1, sample.length - 1)];
  const q = shapeOf(rep, rep.rangeTitle);
  return `        <li class="gp-sub" style="--range:${rangeOf(c.range).color}">
          <a href="${c.file}">
            <span class="gp-sub__visual">${sil(q)(rangeOf(rep.rangeTitle).color)}</span>
            <span class="gp-sub__body">
              <span class="gp-sub__name">${esc(c.h1.join(" "))}</span>
              <span class="gp-sub__text">${md(txt).replace(/<\/?a[^>]*>/g, "")}</span>
              <span class="gp-sub__more">Voir les conteneurs<svg aria-hidden="true"><use href="#i-arrow"/></svg></span>
            </span>
          </a>
        </li>`;
}).join("\n")}
      </ul>
    </div>
  </section>` : ""}

  <!-- ===================== MODÈLES ===================== -->
  <section class="gp-block gp-models" id="modeles">
    <div class="container">
      ${h2(p.productsTitle)}${p.productsNote ? `\n      <p class="gp-note">${esc(p.productsNote)}</p>` : ""}
      <ul class="gp-cards" style="--cols:${[4, 3].reduce((best, c) => ((c - items.length % c) % c) < ((best - items.length % best) % best) ? c : best)}">
${items.map(card).join("\n")}
      </ul>
    </div>
  </section>
${p.compareTitle && withData.length ? `
  <!-- ===================== DIMENSIONS ===================== -->
  <section class="gp-block gp-dims" id="dimensions">
    <div class="container">
      ${h2(p.compareTitle)}${sheet ? `
      <div class="gp-sheet">
        <figure class="gp-sheet__drawing">${schema(sheet.ext)}<figcaption>${esc(sheet.name)} — dimensions extérieures</figcaption></figure>
        <div class="gp-sheet__specs">
${[["Dimensions intérieures", sheet.int], ["Dimensions extérieures", sheet.ext]].map(([g, a]) => `          <div class="gp-spec"><h3>${g}</h3><dl>${["Longueur", "Largeur", "Hauteur"].map((k, i) => `<div><dt>${k}</dt><dd>${esc(a[i])}</dd></div>`).join("")}</dl></div>`).join("\n")}
          <div class="gp-spec"><h3>Portes et charges</h3><dl>${[["Largeur des portes", sheet.doors && sheet.doors[1]], ["Hauteur des portes", sheet.doors && sheet.doors[2]], ["Charge max", sheet.payload], ["Poids à vide", sheet.tare]].filter(x => x[1]).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl></div>
          <div class="gp-spec"><h3>Construction</h3><dl>${[["Structure", sheet.structure], ["Plancher", sheet.floor]].filter(x => x[1]).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl></div>
        </div>
      </div>` : ""}
      <div class="gp-table" role="region" aria-label="Tableau comparatif des dimensions" tabindex="0">
        <table>
          <caption class="sr-only">Comparatif des dimensions : ${esc(p.h1.join(" "))}</caption>
          <thead><tr><th scope="col">Modèle</th><th scope="col">Extérieur (L × l × H)</th><th scope="col">Intérieur (L × l × H)</th><th scope="col">Volume</th><th scope="col">Surface</th><th scope="col">Palettes Europe</th><th scope="col">Poids à vide</th></tr></thead>
          <tbody>
${withData.map(i => `            <tr><th scope="row"><a href="${escA(i.href)}">${esc(i.name.replace(/^Conteneur\s+/, ""))}</a></th><td>${dims(i.ext)}</td><td>${dims(i.int)}</td><td>${esc(i.vol || "—")}</td><td>${esc(i.area || "—")}</td><td>${esc((i.pallets || "—").replace(/ palettes? Europe/, ""))}</td><td>${esc(i.tare || i.weight || "—")}</td></tr>`).join("\n")}
          </tbody>
        </table>
      </div>
    </div>
  </section>` : ""}
${p.guide ? `
  <!-- ===================== GUIDE DE CHOIX ===================== -->
  <section class="gp-block gp-guide">
    <div class="container">
      ${h2(p.guideTitle)}
      <ol class="gp-guide__list">
${p.guide.map(([t, x]) => `        <li><h3>${esc(t)}</h3><p>${md(x)}</p></li>`).join("\n")}
      </ol>
    </div>
  </section>` : ""}

  <!-- ===================== USAGES ===================== -->
  <section class="gp-block gp-usages">
    <div class="container">
      ${h2(p.usagesTitle)}
      <div class="gp-usages__grid${p.usages.length > 3 ? " is-many" : ""}">
${p.usages.map(u => `        <article class="gp-usage">
          ${u.img ? `<img class="gp-usage__img" src="assets/img/${u.img}" alt="" loading="lazy">` : `<span class="gp-usage__icon" aria-hidden="true"><svg><use href="#${u.icon}"/></svg></span>`}
          <div class="gp-usage__body">
            <h3>${esc(u.title)}</h3>
${u.paras.map(t => `            <p>${md(t)}</p>`).join("\n")}${u.link ? `\n            <a class="gp-usage__link" href="${escA(u.link[0])}">${esc(u.link[1])}<svg aria-hidden="true"><use href="#i-arrow"/></svg></a>` : ""}
          </div>
        </article>`).join("\n")}
      </div>
    </div>
  </section>

  <!-- ===================== RÉASSURANCE ===================== -->
  <section class="gp-trust" aria-label="Les engagements Cubner">
    <div class="container">
      <ul class="gp-trust__list">
${DATA.REASSURANCE.map(([ic, t, x]) => `        <li><span class="gp-trust__icon" aria-hidden="true"><svg><use href="#${ic}"/></svg></span><strong>${esc(t)}</strong><span>${esc(x)}</span></li>`).join("\n")}
      </ul>
      <p class="gp-trust__depots"><svg aria-hidden="true"><use href="#i-pin"/></svg>Nos dépôts : ${DATA.DEPOTS.map(esc).join(" · ")}</p>
    </div>
  </section>

  <!-- ===================== FAQ ===================== -->
  <section class="gp-block gp-faq" id="faq">
    <div class="container">
      ${h2(["Questions", "fréquentes"])}
      <div class="gp-faq__list">
${p.faq.map(([q, a], i) => `        <details class="gp-faq__item"${i === 0 ? " open" : ""}>
          <summary><h3>${esc(q)}</h3><span class="gp-faq__sign" aria-hidden="true"></span></summary>
          <div class="gp-faq__body">
${a.map(t => `            <p>${md(t)}</p>`).join("\n")}
          </div>
        </details>`).join("\n")}
      </div>
    </div>
  </section>

  <!-- ===================== AUTRES GAMMES ===================== -->
  <section class="gp-block gp-related">
    <div class="container">
      ${h2(["Découvrez aussi nos", "autres conteneurs"])}
      <ul class="gp-subs gp-subs--related">
${p.related.map(id => byId[id]).map(c => {
  const sample = c.products.map(x => resolve(x, c)).filter(x => x.ext);
  const rep = sample[Math.min(1, sample.length - 1)];
  return `        <li class="gp-sub" style="--range:${rangeOf(c.range).color}">
          <a href="${c.file}">
            <span class="gp-sub__visual">${sil(shapeOf(rep, rep.rangeTitle))(rangeOf(rep.rangeTitle).color)}</span>
            <span class="gp-sub__body">
              <span class="gp-sub__name">${esc(c.h1.join(" "))}</span>
              <span class="gp-sub__text">${esc(c.lead)}</span>
              <span class="gp-sub__more">Voir la gamme<svg aria-hidden="true"><use href="#i-arrow"/></svg></span>
            </span>
          </a>
        </li>`;
}).join("\n")}
      </ul>
      <p class="gp-related__all"><a href="${CATALOGUE}">Voir tous nos conteneurs maritimes<svg aria-hidden="true"><use href="#i-arrow"/></svg></a></p>
    </div>
  </section>
</main>

${FOOTER}<script src="assets/js/seo-page.js"></script>
</body>
</html>
`;
    return { file: p.file, html };
  });
};

// Correspondances utilisées par la page catalogue
module.exports.PAGES = PAGES;
module.exports.PRODUCTS = PRODUCTS;
module.exports.SHOP = DATA.SHOP;
