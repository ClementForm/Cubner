// Contrôles après construction :
//  1. chaque phrase du texte de l'Excel est présente dans sa page
//  2. aucun lien interne (vers une page .html) n'est cassé
const fs = require("fs"), path = require("path");

module.exports = function verify(data, map, OUT) {
  const rows = data[0].rows.slice(1).filter(r => r && r[2]);
  const fileOf = {};
  for (const F of map.families) for (const p of F.products) fileOf[parseInt(p.n)] = p.file;
  for (const F of map.families) {
    const cat = rows.find(r => r[1].trim().endsWith(" / " + F.key) && r[3] === "categorie");
    if (cat) fileOf[parseInt(cat[0])] = F.file;
  }
  fileOf[1] = "amenagement-containers.html"; fileOf[2] = "modules-bungalows.html";
  const norm = s => s.replace(/<\/?strong>/g, "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#8209;/g, "-").replace(/\*\*/g, "").replace(/\s+/g, " ").trim().toLowerCase();

  const problems = [];
  for (const r of rows) {
    const n = parseInt(r[0]); const f = fileOf[n];
    if (!f) { problems.push(`N°${n} « ${r[2]} » : aucune page`); continue; }
    if (n === 4) continue; // page Snack mise en forme à la main
    const html = norm(fs.readFileSync(path.join(OUT, f), "utf8"));
    const missing = [];
    const units = (r[7] || "").split(/\n/).map(s => s.replace(/^[-•–]\s+/, "").replace(/\[GALERIE PHOTOS[^\]]*\]/g, "").trim()).filter(Boolean);
    for (const u of units) for (const chunk of u.split(/(?<=[.!?])\s+/)) {
      const c = norm(chunk).replace(/[.;]$/, ""); if (c.length < 12) continue;
      const parts = c.includes(":") ? c.split(/\s*:\s*/).filter(x => x.length > 12) : [c];
      for (const part of parts) for (const sub of part.split(/,\s+(?:ou encore |ou |et )?/)) {
        const t = sub.replace(/^(ou encore|ou|et)\s+/, "").trim();
        if (t.length > 14 && !html.includes(t)) missing.push(t);
      }
    }
    if (missing.length) problems.push(`N°${n} ${f} : ${missing.length} passage(s) absent(s), ex. « ${missing[0].slice(0, 80)} »`);
  }

  const pages = fs.readdirSync(OUT).filter(f => f.endsWith(".html"));
  const broken = new Set();
  for (const f of pages) for (const m of fs.readFileSync(path.join(OUT, f), "utf8").matchAll(/href="([^"#:]+\.html)/g))
    if (!fs.existsSync(path.join(OUT, m[1]))) broken.add(`${m[1]} (depuis ${f})`);

  console.log(`\n${pages.length} pages dans site/`);
  console.log(problems.length ? `⚠ Texte : ${problems.length} problème(s)\n  - ${problems.join("\n  - ")}` : "✔ Texte : tout le contenu de l'Excel est présent");
  console.log(broken.size ? `⚠ Liens cassés : ${broken.size}\n  - ${[...broken].join("\n  - ")}` : "✔ Liens internes : aucun lien cassé");
};
