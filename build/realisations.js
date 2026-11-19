// ============================================================================
// Réalisations CALCUB : page liste (realisations.html)
//   Contenu : build/realisations-data.js (miroir des champs WordPress).
//   Filtres par secteur + clic sur une carte = photo agrandie (pas de page par réalisation).
//   DA : assets/css/calcub-page.css (section « Page Réalisations »), script : assets/js/realisations.js
// ============================================================================
const { SECTEURS, REALISATIONS } = require("./realisations-data.js");
const BASE = "https://www.cubner.com/";

module.exports = function realisations({ SPRITE, TOPBAR, headerFor, FOOTER, esc, escA }) {
  const items = REALISATIONS.map(r => {
    if (!SECTEURS[r.secteur]) throw new Error(`Réalisation « ${r.titre} » : secteur inconnu « ${r.secteur} »`);
    return { ...r, sect: SECTEURS[r.secteur] };
  });

  const head = ({ title, meta, canon, crumbs, ogImg }) => `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- ===== SEO ===== -->
  <title>${esc(title)}</title>
  <meta name="description" content="${escA(meta)}">
  <link rel="canonical" href="${BASE}${canon}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escA(title)}">
  <meta property="og:description" content="${escA(meta)}">${ogImg ? `
  <meta property="og:image" content="${BASE}assets/img/${ogImg}">` : ""}
  <meta property="og:locale" content="fr_FR">

  <link rel="preconnect" href="https://api.fontshare.com">
  <link href="https://api.fontshare.com/v2/css?f[]=switzer@300,400,500,600,700,800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/seo-page.css">
  <link rel="stylesheet" href="assets/css/calcub-page.css">

  <script type="application/ld+json">
  ${JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, ...(c.url !== undefined ? { item: BASE + c.url } : {}) })) })}
  </script>
</head>
<body>

${SPRITE}

${TOPBAR}${headerFor("calcub")}
`;
  const breadcrumb = crumbs => `    <nav class="breadcrumb" aria-label="Fil d'Ariane">
      ${crumbs.map((c, i) => i === crumbs.length - 1 ? `<span aria-current="page">${esc(c.name)}</span>` : `<a href="${c.href}">${esc(c.name)}</a>`).join(" / ")}
    </nav>`;
  const foot = () => `${FOOTER}<script src="assets/js/realisations.js"></script>
</body>
</html>
`;
  const CRUMBS = [
    { name: "Accueil", href: "/", url: "" },
    { name: "Aménagement avec Calcub", href: "amenagement-containers.html", url: "amenagement/" },
    { name: "Nos réalisations", href: "realisations.html", url: "amenagement/realisations/" },
  ];
  const finalCta = `    <!-- ===================== APPEL À L'ACTION ===================== -->
    <section class="cb-final" id="devis">
      <h2 class="cb-h2">Votre projet sera notre <span class="cb-orange">prochaine réalisation</span></h2>
      <p class="cb-intro">Décrivez-nous votre besoin : nos équipes étudient la faisabilité et vous proposent un plan d'aménagement et un devis adaptés à votre activité.</p>
      <div class="cb-final__actions">
        <a class="btn btn--red" href="#">Demander un devis</a>
      </div>
    </section>`;

  // Carte : toute la carte est un bouton qui agrandit la photo (titre + résumé en légende)
  const card = r => `        <article class="rz-card" data-secteur="${r.secteur}">
          <div class="rz-card__media"><img src="assets/img/${r.photo}" alt="${escA(r.titre)}" loading="lazy"><span class="rz-card__zoom" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/></svg></span></div>
          <div class="rz-card__body">
            <span class="rz-card__tag">${esc(r.sect.label)}</span>
            <h3><button class="rz-card__title" type="button" data-rz-zoom aria-label="Agrandir la photo : ${escA(r.titre)}">${esc(r.titre)}</button></h3>
            <p>${esc(r.resume)}</p>
          </div>
        </article>`;

  /* ---------------------------------------------------------------- LISTE */
  const used = Object.keys(SECTEURS).filter(k => items.some(r => r.secteur === k));
  const listHtml = head({
    title: "Nos réalisations de containers aménagés | CALCUB",
    meta: "Découvrez les réalisations CALCUB : containers maritimes aménagés en bar, boutique, base de chantier, shelter technique, chambre froide ou studio de jardin. Fabrication en Dordogne.",
    canon: "amenagement/realisations/", crumbs: CRUMBS,
  }) + `
<main class="cb">
  <div class="container">

${breadcrumb(CRUMBS)}

    <!-- ===================== HERO : texte + mosaïque de réalisations ===================== -->
    <section class="rz-hero">
      <div class="rz-hero__text">
        <img class="rz-hero__logo" src="assets/img/calcub/calcub-symbole.png" alt="CALCUB by Cubner" width="427" height="149">
        <h1>Nos <span class="cb-orange">réalisations</span><br>de conteneurs aménagés</h1>
        <p>Bars, boutiques, bases de chantier, shelters techniques, chambres froides… Chaque conteneur est conçu sur mesure et transformé dans nos ateliers en Dordogne.</p>
        <div class="rz-hero__actions">
          <a class="btn btn--red" href="#realisations">Voir les réalisations</a>
          <a class="btn btn--ghost-light" href="#devis">Demander un devis</a>
        </div>
      </div>
      <div class="rz-hero__mosaic" aria-hidden="true">
        <img class="rz-hero__m1" src="assets/img/calcub/atelier-fabrication.png" alt="" fetchpriority="high">
        <img class="rz-hero__m2" src="assets/img/calcub/realisation-bardage-bois.png" alt="">
        <img class="rz-hero__m3" src="assets/img/calcub/realisation-rideaux-metalliques.png" alt="">
        <img class="rz-hero__badge" src="assets/img/fabrique-en-france.png" alt="" width="202" height="71">
      </div>
    </section>

    <!-- ===================== REPÈRES ===================== -->
    <ul class="rz-facts">
      <li><strong>13</strong><span>secteurs d'activité<br>accompagnés</span></li>
      <li><strong>4 étapes</strong><span>de la pré-étude<br>à la mise en service</span></li>
      <li><strong>100 %</strong><span>sur mesure, de l'étude<br>à l'installation</span></li>
      <li><strong>Dordogne</strong><span>fabrication dans<br>nos ateliers</span></li>
    </ul>

    <!-- ===================== LISTE DES RÉALISATIONS (archive WordPress) =====================
         Générée depuis build/realisations-data.js. Filtres = secteurs ayant au moins une réalisation. -->
    <section class="cb-block" id="realisations" data-rz-gallery>
      <div class="cb-center">
        <h2 class="cb-h2">Des projets sur mesure pour <span class="cb-orange">tous les secteurs</span></h2>
        <p class="cb-intro">Chaque conteneur est étudié, conçu et fabriqué pour un usage précis. Filtrez par secteur d'activité pour trouver des réalisations proches de votre projet.</p>
      </div>

      <div class="rz-filters" role="group" aria-label="Filtrer les réalisations par secteur" data-rz-filters>
        <button type="button" class="rz-filter is-active" data-filter="tous" aria-pressed="true">Toutes <span class="rz-filter__count">${items.length}</span></button>
${used.map(k => `        <button type="button" class="rz-filter" data-filter="${k}" aria-pressed="false">${esc(SECTEURS[k].label)} <span class="rz-filter__count">${items.filter(r => r.secteur === k).length}</span></button>`).join("\n")}
      </div>

      <div class="rz-grid">
${items.map(r => card(r)).join("\n")}
      </div>
      <p class="rz-empty" data-rz-empty hidden>Aucune réalisation dans ce secteur pour le moment. <a href="#devis">Parlez-nous de votre projet</a>.</p>
    </section>

${finalCta}

  </div>
</main>

` + foot();

  return { file: "realisations.html", html: listHtml, count: items.length };
};
