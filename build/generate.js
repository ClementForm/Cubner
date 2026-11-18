// ============================================================================
// Générateur du site CALCUB
//   Source du contenu : contenus/*.xlsx (CALCUB_Modules_Contenus_Pages.xlsx)
//   Pages sur mesure  : src/pages/*.html (copiées telles quelles)
//   Résultat          : site/ (pages HTML + assets) — ne pas modifier à la main
// Lancement : node build/generate.js   (ou double-clic sur construire-le-site.bat)
// ============================================================================
const fs = require("fs");
const { SYMBOLS: ICONS, pickIcons, pickIconsByName } = require("./icons.js");
const path = require("path");
const { readXlsx } = require("./xlsx.js");
const PROJECT = path.resolve(__dirname, "..");
const SRC = path.join(PROJECT, "src", "pages");
const OUT = path.join(PROJECT, "site");
const xlsxFile = fs.readdirSync(path.join(PROJECT, "contenus")).find(f => /.xlsx$/i.test(f) && !f.startsWith("~$"));
if (!xlsxFile) { console.error("Aucun fichier .xlsx dans le dossier contenus/"); process.exit(1); }
const data = readXlsx(path.join(PROJECT, "contenus", xlsxFile));
const rd = f => fs.readFileSync(path.join(SRC, f), "utf8");
// Dossier de sortie : on repart de zéro à chaque construction
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.cpSync(path.join(PROJECT, "assets"), path.join(OUT, "assets"), { recursive: true, filter: f => !/.xlsx$/i.test(f) });
for (const f of fs.readdirSync(SRC).filter(f => f.endsWith(".html"))) fs.copyFileSync(path.join(SRC, f), path.join(OUT, f));

/* ------------------------------------------------------------------ données */
const rows = data[0].rows.slice(1).filter(r => r && r[2]).map(r => ({
  n: parseInt(r[0], 10), branch: r[1].trim(), name: r[2].trim(), type: r[3].trim(),
  title: (r[4] || "").trim(), meta: (r[5] || "").trim(), kw: (r[6] || "").trim(), content: (r[7] || "").trim(),
}));
const HANDMADE = { 1: "amenagement-containers.html", 3: "restauration-commerce.html", 4: "container-snack-food-truck.html" };

