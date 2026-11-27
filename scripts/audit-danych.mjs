import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CONTENT,
  buildCatalog,
  buildMediaItems,
  catalogKeys,
  readBaseUrl,
  readContent,
  readJson,
} from "./catalog.mjs";

/** Audyt czyta kanoniczne źródła i sprawdza, czy wygenerowane widoki są z nimi zgodne. */
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(join(root, path), "utf8");
const KNOWLEDGE = "src/data/knowledge";
const CATEGORY_ORDER = [
  "strefy", "czesci-ciala", "pozycje", "ustawienia-dloni",
  "ustawienia-stopy", "dojo-etykieta", "trening-komendy", "stroj-sprzet",
];
const heroImage = "public/images/hero/osu-no-seishin.jpg";
const critical = [];
const warn = [];

const content = readContent(root);
const catalog = buildCatalog(content);
const baseUrl = readBaseUrl(root);
const mediaByTechnique = buildMediaItems(catalog, baseUrl);
const { desiredKeys } = catalogKeys(catalog);
const techs = content.techniques.map(({ index }) => index);
const techniqueIds = content.order;

const sourceCategories = [
  ...readJson(root, `${KNOWLEDGE}/glossary.json`).categories,
  ...["stances", "hand-positions", "foot-positions"].map((name) => readJson(root, `${KNOWLEDGE}/${name}.json`)),
];
const categories = CATEGORY_ORDER.map((id) => {
  const category = sourceCategories.find((item) => item.id === id);
  if (!category) throw new Error(`Brak kategorii ${id} w ${KNOWLEDGE}/`);
  return category;
});
if (categories.length !== sourceCategories.length) throw new Error("Nieznana kategoria w src/data/knowledge/");
const glossaryEntries = categories.flatMap((category) => category.entries);
const glossaryIds = new Set(glossaryEntries.map((entry) => entry.id));
const stances = categories.find((category) => category.id === "pozycje");

