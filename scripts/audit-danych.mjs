import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const write = (p, s) => writeFileSync(join(root, p), s, "utf8");

const techs = JSON.parse(read("src/data/techniques.json"));
const levels = JSON.parse(read("src/data/levels.json"));
const glossary = JSON.parse(read("src/data/glossary.json"));
const indexTs = read("src/data/index.ts");
const genaiImages = JSON.parse(read("src/features/technique/data/genaiImages.json"));

const categories = [
  ...indexTs
    .match(/export const CATEGORIES = \[(.*?)\]/s)[1]
    .matchAll(/"([^"]+)"/g),
].map((m) => m[1]);

const MACRONS = { "ā": "a", "ī": "i", "ū": "u", "ō": "o", "ē": "e" };
const foldMacrons = (value) => value.replace(/[āīūōē]/g, (char) => MACRONS[char]);

const normalizeAlias = (value) =>
  foldMacrons(value.toLowerCase())
    .replace(/[\s\u2014-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const critical = [];
const warn = [];

const uniq = (arr) => new Set(arr).size;

// --- 1. techniques.json -----------------------------------------------------

const dupIds = techs.map((t) => t.id).filter((id, i, a) => a.indexOf(id) !== i);
if (dupIds.length) critical.push("techniques.json — zduplikowane id: " + dupIds.join(", "));

for (const t of techs) {
  if (!t.id || !t.name || !t.description) critical.push("techniques.json — puste pole w \"" + t.id + "\" (id/name/description)");
  if (!Array.isArray(t.levels) || t.levels.length === 0) critical.push("techniques.json — \"" + t.id + "\" ma puste levels[]");
  if (t.levels && t.levels.some((l) => !Number.isInteger(l) || l < 0 || l > 15))
    critical.push("techniques.json — \"" + t.id + "\" ma levels poza zakresem 0–15: " + JSON.stringify(t.levels));
  if (!categories.includes(t.category)) critical.push("techniques.json — \"" + t.id + "\" ma kategorię spoza CATEGORIES: \"" + t.category + "\"");
}

// --- 2. kolizje aliasów -----------------------------------------------------

const aliasMap = new Map();
for (const t of techs)
  for (const a of t.aliases ?? []) {
    const k = normalizeAlias(a);
    if (!aliasMap.has(k)) aliasMap.set(k, []);
    aliasMap.get(k).push(t.id);
  }
const collisions = [...aliasMap].filter(([, ids]) => new Set(ids).size > 1);
for (const [alias, ids] of collisions)
  warn.push("KOLIZJA — alias \"" + alias + "\" → " + ids.length + " technik: " + ids.join(", "));

// --- 3. glossary.json -------------------------------------------------------

const glossEntries = glossary.categories.flatMap((c) => c.entries);
const glossIds = new Set(glossEntries.map((e) => e.id));
const techIds = new Set(techs.map((t) => t.id));

// mapa obrazów GenAI (src/features/technique/data/) ↔ id technik
for (const key of Object.keys(genaiImages))
  if (!techIds.has(key)) warn.push("GenAI — mapa obrazów wskazuje nieistniejącą technikę \"" + key + "\"");

const dupGloss = glossEntries.map((e) => e.id).filter((id, i, a) => a.indexOf(id) !== i);
if (dupGloss.length) critical.push("glossary.json — zduplikowane id: " + dupGloss.join(", "));
for (const e of glossEntries) {
  if (!e.term) critical.push("glossary.json — pusty term w \"" + e.id + "\"");
  for (const r of e.related ?? [])
    if (!techIds.has(r) && !glossIds.has(r)) critical.push("glossary.json — martwy related \"" + r + "\" w haśle \"" + e.id + "\"");
}

// --- 4. levels.json (strukturalne wymagania ↔ atlas + słownik) ---------------

const techById = new Map(techs.map((t) => [t.id, t]));
const glossById = new Map(glossEntries.map((e) => [e.id, e]));
const levelByNumber = new Map(levels.map((l) => [l.number, l]));

if (uniq(levels.map((l) => l.id)) !== levels.length) critical.push("levels.json — zduplikowane id stopni");
if (uniq(levels.map((l) => l.number)) !== levels.length) critical.push("levels.json — zduplikowane number");
if (uniq(levels.map((l) => l.order)) !== levels.length) critical.push("levels.json — zduplikowane order");

const mismatches = [];
for (const l of levels) {
  if (!l.groups || l.groups.length === 0) critical.push("levels.json — \"" + l.id + "\" bez grup wymagań");
  if (l.fights !== null && (!Number.isInteger(l.fights) || l.fights < 0))
    critical.push("levels.json — \"" + l.id + "\" ma nieprawidłowe pole fights: " + JSON.stringify(l.fights));
  const seen = new Set();
  for (const g of l.groups ?? []) {
    if (!g.title) critical.push("levels.json — \"" + l.id + "\" ma grupę bez tytułu");
    for (const it of g.items ?? []) {
      let key;
      if (it && it.type === "technique") {
        if (!it.id || !it.id.trim()) critical.push("levels.json — \"" + l.id + "\" ma technikę bez id");
        else if (!techById.has(it.id)) critical.push("levels.json — \"" + l.id + "\" wskazuje nieistniejącą technikę \"" + it.id + "\"");
        else if (!techById.get(it.id).levels.includes(l.number))
          mismatches.push({ kyu: l.kyu, id: it.id, levels: [...techById.get(it.id).levels].sort((a, b) => b - a).join(", ") });
        key = "t:" + it.id;
      } else if (it && it.type === "glossary") {
        if (!it.id || !it.id.trim()) critical.push("levels.json — \"" + l.id + "\" ma hasło słownika bez id");
        else if (!glossById.has(it.id)) critical.push("levels.json — \"" + l.id + "\" wskazuje nieistniejące hasło \"" + it.id + "\"");
        else if (glossById.get(it.id).levels?.length && !glossById.get(it.id).levels.includes(l.number))
          mismatches.push({ kyu: l.kyu, id: it.id, levels: [...(glossById.get(it.id).levels ?? [])].sort((a, b) => b - a).join(", ") });
        key = "g:" + it.id;
      } else if (it && it.type === "text" && typeof it.text === "string" && it.text.trim()) {
        key = "x:" + it.text;
      } else {
        critical.push("levels.json — \"" + l.id + "\" ma nieprawidłowy element wymagania: " + JSON.stringify(it));
      }
      if (key) {
        if (seen.has(key)) critical.push("levels.json — \"" + l.id + "\" ma zduplikowane wymaganie (" + key + ")");
        seen.add(key);
      }
    }
  }
}
for (const m of mismatches)
  critical.push("P0.3 — \"" + m.id + "\" (levels=[" + m.levels + "]) wymagane w " + m.kyu + ", których nie ma w levels[]");

// --- 4b. Spójność belek (P0.4) ---
for (const l of levels) {
  const expected = l.stripe === null ? 0 : l.belt === "black" ? l.number - 10 : 1;
  const actual = l.stripes ?? (l.stripe ? 1 : 0);
  if (l.stripe === null && l.stripes != null) critical.push("P0.4 — \"" + l.id + "\" ma stripes bez stripe");
  else if (actual !== expected) critical.push("P0.4 — \"" + l.id + "\" (" + l.kyu + "): stripes=" + actual + ", oczekiwano " + expected);
}

const outsideRequirements = [];
for (const t of techs)
  for (const n of t.levels) {
    const l = levelByNumber.get(n);
    if (!l) continue;
    const refs = l.groups.flatMap((g) => g.items).filter((i) => i.type === "technique").map((i) => i.id);
    if (!refs.includes(t.id)) outsideRequirements.push(l.kyu + ": " + t.id);
  }
for (const o of outsideRequirements) warn.push("POZA WYMAGANIAMI — technika z atlasu nieuwzględniona w wymaganiach: " + o);

// --- 5. pokrycie i statystyki ----------------------------------------------

const coverage = levels.map((l) => {
  const items = l.groups.flatMap((g) => g.items);
  return {
    kyu: l.kyu,
    id: l.id,
    atlas: techs.filter((t) => t.levels.includes(l.number)).length,
    tech: items.filter((i) => i.type === "technique").length,
    gloss: items.filter((i) => i.type === "glossary").length,
    text: items.filter((i) => i.type === "text").length,
    fights: l.fights,
  };
});

const allItems = levels.flatMap((l) => l.groups.flatMap((g) => g.items.map((item) => ({ level: l, item }))));
const techItems = allItems.filter(({ item }) => item.type === "technique");
const glossItems = allItems.filter(({ item }) => item.type === "glossary");
const textItems = allItems.filter(({ item }) => item.type === "text");
const requiredTechIds = new Set(techItems.map(({ item }) => item.id));
const requiredGlossIds = new Set(glossItems.map(({ item }) => item.id));

const missingInAtlas = textItems.filter(({ item }) => /saiha|seienchin|ushiro-mawashi/i.test(item.text));

const images = techs.filter((t) => t.image);
const uniqueImages = uniq(images.map((t) => t.image));
const unsplash = images.filter((t) => t.image.includes("images.unsplash.com"));
const videos = techs.filter((t) => t.video);
const genaiCover = techs.filter((t) => genaiImages[t.id]).length;
const allAliases = techs.flatMap((t) => t.aliases ?? []);

const dt = new Date().toISOString().slice(0, 10);
const lines = [];
const p = (...s) => lines.push(...s);

p(
  "# RAPORT.md — audyt danych KIHON",
  "",
  "> Generowany przez `node scripts/audit-danych.mjs` — nie edytuj ręcznie (data: " + dt + ").",
  "> Dane wejściowe: `src/data/techniques.json`, `levels.json`, `glossary.json`,",
  "> `src/data/index.ts` (CATEGORIES), `src/features/technique/data/genaiImages.json`.",
  "",
  "## 1. Integralność struktury",
  "",
  critical.length
    ? "Krytyczne problemy: **" + critical.length + "**\n\n" + critical.map((c) => "- ❌ " + c).join("\n")
    : "Krytycznych problemów: **0** ✅ (id unikalne, obowiązkowe pola, kategorie ↔ `CATEGORIES`, `levels`∈0–15, mapa GenAI ↔ id technik, słownik bez martwych `related`, `levels.json`: wymagania strukturalne wskazują istniejące techniki/haseła zgodne z P0.3, belki zgodne z stopniem P0.4).",
  "",
  "Ostrzeżenia: **" + warn.length + "**",
  "",
  "## 2. Pokrycie stopni",
  "",
  "| Stopień | Techniki w atlasie | Wymagania: techniki | Wymagania: postawy (slownik) | Wymagania: opisy | Walki |",
  "|---|---:|---:|---:|---:|---:|",
  ...coverage.map((c) => {
    const fightsStr = c.fights === null ? "\u2014" : String(c.fights);
    const parts = [c.kyu + " (" + c.id + ")", String(c.atlas), String(c.tech), String(c.gloss), String(c.text), fightsStr];
    return "| " + parts.join(" | ") + " |";
  }),
  "",
  "Zakres `levels[]` technik i numerów stopni: 0 (start) – 15 (5 dan).",
  "",
  "## 3. Spójność wymagań ↔ atlas (P0.3)",
  "",
  (mismatches.length || outsideRequirements.length)
    ? [
        mismatches.length ? "**Mismatches: " + mismatches.length + "** (krytyczne, sekcja 1)." : "",
        outsideRequirements.length
          ? "**Techniki poza wymaganiami: " + outsideRequirements.length + "** (ostrzeżenia):"
          : "",
        ...outsideRequirements.map((o) => "  - " + o),
      ].filter(Boolean).join("\n")
    : "Wszystkie techniki/haseła w wymaganiach mają właściwy stopień w `levels[]`, a każda technika z atlasu występuje w wymaganiach swojego stopnia ✅",
  "",
  "## 4. Kolizje aliasów",
  "",
  collisions.length
    ? collisions.map(([alias, ids]) => "- ⚠️ „" + alias + "\" → " + ids.length + " technik: " + ids.join(", ")).join("\n")
    : "Brak kolizji ✅ (aliasy to obecnie tylko metadane — aplikacja nie linkuje po aliasach, wymagania to referencje strukturalne).",
  "",
  "## 5. Pozycje wymagań bez techniki (typu `text` i `glossary`)",
  "",
  "**" + textItems.length + " / " + allItems.length + "** pozycji to opisy nielinkowane (etykieta, wiedza, próba).",
  "**" + glossItems.length + " / " + allItems.length + "** pozycji to linki do haseł słownika (postawy).",
  "",
  ...levels.flatMap((l) => {
    const texts = l.groups.flatMap((g) => g.items).filter((i) => i.type === "text");
    return texts.length ? ["- **" + l.kyu + "** (" + texts.length + "): " + texts.map((i) => i.text).join(" · ")] : [];
  }),
  "",
  ...levels.flatMap((l) => {
    const gloss = l.groups.flatMap((g) => g.items).filter((i) => i.type === "glossary");
    return gloss.length ? ["- **" + l.kyu + "** (" + gloss.length + "): " + gloss.map((i) => i.id).join(", ")] : [];
  }),
  "",
  missingInAtlas.length
    ? "\nZ tego braki w atlasie do zadania **P1.6**: " + missingInAtlas.map(({ item }) => "„" + item.text + "\"").join(", ") + "."
    : "",
  "",
  "## 6. Media i zdjęcia",
  "",
  "- techniki z `image`: " + images.length + "/" + techs.length + " (unikalnych URL-i: " + uniqueImages + ", w tym Unsplash: " + unsplash.length + ") → zadanie **P1.5**",
  "- techniki z `video`: " + videos.length + "/" + techs.length + (videos.length ? " (" + videos.map((v) => v.name + ": " + v.video).join("; ") + ")" : " (pole zawsze `null` — miejsce na przyszłe filmiki)"),
  "- techniki z tymczasowym zdjęciem GenAI: **" + genaiCover + "/" + techs.length + "** (mapa `genaiImages.json`), bez zdjęcia → placeholder z kanji: " + (techs.length - genaiCover),
  "",
  "## 7. Statystyki",
  "",
  "- stopni: **" + levels.length + "** (start, 10–1 kyu, 1–5 dan)",
  "- technik łącznie: **" + techs.length + "**",
  "- technik powiązanych z wymaganiami: **" + requiredTechIds.size + "** (poza wymaganiami: " + (techs.length - requiredTechIds.size) + ")",
  "- haseł słownika w wymaganiach: **" + requiredGlossIds.size + "**",
  "- aliasów łącznie: **" + allAliases.length + "** (kolizje: " + collisions.length + ")",
  "- haseł słownika: **" + glossEntries.length + "** w " + glossary.categories.length + " kategoriach (" + glossary.categories.map((c) => c.name + ": " + c.entries.length).join(", ") + ")",
  "",
  "## 8. Rekomendacje",
  "",
  "1. **P1.6** — dopisać do atlasu Seienchin i Ushiro-mawashi-geri (sekcja 5).",
  "2. **P1.7** — hasła Rei/Osu/Bunkai/Kamae + linkowanie opisów wymagań do słownika (sekcja 5); infrastruktura `{type:\"glossary\"}` gotowa.",
  "3. **P1.5** — zdjęcia self-hosted zamiast Unsplash (sekcja 6).",
  "4. **P1.1** — weryfikacja treści 16 stopni ze sensei (nazwy, zakres, staż, liczby walk).",
  "",
);

write("RAPORT.md", lines.join("\n"));

console.log("RAPORT.md zapisany (" + dt + ")");
console.log("  krytyczne: " + critical.length);
console.log("  ostrzeżenia: " + warn.length + " (" + collisions.length + " KOLIZJA, " + outsideRequirements.length + " POZA WYMAGANIAMI)");
console.log("  wymagania: " + techItems.length + " technik + " + glossItems.length + " haseł + " + textItems.length + " opisów");
if (critical.length) {
  for (const c of critical) console.error("  ✗ " + c);
  process.exit(1);
}