const slug = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  .replace(/\(.*?\)/g, "").replace(/&/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escA = s => esc(s).replace(/"/g, "&quot;");
const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const displayName = s => s.replace(/\s*\((Modules|page pilier[^)]*)\)\s*$/i, "").trim();

// Familles (branches)
const FAM = {}; // branch -> {cat, products[], key, file, img, root:'calcub'|'modules', label}
const famImg = {
  "Restauration & Commerce": "familles/restauration.jpg", "Chantier & BTP": "familles/chantier.jpg",
  "Frigorifiques & Reefers": "familles/frigorifiques.jpg", "Agroalimentaire": "familles/agroalimentaire.jpg",
  "Énergie & Environnement": "familles/energie.jpg", "Industrie & Spécifique": "familles/industrie.jpg",
  "Défense et Sécurité": "familles/defense.jpg", "Santé & Humanitaire": "familles/sante.jpg",
  "Événementiel": "familles/evenementiel.jpg", "Mairie & Collectivités": "familles/mairie.jpg",
  "Pompier & SDIS": "familles/pompier.jpg", "Habitations, Logements & Jardin": "familles/habitations.jpg",
  "Sport & Loisirs": "familles/sport.jpg", "Fabrication & Savoir-faire": "amenagement-containers.jpg",
};
const famIcon = {
  "Restauration & Commerce": "i-counter", "Chantier & BTP": "i-helmet", "Frigorifiques & Reefers": "i-snow",
  "Agroalimentaire": "i-wheat", "Énergie & Environnement": "i-sun", "Industrie & Spécifique": "i-gear",
  "Défense et Sécurité": "i-shield", "Santé & Humanitaire": "i-cross", "Événementiel": "i-tent",
  "Mairie & Collectivités": "i-townhall", "Pompier & SDIS": "i-flame", "Habitations, Logements & Jardin": "i-house",
  "Sport & Loisirs": "i-ball", "Fabrication & Savoir-faire": "i-factory",
};
for (const r of rows) {
  if (r.branch === "Pages pilier") continue;
  const [root, key] = r.branch.split(" / ").map(s => s.trim());
  FAM[r.branch] = FAM[r.branch] || { key, root: root === "CALCUB" ? "calcub" : "modules", products: [] };
  if (r.type === "categorie") FAM[r.branch].cat = r; else FAM[r.branch].products.push(r);
}
// Fichiers
const used = new Set(Object.values(HANDMADE).concat(["modules-bungalows.html"]));
const fileFor = (base) => { let f = base + ".html", i = 2; while (used.has(f)) f = `${base}-${i++}.html`; used.add(f); return f; };
for (const b in FAM) {
  const F = FAM[b];
  F.label = displayName(F.cat.name);
  F.file = F.cat.n === 3 ? HANDMADE[3] : fileFor((F.root === "modules" ? "modules-" : "") + slug(F.label));
  F.img = F.root === "modules" ? "familles/chantier.jpg" : famImg[F.key];
  F.icon = F.root === "modules" ? "i-container" : famIcon[F.key] || "i-container";
}
// Produits : slug simple, suffixé de la famille en cas de doublon
const count = {};
for (const b in FAM) for (const p of FAM[b].products) { const s = slug(p.name); count[s] = (count[s] || 0) + 1; }
for (const b in FAM) {
  const F = FAM[b];
  for (const p of F.products) {
    if (HANDMADE[p.n]) { p.file = HANDMADE[p.n]; used.add(p.file); continue; }
    let base = slug(p.name);
    if (F.key === "Fabrication & Savoir-faire") base = "savoir-faire-" + base;
    else if (F.root === "modules") base = "module-" + base;
    else if (count[slug(p.name)] > 1) base += "-" + slug(F.key);
    p.file = fileFor(base);
  }
}
const PILIER_CALCUB = rows.find(r => r.n === 1), PILIER_MODULES = rows.find(r => r.n === 2);
PILIER_CALCUB.file = HANDMADE[1]; PILIER_MODULES.file = "modules-bungalows.html";
const famByFile = {}; for (const b in FAM) famByFile[FAM[b].file] = FAM[b];

/* ------------------------------------------------------------------ gabarit commun */
const hub = rd(HANDMADE[1]), snack = rd(HANDMADE[4]), rc = rd(HANDMADE[3]);
// Sprite : toutes les icônes des pages existantes, sans doublon
const symbols = {};
for (const src of [snack, hub, rc]) for (const m of src.matchAll(/<symbol id="([^"]+)"[\s\S]*?<\/symbol>/g)) if (!symbols[m[1]]) symbols[m[1]] = m[0];
symbols["i-check"] = '<symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></symbol>';
symbols["i-lock"] = '<symbol id="i-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></symbol>';
symbols["i-wind"] = '<symbol id="i-wind" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8"/></symbol>';
symbols["i-shower"] = '<symbol id="i-shower" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V8a4 4 0 0 1 8 0"/><path d="M9 11h6l-3-3z"/><path d="M10 15v1M13 15v1M16 15v1M11 19v1M14 19v1"/></symbol>';
symbols["i-wifi"] = '<symbol id="i-wifi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r=".8" fill="currentColor"/></symbol>';
Object.assign(symbols, ICONS);
const SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n  <defs>\n    ${Object.values(symbols).join("\n    ")}\n  </defs>\n</svg>`;

const TOPBAR = hub.slice(hub.indexOf("<!-- ===================== TOP BAR"), hub.indexOf("<!-- ===================== HEADER"));
const headerFor = active => `<!-- ===================== HEADER ===================== -->
<header class="header">
  <div class="container">
    <a class="logo" href="/" aria-label="Cubner Groupe — accueil">
      <img class="logo__img" src="assets/img/logo/cubner-groupe.png" alt="Cubner Groupe" width="201" height="69">
    </a>
    <nav class="nav" aria-label="Navigation principale">
      <a href="conteneurs-maritimes.html"${active === "conteneurs" ? ' class="is-active"' : ""}>Conteneurs maritimes</a>
      <a href="amenagement-containers.html"${active === "calcub" ? ' class="is-active"' : ""}>Aménagements</a>
      <a href="modules-bungalows.html"${active === "modules" ? ' class="is-active"' : ""}>Modules / Bungalows</a>
      <a href="#">Services</a>
      <a href="#">Boutique</a>
    </nav>
    <div class="header__icons">
      <a href="#" aria-label="Mon compte"><svg><use href="#i-user"/></svg></a>
      <a href="#" aria-label="Panier"><svg><use href="#i-cart"/></svg></a>
      <button class="burger" aria-label="Menu"><svg><use href="#i-menu"/></svg></button>
    </div>
  </div>
</header>`;

// Pied de page : liens réels vers les familles
const footerLinks = {
  "Restauration &amp; commerce": "Restauration & Commerce", "Chantier / BTP": "Chantier & BTP",
  "Énergie &amp; environnement": "Énergie & Environnement", "Industrie &amp; spécifique": "Industrie & Spécifique",
  "Frigorifique": "Frigorifiques & Reefers", "Agroalimentaire": "Agroalimentaire", "Défense et sécurité": "Défense et Sécurité",
  "Santé &amp; humanitaire": "Santé & Humanitaire", "Événementiel": "Événementiel", "Mairie &amp; collectivité": "Mairie & Collectivités",
  "Pompier SDISS": "Pompier & SDIS", "Habitation, logement &amp; jardin": "Habitations, Logements & Jardin", "Sport &amp; loisir": "Sport & Loisirs",
};
let FOOTER = hub.slice(hub.indexOf("<!-- ===================== FOOTER"), hub.indexOf("<script src=\"assets/js/seo-page.js\">"));
FOOTER = FOOTER.replace(/<li><a href="[^"]*">([^<]+)<\/a><\/li>/g, (m, label) => {
  const key = footerLinks[label]; if (!key) return m;
  const F = FAM["CALCUB / " + key]; return F ? `<li><a href="${F.file}">${label}</a></li>` : m;
}).replace('<li><a href="#">Maritime</a></li>', '<li><a href="conteneurs-maritimes.html">Maritime</a></li>')
  .replace('<li><a href="#">Standard</a></li>', '<li><a href="conteneurs-maritimes-standards.html">Standard</a></li>')
  .replace('<li><a href="#">Spécifique</a></li>', '<li><a href="conteneurs-specifiques.html">Spécifique</a></li>')
  .replace('<li><a href="#">Occasion</a></li>', '<li><a href="conteneurs-occasion.html">Occasion</a></li>')
  .replace('<li><a href="#">Stockage</a></li>', '<li><a href="conteneurs-stockage.html">Stockage</a></li>')
  .replace('<li><a href="#">Off-shore</a></li>', '<li><a href="conteneurs-offshore.html">Off-shore</a></li>')
  .replace('<a class="footer__strong" href="#">Modules / Bungalows</a>', '<a class="footer__strong" href="modules-bungalows.html">Modules / Bungalows</a>')
  .replace('<li><a href="#">Fabrication</a></li>', `<li><a href="${FAM["CALCUB / Fabrication & Savoir-faire"].file}">Fabrication</a></li>`);

const BASE_URL = "https://www.cubner.com/";
const faqLd = faq => !faq || !faq.length ? "" : `
  <script type="application/ld+json">
  ${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) })}
  </script>`;
// Sépare le texte principal et la FAQ éventuelle (« FAQ » seul sur une ligne, puis blocs « Question ?\nRéponse »)
const splitFaq = content => {
  const m = content.match(/\n\s*FAQ\s*\n/);
  if (!m) return { main: content, faq: [] };
  const main = content.slice(0, m.index).trim();
  const faq = content.slice(m.index + m[0].length).split(/\n\s*\n/).map(b => b.trim()).filter(Boolean).map(b => {
    const lines = b.split("\n"); return { q: lines[0].trim(), a: lines.slice(1).join(" ").trim() };
  }).filter(f => f.q && f.a);
  return { main, faq };
};
const faqSection = (faq, num) => !faq.length ? "" : `
        <!-- ${num ? String(num).padStart(2, "0") : "FAQ"} -->
        <section class="section reveal" id="faq" data-toc-label="Questions fréquentes">
          <div class="section__head">${num ? `\n            <span class="section__num">${String(num).padStart(2, "0")}</span>` : ""}
            <div>
              <h2>Questions fréquentes</h2>
            </div>
          </div>
          <div class="faq">