const stripKnowledge = ({ knowledge: _knowledge, ...entry }) => entry;
const knowledgeOf = (entry) => entry?.knowledge ?? null;
const nonEmpty = (value) => typeof value === "string" && value.trim().length > 0;
const categoriesFromTs = [...read("src/data/index.ts").match(/export const CATEGORIES = \[(.*?)\]/s)[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const levels = readJson(root, "src/data/levels.json");
const learning = readJson(root, "src/data/learning.json");
const atlas = readJson(root, "src/data/atlas.json");

// --- 1. Karta i wiedza techniki ---------------------------------------------

if (new Set(techniqueIds).size !== techniqueIds.length) critical.push("index.json — powtórzone ID technik");
for (const technique of techs) {
  if (!technique.id || !technique.name || !technique.description)
    critical.push(`src/content/techniques/${technique.id}: brak id/name/description`);
  if (!Array.isArray(technique.levels) || !technique.levels.length)
    critical.push(`${technique.id}: puste levels[]`);
  else if (technique.levels.some((n) => !Number.isInteger(n) || n < 0 || n > 15))
    critical.push(`${technique.id}: levels poza zakresem 0–15`);
  if (!categoriesFromTs.includes(technique.category)) critical.push(`${technique.id}: kategoria spoza CATEGORIES`);
  for (const field of ["image", "video", "media", "detail"])
    if (field in technique) critical.push(`${technique.id}: martwe pole "${field}" w index.json`);

  const knowledge = knowledgeOf(technique);
  if (!knowledge) { critical.push(`${technique.id}: brak knowledge`); continue; }
  if (!nonEmpty(knowledge.translation)) critical.push(`${technique.id}: brak polskiego znaczenia`);
  if (!Array.isArray(knowledge.nameParts) || !knowledge.nameParts.length ||
      knowledge.nameParts.some((part) => !nonEmpty(part.term) || !nonEmpty(part.polish)))
    critical.push(`${technique.id}: niepełne człony nazwy`);
  if (!Array.isArray(knowledge.sections) || knowledge.sections.length < 2 ||
      knowledge.sections.some((section) => !nonEmpty(section.title) || !nonEmpty(section.body)))
    critical.push(`${technique.id}: wymagane dwie pełne sekcje opisu`);
}

// --- 2. Filmy z details.json ------------------------------------------------

const ONE_VIDEO = new Set(["seiken-shita-tsuki", "yoko-keage", "kake-wake-uke"]);
for (const [id, group] of Object.entries(catalog)) {
  const items = group.items;
  if (!items.length) continue; // technika bez nagrania dostaje placeholder z kanji
  if (items.length < 2 && !ONE_VIDEO.has(id)) warn.push(`${id}: galeria ma ${items.length} film (oczekiwano ≥2)`);
  for (const [index, item] of items.entries()) {
    const label = `${id}/details.json[${index}]`;
    if (!/^videos\/[^/]+\/video\/[^/]+\.mp4$/.test(item.source)) critical.push(`${label}: nieprawidłowe source`);
    if (!nonEmpty(item.label) || !nonEmpty(item.alt)) critical.push(`${label}: brak label lub alt`);
    if (item.caption !== undefined && !nonEmpty(item.caption)) warn.push(`${label}: pusty caption`);
    if (!new RegExp(`^${id}/video/.+\\.mp4$`).test(item.key)) critical.push(`${label}: klucz poza ID techniki`);
    if (!new RegExp(`^${id}/poster/.+\\.jpg$`).test(item.posterKey)) critical.push(`${label}: poster poza ID techniki`);
    if (basename(item.source, ".mp4") !== basename(item.key, ".mp4"))
      critical.push(`${label}: stem źródła i klucza różnią się`);
  }
}
if (desiredKeys.size < 100) critical.push("Katalog wygenerowany z details.json jest niekompletny");
if (new Set(desiredKeys).size !== desiredKeys.size) critical.push("Powtórzone klucze R2 w details.json");
for (const item of Object.values(mediaByTechnique).flat()) {
  if (!item.src.startsWith(baseUrl) || !item.poster?.startsWith(baseUrl))
    critical.push(`Media poza ${baseUrl}: ${item.src}`);
}

// --- 3. Słownik -------------------------------------------------------------

if (new Set(glossaryEntries.map((entry) => entry.id)).size !== glossaryIds.size)
  critical.push("glossary — powtórzone ID haseł");
const techIds = new Set(techniqueIds);
for (const entry of glossaryEntries) {
  if (!nonEmpty(entry.term)) critical.push(`glossary/${entry.id}: pusty term`);
  for (const related of entry.related ?? [])
    if (!techIds.has(related) && !glossaryIds.has(related)) critical.push(`glossary/${entry.id}: martwy related "${related}"`);
  if (entry.image) {
    if (/^https?:\/\//i.test(entry.image) && !/^https:\/\//i.test(entry.image))
      critical.push(`glossary/${entry.id}: obraz HTTP`);
    else if (!/^https?:\/\//i.test(entry.image) && !entry.image.startsWith("/"))
      critical.push(`glossary/${entry.id}: ścieżka obrazu bez "/"`);
    else if (entry.image.startsWith("/") && !existsSync(join(root, "public", entry.image.slice(1))))
      critical.push(`glossary/${entry.id}: brak pliku ${entry.image}`);
  }
  if (stances.entries.includes(entry)) {
    const knowledge = knowledgeOf(entry);
    if (!knowledge?.translation || knowledge.sections?.length < 2)
      critical.push(`glossary/${entry.id}: brak pełnej wiedzy`);
  }
}
for (const category of categories)
  if (category.sources !== undefined && (!Array.isArray(category.sources) || category.sources.some((source) => !nonEmpty(source.title) || !/^https:/.test(source.url))))
    critical.push(`glossary/${category.id}: nieprawidłowe źródła`);

// --- 4. Wygenerowane widoki -------------------------------------------------

const generatedAtlas = {
  techniques: techs.map((technique) => {
    const items = mediaByTechnique[technique.id] ?? [];
    return {
      ...stripKnowledge(technique),
      thumbnail: items.find((item) => item.type === "image")?.src ?? items[0]?.poster ?? null,
      firstIsVideo: items[0]?.type === "video",
    };
  }),
  glossary: { categories: categories.map((category) => ({ ...category, entries: category.entries.map(stripKnowledge) })) },
};
if (JSON.stringify(atlas) !== JSON.stringify(generatedAtlas))
  critical.push("src/data/atlas.json nie zgadza się z kanonicznymi źródłami (npm run data:build)");

for (const { id, index } of content.techniques) {
  const path = `public/data/techniques/${id}.json`;
  if (!existsSync(join(root, path))) { critical.push(`Brak ${path}`); continue; }
  const expected = { ...index, media: mediaByTechnique[id] ?? [] };
  if (JSON.stringify(readJson(root, path)) !== JSON.stringify(expected))
    critical.push(`${path} nie zgadza się z folderem techniki`);
}
for (const entry of glossaryEntries) {
  const path = `public/data/glossary/${entry.id}.json`;
  if (!existsSync(join(root, path))) { critical.push(`Brak ${path}`); continue; }
  if (JSON.stringify(readJson(root, path)) !== JSON.stringify({ media: [], knowledge: knowledgeOf(entry) }))
    critical.push(`${path} nie zgadza się z src/data/knowledge/`);
}
for (const section of ["techniques", "glossary"]) {
  const folder = join(root, "public/data", section);
  const expected = section === "techniques" ? new Set(techniqueIds) : glossaryIds;
  if (!existsSync(folder)) { critical.push(`Brak public/data/${section}`); continue; }
  for (const file of readdirSync(folder)) {
    if (!file.endsWith(".json") || !expected.has(basename(file, ".json")))
      critical.push(`Osierocony plik public/data/${section}/${file}`);
  }
}

// --- 5. Wymagania stopni, nauka i statyka ----------------------------------

const techById = new Map(techs.map((technique) => [technique.id, technique]));
const levelByNumber = new Map(levels.map((level) => [level.number, level]));
for (const level of levels) {
  if (!level.groups?.length) critical.push(`levels.json/${level.id}: brak grup`);
  if (level.fights !== null && (!Number.isInteger(level.fights) || level.fights < 0))
    critical.push(`levels.json/${level.id}: nieprawidłowe fights`);
  const expected = level.stripe === null ? 0 : level.belt === "black" ? level.number - 10 : 1;
  if ((level.stripes ?? (level.stripe ? 1 : 0)) !== expected) critical.push(`levels.json/${level.id}: niezgodne belki`);
  const seen = new Set();
  for (const group of level.groups ?? []) {
    if (!group.title) critical.push(`levels.json/${level.id}: grupa bez tytułu`);
    for (const item of group.items ?? []) {
      let key;
      if (item.type === "technique") {
        if (!techById.has(item.id)) critical.push(`levels.json/${level.id}: nieistniejąca technika "${item.id}"`);
        else if (!techById.get(item.id).levels.includes(level.number))
          critical.push(`levels.json/${level.id}: "${item.id}" ma levels=[${techById.get(item.id).levels}]`);
        key = `t:${item.id}`;
      } else if (item.type === "glossary") {
        if (!glossaryIds.has(item.id)) critical.push(`levels.json/${level.id}: nieistniejące hasło "${item.id}"`);
        key = `g:${item.id}`;
      } else if (item.type === "text" && nonEmpty(item.text)) key = `x:${item.text}`;
      else critical.push(`levels.json/${level.id}: nieprawidłowy element ${JSON.stringify(item)}`);
      if (key) {
        if (seen.has(key)) critical.push(`levels.json/${level.id}: zduplikowane wymaganie ${key}`);
        seen.add(key);
      }
    }
  }
}
for (const technique of techs)
  for (const number of technique.levels) {
    const level = levelByNumber.get(number);
    if (!level) continue;
    const refs = level.groups.flatMap((group) => group.items).filter((item) => item.type === "technique").map((item) => item.id);
    if (!refs.includes(technique.id)) warn.push(`Technika ${technique.id} poza wymaganiami stopnia ${level.kyu}`);
  }

const fold = (value) => value.toLowerCase().replace(/[āīūōē]/g, (c) => ({ "ā": "a", "ī": "i", "ū": "u", "ō": "o", "ē": "e" })[c]).replace(/[\s\u2014-]+/g, "-").replace(/^-+|-+$/g, "");
const aliases = new Map();
for (const technique of techs)
  for (const alias of technique.aliases ?? []) {
    const key = fold(alias);
    if (!aliases.has(key)) aliases.set(key, new Set());
    aliases.get(key).add(technique.id);
  }
const collisions = [...aliases].filter(([, ids]) => ids.size > 1);
for (const [alias, ids] of collisions) warn.push(`KOLIZJA aliasu "${alias}": ${[...ids].join(", ")}`);

const validSources = (sources) => Array.isArray(sources) && sources.length > 0 && sources.every((source) => nonEmpty(source.title) && /^https:/.test(source.url));
for (const [kind, entries] of [["guides", learning.guides], ["timeline", learning.timeline], ["facts", learning.facts]]) {
  if (!Array.isArray(entries) || !entries.length) critical.push(`learning.json: puste ${kind}`);
  else for (const entry of entries) {
    if (!nonEmpty(entry.id) || !nonEmpty(entry.title) || !validSources(entry.sources)) critical.push(`learning.json/${kind}/${entry.id}: niepełne dane`);
  }
}
const srcFiles = (dir = "src") => readdirSync(join(root, dir), { withFileTypes: true }).flatMap((entry) =>
  entry.isDirectory() ? srcFiles(join(dir, entry.name)) : [join(dir, entry.name)]);
const unsplash = srcFiles().filter((path) => /images\.unsplash\.com/i.test(read(path)));
if (unsplash.length) critical.push(`src/: zewnętrzne obrazy Unsplash: ${unsplash.join(", ")}`);
if (!existsSync(join(root, heroImage))) critical.push(`Brak ${heroImage}`);
if (!read("src/features/home/components/Hero.tsx").includes("images/hero/osu-no-seishin.jpg"))
  critical.push("Hero.tsx: brak lokalnej ścieżki zdjęcia");

// --- Raport -----------------------------------------------------------------

const dt = new Date().toISOString().slice(0, 10);
const lines = [
  "# RAPORT.md — audyt danych KIHON",
  "",
  `> Generowany przez \`npm run audit\` (${dt}). Nie edytuj ręcznie.`,
  "> Źródła: `src/content/techniques/<id>/{index,details}.json`, `src/data/knowledge/`, `src/data/levels.json`, `src/data/learning.json`.",
  "> Widoki generowane: `src/data/atlas.json`, `public/data/{techniques,glossary}/<id>.json`.",
  "",
  `Krytyczne: **${critical.length}** · ostrzeżenia: **${warn.length}**`,
  "",
  `- technik: **${techs.length}** (folderów: ${techniqueIds.length}), filmów: **${desiredKeys.size / 2}**, kluczy R2: **${desiredKeys.size}**`,
  `- haseł słownika: **${glossaryEntries.length}** w **${categories.length}** kategoriach`,
  `- stopni: **${levels.length}**, dane na żądanie: **${content.techniques.length + glossaryEntries.length}** plików`,
  `- kolizje aliasów: **${collisions.length}**, techniki poza wymaganiami: **${warn.filter((w) => w.startsWith("Technika")).length}**`,
  "",
];
if (critical.length) lines.push("## Krytyczne", "", ...critical.map((item) => `- ❌ ${item}`), "");
if (warn.length) lines.push("## Ostrzeżenia", "", ...warn.map((item) => `- ⚠️ ${item}`), "");
writeFileSync(join(root, "RAPORT.md"), lines.join("\n"));

console.log(`RAPORT.md zapisany (${dt}) — krytyczne: ${critical.length}, ostrzeżenia: ${warn.length}`);
for (const item of warn) console.log("  ! " + item);
for (const item of critical) console.error("  ✗ " + item);
if (critical.length) process.exit(1);
