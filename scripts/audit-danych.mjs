import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const write = (p, s) => writeFileSync(join(root, p), s, "utf8");

const techs = JSON.parse(read("src/data/techniques.json"));
const levels = JSON.parse(read("src/data/levels.json"));
const glossary = JSON.parse(read("src/data/glossary.json"));
const tsx = read("src/components/TechniqueIllustration.tsx");
const indexTs = read("src/data/index.ts");

const drawings = (() => {
  const start = tsx.indexOf("const DRAWINGS");
  const end = tsx.indexOf("export default", start);
  return [...tsx.slice(start, end).matchAll(/^  ([a-z]+):/gm)].map((m) => m[1]);
})();

const categories = [
  ...indexTs
    .match(/export const CATEGORIES = \[(.*?)\]/s)[1]
    .matchAll(/"([^"]+)"/g),
].map((m) => m[1]);

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const MACRONS = { "ā": "a", "ī": "i", "ū": "u", "ō": "o", "ē": "e" };
const VOWELS = { a: "ā", i: "ī", u: "ū", o: "ō", e: "ē" };

const foldMacrons = (value) => value.replace(/[āīūōē]/g, (char) => MACRONS[char]);

const normalizeAlias = (value) =>
  foldMacrons(value.toLowerCase())
    .replace(/[\s\u2014-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const aliasPatternSource = (alias) => {
  let source = "";
  let separator = false;
  const flushSeparator = () => {
    if (separator && source) source += "[\\s\u2014-]+";
    separator = false;
  };
  for (const char of alias) {
    const lower = foldMacrons(char.toLowerCase());
    if (lower in VOWELS) {
      flushSeparator();
      source += `[${lower}${VOWELS[lower]}]`;
    } else if (/[\s\u2014-]/.test(char)) {
      separator = true;
    } else {
      flushSeparator();
      source += escapeRegExp(char);
    }
  }
  const start = /^[\p{L}\p{N}]/u.test(alias) ? "(?<![\\p{L}\\p{N}-])" : "";
  const end = /[\p{L}\p{N}]$/u.test(alias) ? "(?![\\p{L}\\p{N}-])" : "";
  return start + source + end;
};

const linkPattern = new RegExp(
  `(${[...new Set(techs.flatMap((t) => t.aliases))]
    .sort((a, b) => b.length - a.length)
    .map(aliasPatternSource)
    .join("|")})`,
  "gi",
);

const byAlias = new Map();
for (const t of techs)
  for (const a of t.aliases ?? []) byAlias.set(normalizeAlias(a), t);

const resolvedParts = (item) =>
  item.split(linkPattern).filter((part) => byAlias.has(normalizeAlias(part)));

const findMatches = (item) =>
  resolvedParts(item).map((part) => byAlias.get(normalizeAlias(part)));

const hasMatch = (item) => resolvedParts(item).length > 0;

const critical = [];
const warn = [];

const uniq = (arr) => new Set(arr).size;

const dupIds = techs.map((t) => t.id).filter((id, i, a) => a.indexOf(id) !== i);
if (dupIds.length) critical.push(`techniques.json — zduplikowane id: ${dupIds.join(", ")}`);

for (const t of techs) {
  if (!t.id || !t.name || !t.description) critical.push(`techniques.json — puste pole w "${t.id}" (id/name/description)`);
  if (!Array.isArray(t.levels) || t.levels.length === 0) critical.push(`techniques.json — "${t.id}" ma puste levels[]`);
  if (t.levels && t.levels.some((l) => !Number.isInteger(l) || l < 1 || l > 10))
    critical.push(`techniques.json — "${t.id}" ma levels poza zakresem 1–10: ${JSON.stringify(t.levels)}`);
  if (!categories.includes(t.category)) critical.push(`techniques.json — "${t.id}" ma kategorię spoza CATEGORIES: "${t.category}"`);
  if (!drawings.includes(t.infographic)) critical.push(`techniques.json — "${t.id}" ma infographic bez ilustracji: "${t.infographic}"`);
}

const aliasMap = new Map();
for (const t of techs)
  for (const a of t.aliases ?? []) {
    const k = normalizeAlias(a);
    if (!aliasMap.has(k)) aliasMap.set(k, []);
    aliasMap.get(k).push(t.id);
  }
const collisions = [...aliasMap].filter(([, ids]) => new Set(ids).size > 1);
for (const [alias, ids] of collisions)
  warn.push(`KOLIZJA — alias "${alias}" → ${ids.length} technik: ${ids.join(", ")}`);

const glossEntries = glossary.categories.flatMap((c) => c.entries);
const glossIds = new Set(glossEntries.map((e) => e.id));
const techIds = new Set(techs.map((t) => t.id));
const dupGloss = glossEntries.map((e) => e.id).filter((id, i, a) => a.indexOf(id) !== i);
if (dupGloss.length) critical.push(`glossary.json — zduplikowane id: ${dupGloss.join(", ")}`);
for (const e of glossEntries) {
  if (!e.term) critical.push(`glossary.json — pusty term w "${e.id}"`);
  for (const r of e.related ?? [])
    if (!techIds.has(r) && !glossIds.has(r)) critical.push(`glossary.json — martwy related "${r}" w hale "${e.id}"`);
}

const levelIds = levels.map((l) => l.id);
if (uniq(levelIds) !== levelIds.length) critical.push("levels.json — zduplikowane id stopni");
if (uniq(levels.map((l) => l.number)) !== levels.length) critical.push("levels.json — zduplikowane number");
if (uniq(levels.map((l) => l.order)) !== levels.length) critical.push("levels.json — zduplikowane order");
for (const l of levels) {
  if (!l.groups || l.groups.length === 0) critical.push(`levels.json — "${l.id}" bez grup wymagań`);
  const items = l.groups.flatMap((g) => g.items ?? []);
  if (items.some((it) => typeof it !== "string" || !it.trim()))
    critical.push(`levels.json — "${l.id}" ma pusty element wymagania`);
  if (uniq(items) !== items.length) critical.push(`levels.json — "${l.id}" ma zduplikowane wymaganie`);
}

const kyuLevels = levels.filter((l) => /^\d+$/.test(l.id));
const allItems = levels.flatMap((l) => l.groups.flatMap((g) => g.items.map((item) => ({ level: l, item }))));

const coverage = kyuLevels.map((l) => {
  const items = l.groups.flatMap((g) => g.items);
  const linked = items.filter(hasMatch);
  const techCount = techs.filter((t) => t.levels.includes(Number(l.id))).length;
  return { kyu: l.kyu, id: l.id, techCount, items: items.length, linked: linked.length };
});

const mismatches = [];
for (const { level, item } of allItems) {
  for (const t of findMatches(item)) {
    if (!t.levels.includes(Number(level.id)))
      mismatches.push({ kyu: level.kyu, item, tech: t.name, levels: [...t.levels].sort((a, b) => b - a).join(", ") });
  }
}
for (const m of mismatches)
  warn.push(`MISMATCH — "${m.tech}" (levels=[${m.levels}]) linkowane w wymaganiach ${m.kyu}`);

const linkedItems = allItems.filter(({ item }) => hasMatch(item));
const unlinked = allItems.filter(({ item }) => !hasMatch(item));

const classify = (item) => {
  if (/Saiha|Seienchin|Ushiro-mawashi/i.test(item)) return "brak w atlasie → P1.6";
  if (/\b(rei|osu|sei[zs]a|mokuso|bunkai|kamae)\b/i.test(item)) return "hasło słownika → P1.7";
  if (/ukłon|pozdraw|etykiet|instruktor|test|pomp|rozgrzew|teori|staż|stopniow|formułk|wiedz|kryteri|egzaminator|dojo|kun/i.test(item))
    return "nietechniczne (nie wymaga linku)";
  return "opisowe/zbiorcze (patrz P0.3/P1.7)";
};

const unlinkedGroups = new Map();
for (const { level, item } of unlinked) {
  const g = classify(item);
  if (!unlinkedGroups.has(g)) unlinkedGroups.set(g, []);
  unlinkedGroups.get(g).push(`${level.kyu}: ${item}`);
}

const matchedTechs = new Set(linkedItems.flatMap(({ item }) => findMatches(item).map((t) => t.id)));
const allAliases = techs.flatMap((t) => t.aliases ?? []);
const usedAliasKeys = new Set(linkedItems.flatMap(({ item }) => resolvedParts(item).map(normalizeAlias)));
const usedAliases = new Set(allAliases.filter((a) => usedAliasKeys.has(normalizeAlias(a))));

const images = techs.filter((t) => t.image);
const uniqueImages = uniq(images.map((t) => t.image));
const unsplash = images.filter((t) => t.image.includes("images.unsplash.com"));
const videos = techs.filter((t) => t.video);

const dt = new Date().toISOString().slice(0, 10);
const lines = [];
const p = (...s) => lines.push(...s);

p(
  "# RAPORT.md — audyt danych KIHON",
  "",
  `> Generowany przez \`node scripts/audit-danych.mjs\` — nie edytuj ręcznie (data: ${dt}).`,
  "> Dane wejściowe: `src/data/techniques.json`, `levels.json`, `glossary.json`,",
  "> `src/data/index.ts` (CATEGORIES, normalizacja aliasów), `TechniqueIllustration.tsx` (DRAWINGS).",
  "",
  "## 1. Integralność struktury",
  "",
  critical.length
    ? `Krytyczne problemy: **${critical.length}**\n\n${critical.map((c) => `- ❌ ${c}`).join("\n")}`
    : "Krytycznych problemów: **0** ✅ (id unikalne, obowiązkowe pola, kategorie ↔ `CATEGORIES`, `levels`∈1–10, `infographic` ↔ `DRAWINGS`, słownik bez martwych `related`, `levels.json` bez duplikatów/pustych pozycji).",
  "",
  `Ostrzeżenia (do zadań P0.3 / P0.4): **${warn.length}**`,
  "",
  "## 2. Pokrycie stopni",
  "",
  "| Stopień | Techniki (`levels[]`) | Pozycje wymagań | Linkowane |",
  "|---|---:|---:|---:|",
  ...coverage.map((c) => `| ${c.kyu} (${c.id}) | ${c.techCount} | ${c.items} | ${c.linked} |`),
  `| bez stopnia (start) | 0 | ${levels.find((l) => l.id === "start").groups.flatMap((g) => g.items).length} | ${levels.find((l) => l.id === "start").groups.flatMap((g) => g.items).filter(hasMatch).length} |`,
  `| ${levels.find((l) => l.id === "dan").kyu} | 0 | ${levels.find((l) => l.id === "dan").groups.flatMap((g) => g.items).length} | ${levels.find((l) => l.id === "dan").groups.flatMap((g) => g.items).filter(hasMatch).length} |`,
  "",
  "Start i dan celowo nie mają technik w atlasie (`levels[]` ∈ 1–10).",
  "",
  "## 3. Techniki ↔ stopnie (mismatchy)",
  "",
  ...(mismatches.length
    ? [
        `**${mismatches.length} mismatchów** — technika linkowana w wymaganiach stopnia, którego nie ma w jej \`levels[]\` (audyt trafień = ta sama logika co \`RequirementsPanel\`):`,
        "",
        "| Wymagania | Technika | \`levels[]\` |",
        "|---|---|---|",
        ...mismatches.map((m) => `| ${m.kyu} — ${m.item} | ${m.tech} | [${m.levels}] |`),
        "",
        "Zadanie: **P0.3** w `TODO.md` (dopisać stopnie albo udokumentować semantykę).",
      ]
    : ["Brak mismatchów ✅"]),
  "",
  "## 4. Kolizje aliasów",
  "",
  collisions.length
    ? `${collisions.map(([alias, ids]) => `- ⚠️ „${alias}" → ${ids.length} technik: ${ids.join(", ")}`).join("\n")}\n\nZadanie: **P0.4** w \`TODO.md\`.`
    : "Brak kolizji ✅",
  "",
  "## 5. Linkowanie wymagań",
  "",
  `**${linkedItems.length} / ${allItems.length}** pozycji wymagań linkuje do techniki.`,
  "",
  `Nielinkowane (${unlinked.length}) wg powodu:`,
  "",
  ...[...unlinkedGroups.entries()].flatMap(([g, list]) => [`- **${g}** (${list.length}):`, ...list.map((i) => `  - ${i}`)]),
  "",
  "## 6. Media i zdjęcia",
  "",
  `- techniki z \`image\`: ${images.length}/${techs.length} (unikalnych URL-i: ${uniqueImages}, w tym Unsplash: ${unsplash.length}) → zadanie **P1.5**`,
  `- techniki z \`video\`: ${videos.length}/${techs.length}${videos.length ? ` (${videos.map((v) => `${v.name}: ${v.video}`).join("; ")})` : " (pole zawsze `null` — miejsce na przyszłe filmiki)"}`,
  "",
  "## 7. Statystyki technik i aliasów",
  "",
  `- technik łącznie: **${techs.length}**`,
  `- technik linkowanych z wymagań: **${matchedTechs.size}**`,
  `- aliasów łącznie: **${allAliases.length}** (użytych w wymaganiach: ${usedAliases.size}, nieużywanych: ${allAliases.length - usedAliases.size})`,
  `- haseł słownika: **${glossEntries.length}** w ${glossary.categories.length} kategoriach (${glossary.categories.map((c) => `${c.name}: ${c.entries.length}`).join(", ")})`,
  "",
  "## 8. Rekomendacje",
  "",
  "1. **P0.3** — domknąć spójność `levels[]` ↔ wymagania (sekcja 3).",
  "2. **P0.4** — rozdzielić alias „Kumite turniejowe\" (sekcja 4).",
  "3. **P1.6** — dopisać Saiha / Seienchin / Ushiro-mawashi-geri (sekcja 5, grupa „brak w atlasie\").",
  "4. **P1.7** — hasła Rei/Osu/Bunkai/Kamae + linkowanie wymagań do słownika (sekcja 5).",
  "5. **P1.5** — zdjęcia self-hosted zamiast Unsplash (sekcja 6).",
  "",
);

write("RAPORT.md", lines.join("\n"));

console.log(`RAPORT.md zapisany (${dt})`);
console.log(`  krytyczne: ${critical.length}`);
console.log(`  ostrzeżenia: ${warn.length} (${mismatches.length} MISMATCH, ${collisions.length} KOLIZJA)`);
console.log(`  pokrycie wymagań: ${linkedItems.length}/${allItems.length}`);
if (critical.length) {
  for (const c of critical) console.error(`  ✗ ${c}`);
  process.exit(1);
}