${faq.map((f, i) => `            <details class="faq__item"${i === 0 ? " open" : ""}>
              <summary>${inline(f.q)}<svg><use href="#i-chevron"/></svg></summary>
              <p>${inline(f.a)}</p>
            </details>`).join("\n")}
          </div>
        </section>`;
const head = (p, canonicalPath, crumbs, extraCss, faq) => `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- ===== SEO (repris du fichier CALCUB_Modules_Contenus_Pages.xlsx, page N°${p.n}) ===== -->
  <title>${esc(p.title)}</title>
  <meta name="description" content="${escA(p.meta)}">
  <meta name="keywords" content="${escA(p.kw)}">
  <link rel="canonical" href="${BASE_URL}${canonicalPath}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escA(p.title)}">
  <meta property="og:description" content="${escA(p.meta)}">
  <meta property="og:locale" content="fr_FR">

  <link rel="preconnect" href="https://api.fontshare.com">
  <link href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700,800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/seo-page.css">${extraCss ? '\n  <link rel="stylesheet" href="assets/css/hub-page.css">' : ""}

  <script type="application/ld+json">
  ${JSON.stringify({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => Object.assign({ "@type": "ListItem", position: i + 1, name: c.name }, c.url ? { item: BASE_URL + c.url } : {})),
  })}
  </script>${faqLd(faq)}
</head>
<body>

<!-- ===================== Icônes (sprite) ===================== -->
${SPRITE}

<div class="read-progress" data-progress aria-hidden="true"></div>

