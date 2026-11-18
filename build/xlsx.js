// Lecture d'un fichier .xlsx sans dépendance : décompression ZIP (zlib) + lecture des feuilles.
// Retourne [{ sheet: "Nom", rows: [[cellule, ...], ...] }, ...]
const fs = require("fs");
const zlib = require("zlib");

function unzip(buf) {
  // Fin du répertoire central
  let eocd = buf.length - 22;
  while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error("Fichier xlsx illisible (ZIP invalide)");
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const files = {};
  for (let i = 0; i < count; i++) {
    const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20);
    const nlen = buf.readUInt16LE(p + 28), xlen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.toString("utf8", p + 46, p + 46 + nlen);
    const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const raw = buf.subarray(start, start + csize);
    files[name] = method === 8 ? zlib.inflateRawSync(raw) : raw;
    p += 46 + nlen + xlen + clen;
  }
  return files;
}

const decode = s => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&amp;/g, "&");
const colIdx = ref => { let n = 0; for (const c of ref.match(/^[A-Z]+/)[0]) n = n * 26 + (c.charCodeAt(0) - 64); return n - 1; };

function readXlsx(file) {
  const z = unzip(fs.readFileSync(file));
  const txt = n => (z[n] ? z[n].toString("utf8") : "");
  const shared = [...txt("xl/sharedStrings.xml").matchAll(/<si>([\s\S]*?)<\/si>/g)]
    .map(m => [...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(x => decode(x[1])).join(""));
  // Noms des feuilles → fichiers
  const rels = {}; for (const m of txt("xl/_rels/workbook.xml.rels").matchAll(/<Relationship [^>]*Id="([^"]+)"[^>]*Target="([^"]+)"/g)) rels[m[1]] = m[2].replace(/^\/?(xl\/)?/, "xl/");
  const sheets = [...txt("xl/workbook.xml").matchAll(/<sheet [^>]*name="([^"]+)"[^>]*r:id="([^"]+)"/g)].map(m => ({ name: decode(m[1]), file: rels[m[2]] }));
  return sheets.map(({ name, file }) => {
    const rows = [];
    for (const r of txt(file).matchAll(/<row[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g)) {
      const row = [];
      for (const c of r[2].matchAll(/<c r="([A-Z]+\d+)"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const t = (c[2].match(/t="(\w+)"/) || [])[1]; const inner = c[3] || "";
        let v = (inner.match(/<v>([\s\S]*?)<\/v>/) || [])[1];
        if (t === "s") v = shared[+v];
        else if (t === "inlineStr") v = [...inner.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(x => decode(x[1])).join("");
        else if (v !== undefined) v = decode(v);
        if (v !== undefined) row[colIdx(c[1])] = v;
      }
      rows[+r[1] - 1] = row;
    }
    return { sheet: name, rows };
  });
}
module.exports = { readXlsx };