${TOPBAR}${headerFor(p.root)}
`;
const breadcrumbHtml = crumbs => `<nav class="breadcrumb" aria-label="Fil d'Ariane">
      ${crumbs.map((c, i) => i === crumbs.length - 1 ? `<span aria-current="page">${esc(c.name)}</span>` : `<a href="${c.href}">${esc(c.name)}</a>`).join(" / ")}
    </nav>`;
const foot = () => `${FOOTER}<script src="assets/js/seo-page.js"></script>
</body>
</html>
`;
const toc = (ctaTitle, ctaText) => `      <!-- ===================== SOMMAIRE (généré automatiquement) ===================== -->
      <aside class="aside">
        <div class="aside__sticky">
          <nav class="toc" data-toc aria-label="Sommaire">
            <div class="toc__head">
              <span class="toc__title">Sommaire</span>
              <span class="toc__current" data-toc-current></span>
              <span class="toc__time"><svg><use href="#i-clock"/></svg><span data-reading-time></span></span>
              <button class="toc__toggle" aria-label="Afficher le sommaire"><svg><use href="#i-chevron"/></svg></button>
            </div>
            <ol data-toc-list></ol>
            <div class="toc__bar"><i data-progress></i></div>
          </nav>

          <div class="aside-cta">
            <h3>${esc(ctaTitle)}</h3>
            <p>${esc(ctaText)}</p>
            <a class="btn btn--red" href="#devis">Décrire mon projet</a>
            <a class="aside-cta__phone" href="tel:+33553072682"><svg><use href="#i-phone"/></svg>05 53 07 26 82</a>
          </div>
        </div>
      </aside>`;
const finalCta = (title, text) => `    <!-- ===================== CTA FINAL ===================== -->
    <section class="final-cta" id="devis">
      <div>
        <h2>${title}</h2>
        <p>${inline(text)}</p>
      </div>
      <div class="final-cta__actions">
        <a class="btn btn--red" href="#">Je décris mon projet <svg><use href="#i-arrow"/></svg></a>
        <a class="btn btn--ghost-light" href="tel:+33553072682"><svg><use href="#i-phone"/></svg>+33 (0)5 53 07 26 82</a>
      </div>
    </section>`;

/* ------------------------------------------------------------------ texte → blocs */
const GAL_RE = /\[GALERIE PHOTOS[^\]]*\]/;
const paragraphs = content => content.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
// Repère galerie : en fin de paragraphe → retiré (la galerie est affichée dessous) ; en début de phrase → « La galerie ci-dessous »
const fixGallery = p => p.replace(/\s*\[GALERIE PHOTOS[^\]]*\]\s*([a-zà-ÿ])/g, " La galerie ci-dessous $1").replace(/\s*\[GALERIE PHOTOS[^\]]*\]\s*$/g, "").trim();
const parseBlock = p => {
  const lines = p.split("\n").map(l => l.trim()).filter(Boolean);
  const items = lines.filter(l => /^[-•–]\s+/.test(l)).map(l => l.replace(/^[-•–]\s+/, ""));
  const text = lines.filter(l => !/^[-•–]\s+/.test(l)).join(" ");
  return { text, items };
};
const ICON_RULES = [
  [/hotte|extraction|ventilation|vmc|climatis|traitement d'air|aération/i, "i-wind"],
  [/douche|lavabo|sanitaire|wc|toilette/i, "i-shower"],
  [/eau|plomberie|évacuation|chauffe-eau|ballon/i, "i-water"],
  [/électri|tableau|prise|câbl|raccordement|tgbt|onduleur|groupe électrogène/i, "i-bolt"],
  [/éclairage|led|lumin/i, "i-bulb"],
  [/sol|plancher|revêtement/i, "i-floor"],
  [/porte|serrure|fermeture|sécuri|blind|anti-effraction|alarme|vidéo|contrôle d'accès/i, "i-lock"],
  [/isolation|isolant|thermique|acoustique|panneau sandwich/i, "i-layers"],
  [/froid|frigori|réfrigér|congél|température/i, "i-snow"],
  [/chauffage|chauffant|convecteur|radiateur/i, "i-flame"],
  [/comptoir|guichet|banque d'accueil/i, "i-counter"],
  [/plan de travail|inox|cuisine|cuisson/i, "i-knife"],
  [/étagère|rayonnage|rangement|stockage|casier|armoire/i, "i-list"],
  [/bardage|habillage|peinture|finition|floc/i, "i-brush"],
  [/fenêtre|menuiserie|vitr|baie/i, "i-door"],
  [/réseau|informatique|antenne|communication|baie/i, "i-wifi"],
  [/ossature|structure|renfor|châssis|cadre/i, "i-frame"],
  [/bureau|mobilier|table|chaise|siège/i, "i-doc"],
];
const iconFor = s => (ICON_RULES.find(([re]) => re.test(s)) || [null, "i-check"])[1];
// Options : « … : a, b, c ou d. » → pastilles (virgules hors parenthèses)
const splitOptions = text => {
  const idx = text.indexOf(":"); if (idx < 0) return null;
  const lead = text.slice(0, idx).trim(); const body = text.slice(idx + 1).trim().replace(/\.$/, "");
  const parts = []; let depth = 0, cur = "";
  for (const ch of body) { if (ch === "(") depth++; if (ch === ")") depth--; if (ch === "," && depth === 0) { parts.push(cur); cur = ""; } else cur += ch; }
  parts.push(cur);
  const items = parts.map(s => s.trim().replace(/^(ou encore|ou bien|ou|et|ainsi que)\s+/i, "").trim()).filter(Boolean);
  if (items.length < 3 || items.length > 9 || items.some(s => s.length > 160 || s.length < 30 || /[.;]\s/.test(s) || /^(de|des|du|d'|elles?|ils?|qui|que|dont|afin|portant|notamment)\b/i.test(s))) return null;
  return { lead, items };
};

const STD_FORMATS = `
          <div class="table-wrap">
            <table class="specs-table">
              <caption class="sr-only">Formats de container</caption>
              <thead><tr><th scope="col">Format</th><th scope="col">Dimensions extérieures</th></tr></thead>
              <tbody>
                <tr data-format data-length="6.06" data-height="2.59"><th scope="row">20 pieds</th><td><div class="format__scale" aria-hidden="true"><div class="format__box"></div></div>6,06 × 2,44 × 2,59 m</td></tr>
                <tr data-format data-length="12.19" data-height="2.59"><th scope="row">40 pieds</th><td><div class="format__scale" aria-hidden="true"><div class="format__box"></div></div>12,19 × 2,44 × 2,59 m</td></tr>
                <tr data-format data-length="6.06" data-height="2.89"><th scope="row">High Cube</th><td><div class="format__scale" aria-hidden="true"><div class="format__box"></div></div>+ 30 cm de hauteur</td></tr>
              </tbody>
            </table>
          </div>`;
const GALLERY_TODO = `
          <!-- GALERIE PHOTOS — réalisations à intégrer (utiliser le composant .gallery[data-gallery] de la page Snack) -->
          <div class="gallery-todo"><svg><use href="#i-image"/></svg><span>Galerie photos — réalisations à intégrer</span></div>`;

/* ------------------------------------------------------------------ PAGE PRODUIT */
const SECTION_DEF = {
  intro: { id: "besoin", toc: "Le besoin", h2: p => `${displayName(p.name)} : pour quels besoins ?` },
  structure: { id: "conception", toc: "Conception", h2: () => "Conception et aménagement" },
  equip: { id: "equipements", toc: "Équipements de série", h2: () => "Équipements de série" },
  options: { id: "options", toc: "Options", h2: () => "Options de personnalisation" },
  tech: { id: "caracteristiques", toc: "Caractéristiques techniques", h2: () => "Caractéristiques techniques" },
  fab: { id: "fabrication", toc: "Fabrication", h2: p => /Bergerac/.test(p.content) ? "Fabrication dans notre atelier de Bergerac" : "Fabrication en atelier" },
  accomp: { id: "accompagnement", toc: "Accompagnement", h2: () => "Un accompagnement de l'étude à la livraison" },
  delay: { id: "delais", toc: "Délais et devis", h2: () => "Délais et devis" },
  more: { id: "approche", toc: "Notre approche", h2: () => "Notre approche" },
};
const classifyProduct = (paras) => {
  const out = []; const seen = new Set();
  paras.forEach((raw, i) => {
    const b = parseBlock(raw); const t = b.text;
    let type;
    if (i === 0) type = "intro";
    else if (b.items.length >= 2 && /option/i.test(b.text)) type = "options";
    else if (b.items.length >= 2) type = "equip";
    else if (GAL_RE.test(raw)) type = "fab";
    else if (/^caractéristiques techniques/i.test(t) || (/\b(20|40) pieds\b/.test(t) && /(\d+[,.]\d+\s?(x|×)\s?\d|m²|mètres)/.test(t)) || /^en configuration \d+ pieds/i.test(t)) type = "tech";
    else if (/^(options|plusieurs options|en option|parmi les options|selon [^:]{0,80}options)/i.test(t) || (/\boptions?\b/i.test(t.slice(0, 140)) && t.includes(":")) || /^(le |la |l')?[^.]{0,60}peut être (personnalisé|adapté)/i.test(t) || /^selon l'activité/i.test(t)) type = "options";
    else if (i === 1) type = "structure";
    else if (/accompagn/i.test(t.slice(0, 200)) || /^(notre équipe|nos équipes) (étudie|étudient|accompagne)/i.test(t)) type = "accomp";
    else if (/(délai|tarif|devis)/i.test(t)) type = "delay";
    else type = "more";
    if (seen.has(type) && out.length) { out[out.length - 1].blocks.push({ raw, ...b }); return; }
    seen.add(type); out.push({ type, blocks: [{ raw, ...b }] });
  });
  return out;
};
const renderBlocks = (sec, p) => sec.blocks.map((b, k) => {
  let html = "";
  const text = fixGallery(b.text);
  if (sec.type === "equip" && b.items.length) {
    const intro = text && !/^équipements( et aménagements)? de série\s*:?$/i.test(text) ? `\n          <p>${inline(text)}</p>` : "";
    const odd = b.items.length % 2 === 1;
    html += `${intro}
          <div class="equip-grid">
${(() => { const ic = pickIcons(b.items); return b.items.map((it, j) => `            <div class="equip${odd && j === b.items.length - 1 ? " equip--wide" : ""}"><span class="equip__icon"><svg><use href="#${ic[j]}"/></svg></span><p>${inline(cap(it.replace(/[;.]$/, "")))}</p></div>`).join("\n"); })()}
          </div>`;
  } else if (sec.type === "options" && b.items.length) {
    // Options présentées en liste à tirets → pastilles
    const lead = text && !/^options( de personnalisation)?\s*:?$/i.test(text) ? `\n          <p>${inline(text)}</p>` : "";
    html += `${lead}
          <div class="options">
${(() => { const ic = pickIcons(b.items); return b.items.map((it, j) => `            <span class="option"><svg><use href="#${ic[j]}"/></svg>${inline(cap(it.replace(/[;.]$/, "")))}</span>`).join("\n"); })()}
          </div>`;
  } else if (sec.type === "options" && k === 0 && splitOptions(text)) {
    const o = splitOptions(text);
    const lead = /^options( de personnalisation)?$/i.test(o.lead) ? "" : `\n          <p>${inline(o.lead)} :</p>`;
    html += `${lead}
          <div class="options">
${(() => { const ic = pickIcons(o.items); return o.items.map((it, j) => `            <span class="option"><svg><use href="#${ic[j]}"/></svg>${inline(cap(it))}</span>`).join("\n"); })()}
          </div>`;
  } else {
    const cls = sec.type === "intro" && k === 0 ? ' class="lead"' : "";
    if (text) html += `\n          <p${cls}>${inline(text)}</p>`;
    if (b.items.length) html += `\n          <ul class="plain-list">\n${b.items.map(it => `            <li>${inline(cap(it))}</li>`).join("\n")}\n          </ul>`;
  }
  if (sec.type === "tech" && k === 0 && /\b20 pieds\b/.test(b.text) && /\b40 pieds\b/.test(b.text)) html += STD_FORMATS;
  if (GAL_RE.test(b.raw)) html += GALLERY_TODO;
  return html;
}).join("\n");

function productPage(p, F) {
  const { main, faq } = splitFaq(p.content);
  const paras = paragraphs(main);
  const ctaText = paras.pop();
  const secs = classifyProduct(paras);
  for (const s of secs) if (s.type === "equip" && /^équipements( et aménagements)? de série\s*:?$/i.test(s.blocks[0].text)) s.h2 = s.blocks[0].text.replace(/\s*:$/, "");
  const isModules = F.root === "modules";
  p.root = F.root;
  const crumbs = isModules
    ? [{ name: "Accueil", href: "/", url: "" }, { name: "Modules & Bungalows", href: "modules-bungalows.html", url: "modules-bungalows/" }, { name: F.label, href: F.file, url: `modules-bungalows/${slug(F.label)}/` }, { name: displayName(p.name) }]
    : [{ name: "Accueil", href: "/", url: "" }, { name: "Aménagements", href: "amenagement-containers.html", url: "amenagement/" }, { name: F.label, href: F.file, url: `amenagement/${slug(F.label)}/` }, { name: displayName(p.name) }];
  const canon = (isModules ? `modules-bungalows/${slug(F.label)}/` : `amenagement/${slug(F.label)}/`) + slug(displayName(p.name)) + "/";
  const nm = displayName(p.name);
  const h1 = nm.startsWith("Container ") ? `Container <em>${esc(nm.slice(10).split(" ")[0])}</em> ${esc(nm.slice(10).split(" ").slice(1).join(" "))}`.trim()
    : `<em>${esc(nm.split(" ")[0])}</em> ${esc(nm.split(" ").slice(1).join(" "))}`.trim();
  const hasEquip = secs.some(s => s.type === "equip");
  const bergerac = /Bergerac/.test(p.content);
  const fmts = [...new Set([...p.content.matchAll(/\b(10|20|40|45)\s*(?:ou\s*\d+\s*)?pieds\b/g)].map(m => m[1]).concat([...p.content.matchAll(/\b(10|20|40|45)\s+ou\s+(10|20|40|45)\s+pieds/g)].flatMap(m => [m[1], m[2]])))].sort((a, b) => a - b);
  const pieds = fmts.length > 0;
  const facts = [
    pieds ? ["i-container", fmts.length > 1 ? fmts.slice(0, -1).join(", ") + " ou " + fmts[fmts.length - 1] + " pieds" : fmts[0] + " pieds",
      /High Cube/i.test(p.content) ? "Standard ou High Cube" : "Container ISO"] : ["i-plan", "Sur-mesure", "Étudié selon votre usage"],
    ["i-factory", bergerac ? "Atelier de Bergerac" : "Fabrication en atelier", "Fabrication contrôlée"],
    ["i-truck", "Livraison", "Et installation sur site"],
    ["i-doc", "Devis sur étude", "Selon les options retenues"],
  ];
  const siblings = F.products.filter(x => x !== p);
  const body = `<main>
  <div class="container">

    <!-- Fil d'Ariane -->
    ${breadcrumbHtml(crumbs)}

    <!-- ===================== HERO ===================== -->
    <section class="hero">
      <!-- Photo provisoire (photo de la famille) : à remplacer par une réalisation ${esc(nm)} -->
      <img class="hero__img" src="assets/img/${F.img}" alt="${escA(nm)} par CALCUB" fetchpriority="high">
      <img class="hero__badge" src="assets/img/fabrique-en-france.png" alt="Fabriqué en France" width="202" height="71">
      <div class="hero__content">
        <h1>${h1}</h1>
        <p class="hero__subtitle">${inline(p.meta)}</p>
        <div class="hero__actions">
          <a class="btn btn--red" href="#devis">Demander une étude <svg><use href="#i-arrow"/></svg></a>
          <a class="btn btn--ghost-light" href="#${hasEquip ? "equipements" : secs[1] ? SECTION_DEF[secs[1].type].id : "devis"}">${hasEquip ? "Voir les équipements" : "En savoir plus"}</a>
        </div>
      </div>
    </section>

    <!-- Chiffres clés -->
    <div class="keyfacts">
${facts.map(f => `      <div class="keyfact">
        <span class="keyfact__icon"><svg><use href="#${f[0]}"/></svg></span>
        <div><strong>${f[1]}</strong><span>${f[2]}</span></div>
      </div>`).join("\n")}
    </div>

    <!-- ===================== ARTICLE ===================== -->
    <div class="article-layout">

      <article class="article prose" data-article>
${secs.map((s, i) => { const D = SECTION_DEF[s.type]; return `
        <!-- ${String(i + 1).padStart(2, "0")} -->
        <section class="section reveal" id="${D.id}" data-toc-label="${escA(D.toc)}">
          <div class="section__head">
            <span class="section__num">${String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2>${esc(s.h2 || D.h2(p))}</h2>
            </div>
          </div>${renderBlocks(s, p)}
        </section>`; }).join("\n")}

${faqSection(faq, secs.length + 1)}

      </article>

${toc("Un projet sur mesure ?", "Recevez une étude personnalisée et un devis adapté à votre besoin.")}
    </div>

${finalCta('Décrivez votre <span class="accent">projet</span>', ctaText)}

    <!-- ===================== MÊME FAMILLE (maillage interne) ===================== -->
    <section class="related">
      <h2>Dans la famille <span class="accent">${esc(F.label)}</span></h2>
      <!-- Cartes image + titre (photos provisoires : photo de la famille, à remplacer par une photo par produit) -->
      <div class="related__grid">
${siblings.map((s, j) => `        <a class="card" href="${s.file}">
          <div class="card__img"><img src="assets/img/${F.img}" alt="" loading="lazy" style="object-position: ${["center", "left center", "right center", "center 30%", "center 70%", "left 30%", "right 70%"][j % 7]}"></div>
          <div class="card__body"><span class="card__kicker">${esc(F.label)}</span><h3 class="card__title">${esc(displayName(s.name))}</h3><span class="card__link">Découvrir →</span></div>
        </a>`).join("\n")}
        <a class="card card--all" href="${F.file}">
          <div class="card__body"><span class="card__kicker">Voir toutes les solutions</span><h3 class="card__title">Toute la famille ${esc(F.label)}</h3><span class="card__link">Découvrir →</span></div>
        </a>
      </div>
    </section>

  </div>
</main>

`;
  return head(p, canon, crumbs, false, faq) + "\n" + body + foot();
}

/* ------------------------------------------------------------------ PAGE CATÉGORIE / PILIER */
const nameVariants = n => { const d = displayName(n); return [d.replace(" / ", " & "), d,d.replace(/^Container\s+/i, ""), d.replace(/\s*[-–(].*$/, "")].filter(v => v.length > 4); };
function categoryPage(p, opts) {
  // opts: { root, children:[{name, file, meta, img?, icon}], crumbs, canon, img, icon, isPilier }
  p.root = opts.root;
  const { main, faq } = splitFaq(p.content);
  const paras = paragraphs(main);
  const ctaText = paras.pop();
  const childNames = opts.children.map(c => nameVariants(c.name));
  const mentions = t => childNames.filter(v => v.some(x => t.toLowerCase().includes(x.toLowerCase()))).length;
  const secs = []; const seen = new Set();
  paras.forEach((raw, i) => {
    let type;
    if (i === 0) type = "intro";
    else if (/(distingue|différence|ce qui fait)/i.test(raw.slice(0, 120))) type = "difference";
    else if (mentions(raw) >= 3) type = "solutions";
    // paragraphe dédié à un seul produit (« Le Container Podium propose… ») → rattaché aux solutions
    else if (raw.length < 600 && opts.children.filter(c => { const d = displayName(c.name).replace(/^Container\s+/, ""); return raw.slice(0, 120).includes(d); }).length === 1) type = "solutions";
    else type = "approche";
    if (seen.has(type) && secs.length && secs[secs.length - 1].type === type) { secs[secs.length - 1].paras.push(raw); return; }
    if (seen.has(type)) { secs.find(s => s.type === type).paras.push(raw); return; }
    seen.add(type); secs.push({ type, paras: [raw] });
  });
  if (!seen.has("solutions")) secs.splice(1, 0, { type: "solutions", paras: [] });
  const DEF = {
    intro: { id: "enjeux", toc: opts.isPilier ? "Notre démarche" : "Les enjeux", h2: opts.isPilier ? "Notre démarche" : `${opts.label} : les enjeux` },
    solutions: { id: "solutions", toc: `Nos ${opts.children.length} ${opts.childWord}`, h2: `Nos ${opts.childWord}` },
    difference: { id: "difference", toc: "La différence CALCUB", h2: "La différence CALCUB" },
    approche: { id: "approche", toc: "Notre approche", h2: "Notre approche" },
  };
  // Comme sur la page Restauration & Commerce : chaque solution reçoit la phrase du texte qui la présente.
  // Correspondance stricte (nom exact, sensible à la casse) pour ne pas confondre « Atelier » et « en atelier ».
  const exactNames = opts.children.map(c => { const d = displayName(c.name); return [d.replace(" / ", " & "), d,d.replace(/^Container\s+/, ""), d.replace(/\s*[-–(].*$/, "")].filter((v, i, a) => v.length > 4 && a.indexOf(v) === i); });
  const sentenceOf = {};
  const solSec = secs.find(s => s.type === "solutions");
  if (solSec) {
    solSec.paras = solSec.paras.map(par => {
      const sentences = par.replace(/\n/g, " ").split(/(?<=[.!?])\s+(?=[A-ZÀ-ÝÉ«"])/);
      const kept = sentences.filter(sen => {
        const hits = exactNames.map((v, i) => v.some(x => sen.includes(x)) ? i : -1).filter(i => i >= 0);
        if (hits.length === 1 && !sentenceOf[hits[0]]) { sentenceOf[hits[0]] = sen; return false; }
        return true;
      });
      return kept.join(" ").trim();
    }).filter(Boolean);
  }
  const bold = (sen, c) => { const d = displayName(c.name); const x = [d, d.replace(" / ", " & "), d.replace(/^Container\s+/, "")].find(v => sen.includes(v));
    if (!x) return inline(sen);
    const q = sen.includes(`"${x}"`) ? `"${x}"` : x;
    return inline(sen).replace(esc(q), `<strong>${esc(q)}</strong>`); };
  const crops = ["center", "center 30%", "center 70%", "left center", "right center", "center 20%", "center 85%"];
  const cards = `

        <!-- Les ${opts.children.length} ${opts.childWord} (photos provisoires : à remplacer par une réalisation par solution) -->
        <div class="products">
${opts.children.map((c, i) => `          <article class="product">
            <a class="product__img" href="${c.file}" tabindex="-1" aria-hidden="true"><img src="assets/img/${c.img || opts.img}" alt="" loading="lazy" style="object-position: ${crops[i % crops.length]}"></a>
            <div class="product__body">
              <h3><a href="${c.file}">${esc(displayName(c.name))}</a></h3>
              <p>${sentenceOf[i] ? bold(sentenceOf[i], c) : inline(c.meta)}</p>
              <a class="product__link" href="${c.file}">Découvrir cette solution<svg><use href="#i-arrow"/></svg></a>
            </div>
          </article>`).join("\n")}
        </div>`;
  const nm = opts.label;
  const words = nm.split(" ");
  const h1 = opts.isPilier ? `${esc(words[0])} <em>${esc(words.slice(1).join(" ").replace(/^& /, "& "))}</em>` : `<em>${esc(words[0])}</em> ${esc(words.slice(1).join(" "))}`;
  const body = `<main>
  <div class="container">

    <!-- Fil d'Ariane -->
    ${breadcrumbHtml(opts.crumbs)}

    <!-- ===================== HERO ===================== -->
    <section class="hub-hero">
      <div class="hub-hero__panel">
        <h1>${h1}</h1>
        <p class="hub-hero__subtitle">${inline(p.meta)}</p>
        <div class="hub-hero__actions">
          <a class="btn btn--red" href="#devis">Décrire mon projet <svg><use href="#i-arrow"/></svg></a>
          <a class="btn btn--ghost-light" href="#solutions">Voir les ${opts.children.length} ${opts.childWord}</a>
        </div>
        <dl class="hub-hero__facts">
          <div><dt>${opts.children.length}</dt><dd>${opts.childWord}</dd></div>
          <div><dt>${/Bergerac/.test(p.content) ? "Bergerac" : "Atelier"}</dt><dd>${/Bergerac/.test(p.content) ? "atelier de fabrication" : "fabrication CALCUB"}</dd></div>
          <div><dt>Sur-mesure</dt><dd>étude et devis</dd></div>
        </dl>
      </div>
      <div class="hub-hero__media">
        <!-- Photo provisoire (Unsplash) : à remplacer par une réalisation CALCUB -->
        <img src="assets/img/${opts.img}" alt="${escA(nm)} — CALCUB" fetchpriority="high">
        <img class="hub-hero__badge" src="assets/img/fabrique-en-france.png" alt="Fabriqué en France" width="202" height="71">
      </div>
    </section>

    <!-- ===================== ARTICLE + SOMMAIRE ===================== -->
    <div class="article-layout">
    <article class="article hub prose" data-article>
${secs.map(s => { const D = DEF[s.type]; return `
      <section class="section hub-section reveal" id="${D.id}" data-toc-label="${escA(D.toc)}">
        <div class="hub-section__head">
          <h2>${esc(D.h2)}</h2>
        </div>
        <div class="hub-section__body">
${s.paras.map((t, k) => `          <p${s.type === "intro" && k === 0 ? ' class="lead"' : ""}>${inline(fixGallery(t)).replace(/\n/g, " ")}</p>`).join("\n")}
        </div>${s.type === "solutions" ? cards : ""}
      </section>`; }).join("\n")}

    </article>

${toc("Un projet sur mesure ?", "Recevez une étude personnalisée et un devis adapté à votre secteur.")}
    </div>

${finalCta('Parlons de votre <span class="accent">projet</span>', ctaText)}
${opts.relatedHtml || ""}
  </div>
</main>

`;
  return head(p, opts.canon, opts.crumbs, true, faq) + "\n" + body + foot();
}

/* ------------------------------------------------------------------ génération */
const written = [];
const write = (file, html) => { fs.writeFileSync(path.join(OUT, file), html); written.push(file); };
const calcubFams = Object.values(FAM).filter(F => F.root === "calcub" && F.key !== "Fabrication & Savoir-faire");
const relatedFamilies = (current) => {
  const others = calcubFams.filter(F => F !== current).slice(0, 3);
  return `
    <!-- ===================== AUTRES FAMILLES (maillage interne) ===================== -->
    <section class="related">
      <h2>Nos autres <span class="accent">familles d'usage</span></h2>
      <div class="families families--related">
${others.map(F => `        <a class="fcard" href="${F.file}">
          <img src="assets/img/${F.img}" alt="" loading="lazy">
          <span class="fcard__body"><span class="fcard__name">${esc(F.label)}</span><span class="fcard__count">${F.products.length} solutions<svg><use href="#i-arrow"/></svg></span></span>
        </a>`).join("\n")}
        <a class="fcard fcard--all" href="amenagement-containers.html#familles">
          <span class="fcard__body"><span class="fcard__name">Toutes les familles d'usage</span><span class="fcard__count">${calcubFams.length} familles<svg><use href="#i-arrow"/></svg></span></span>
        </a>
      </div>
    </section>
`;
};

for (const b in FAM) {
  const F = FAM[b];
  // Catégorie
  if (!HANDMADE[F.cat.n]) {
    const isModules = F.root === "modules";
    const crumbs = isModules
      ? [{ name: "Accueil", href: "/", url: "" }, { name: "Modules & Bungalows", href: "modules-bungalows.html", url: "modules-bungalows/" }, { name: F.label }]
      : [{ name: "Accueil", href: "/", url: "" }, { name: "Aménagements", href: "amenagement-containers.html", url: "amenagement/" }, { name: F.label }];
    write(F.file, categoryPage(F.cat, {
      root: F.root, label: F.label, crumbs, img: F.img, icon: F.icon,
      canon: (isModules ? "modules-bungalows/" : "amenagement/") + slug(F.label) + "/",
      children: F.products.map(x => ({ name: x.name, file: x.file, meta: x.meta })),
      childWord: F.key === "Fabrication & Savoir-faire" ? "savoir-faire" : "solutions",
      relatedHtml: isModules || F.key === "Fabrication & Savoir-faire" ? "" : relatedFamilies(F),
    }));
  }
  // Produits
  for (const p of F.products) if (!HANDMADE[p.n]) write(p.file, productPage(p, F));
}
// Pilier Modules & Bungalows
const modFams = Object.values(FAM).filter(F => F.root === "modules");
write("modules-bungalows.html", categoryPage(PILIER_MODULES, {
  root: "modules", label: "Modules & Bungalows", isPilier: true, img: "familles/chantier.jpg", icon: "i-container",
  crumbs: [{ name: "Accueil", href: "/", url: "" }, { name: "Modules & Bungalows" }], canon: "modules-bungalows/",
  children: modFams.map(F => ({ name: F.label, file: F.file, meta: F.cat.meta, icon: F.icon })), childWord: "gammes",
}));

// Page « Nos conteneurs maritimes » (catalogue des gammes, contenu dans build/conteneurs-maritimes.js)
{
  const cm = require("./conteneurs-maritimes.js")({ SPRITE, TOPBAR, headerFor, FOOTER, esc, escA });
  write(cm.file, cm.html);
  // Pages SEO des gammes (contenu dans build/seo-gammes-data.js)
  for (const pg of require("./seo-gammes.js")({ SPRITE, TOPBAR, headerFor, FOOTER, esc, escA })) write(pg.file, pg.html);
}

// Plan du site (pour l'utilisateur) + données pour les liens des pages faites à la main
const map = { families: Object.values(FAM).map(F => ({ key: F.key, root: F.root, label: F.label, file: F.file, products: F.products.map(p => ({ n: p.n, name: p.name, file: p.file })) })), written };
// Plan du site (page de travail, non indexée)
{
  const grp = (title, fams) => `<h2 style="margin:40px 0 16px">${title}</h2>\n` + fams.map(F => `<h3 style="margin:24px 0 10px"><a href="${F.file}" style="color:var(--calcub-blue)">${esc(F.label)}</a> <small style="color:var(--muted);font-weight:500">(${F.products.length})</small></h3>
<div class="siblings">${F.products.map(p => `<a class="sibling" href="${p.file}"><span>${esc(p.name)}</span></a>`).join("")}</div>`).join("\n");
  const fams = Object.values(FAM);
  fs.writeFileSync(path.join(OUT, "plan-du-site.html"), `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Plan du site — pages CALCUB</title><meta name="robots" content="noindex">
<link href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap" rel="stylesheet"><link rel="stylesheet" href="assets/css/seo-page.css"></head>
<body><main class="container" style="padding:48px 24px 80px"><h1 style="font-size:40px">Plan du site <span class="accent">CALCUB</span></h1>
<p style="color:var(--muted)">Page de travail (non indexée) : ${written.length + Object.keys(HANDMADE).length} pages générées depuis ${esc(xlsxFile)}.</p>
<div class="siblings" style="margin-top:24px"><a class="sibling sibling--all" href="amenagement-containers.html"><span>Aménagement de containers (pilier)</span></a><a class="sibling sibling--all" href="modules-bungalows.html"><span>Modules &amp; Bungalows (pilier)</span></a></div>
${grp("Aménagements CALCUB", fams.filter(F => F.root === "calcub"))}
${grp("Modules &amp; Bungalows", fams.filter(F => F.root === "modules"))}
</main></body></html>`);
}
// Contrôles : texte de l'Excel bien présent + aucun lien interne cassé
require("./verify.js")(data, map, OUT);
console.log("pages écrites :", written.length);
