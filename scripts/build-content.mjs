import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildCatalog, buildMediaItems, readBaseUrl, readContent, readJson, CONTENT } from "./catalog.mjs";

/** Jeden build z kanonicznych folderów: lekki indeks + jeden chunk na wpis. */
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const writeJson = (path, value) => {
  const absolute = join(root, path);
  mkdirSync(dirname(absolute), { recursive: true });
  writeFileSync(absolute, JSON.stringify(value, null, 2) + "\n");
};

const content = readContent(root);
const catalog = buildCatalog(content);
const baseUrl = readBaseUrl(root);
const mediaByTechnique = buildMediaItems(catalog, baseUrl);

const knowledgeDir = "src/data/knowledge";
const CATEGORY_ORDER = [
  "strefy", "czesci-ciala", "pozycje", "ustawienia-dloni",
  "ustawienia-stopy", "dojo-etykieta", "trening-komendy", "stroj-sprzet",
];
const sources = [
  ...readJson(root, `${knowledgeDir}/glossary.json`).categories,
  ...["stances", "hand-positions", "foot-positions"].map((name) => readJson(root, `${knowledgeDir}/${name}.json`)),
];
const categories = CATEGORY_ORDER.map((id) => {
  const category = sources.find((item) => item.id === id);
  if (!category) throw new Error(`Brak kategorii ${id} w ${knowledgeDir}/`);
  return category;
});
if (categories.length !== sources.length) throw new Error("Nieznana kategoria w src/data/knowledge/");
const glossaryEntries = categories.flatMap((category) => category.entries);
if (new Set(glossaryEntries.map((entry) => entry.id)).size !== glossaryEntries.length) {
  throw new Error("Powtórzone ID w słowniku");
}

const thumbnail = (items) => {
  for (const item of items ?? []) if (item.poster) return item.poster;
  return null;
};

// Lekki indeks do głównego bundle'u — bez wiedzy i bez URL-i filmów.
const atlas = {
  techniques: content.techniques.map(({ id, index }) => {
    const { knowledge: _knowledge, ...card } = index;
    const items = mediaByTechnique[id] ?? [];
    return {
      ...card,
      thumbnail: thumbnail(items),
      firstIsVideo: items[0]?.type === "video",
    };
  }),
  glossary: {
    categories: categories.map((category) => ({
      ...category,
      entries: category.entries.map(({ knowledge: _knowledge, ...entry }) => entry),
    })),
  },
};
writeJson("src/data/atlas.json", atlas);

// Jeden plik pobierany po otwarciu techniki: karta, wiedza i media razem.
const dataDir = "public/data";
rmSync(join(root, dataDir), { recursive: true, force: true });
for (const { id, index } of content.techniques) {
  writeJson(`${dataDir}/techniques/${id}.json`, {
    ...index,
    media: mediaByTechnique[id] ?? [],
  });
}
const knowledgeByEntry = new Map(glossaryEntries.map((entry) => [entry.id, entry.knowledge ?? null]));
for (const entry of glossaryEntries) {
  writeJson(`${dataDir}/glossary/${entry.id}.json`, {
    media: [],
    knowledge: knowledgeByEntry.get(entry.id),
  });
}

const folders = readdirSync(join(root, CONTENT), { withFileTypes: true }).filter((item) => item.isDirectory()).length;
console.log(
  `Wiedza: ${content.techniques.length} technik (${folders} folderów) i ${glossaryEntries.length} haseł ` +
    `(${categories.length} kategorii) — źródło: src/content/techniques/ i src/data/knowledge/.`,
);
console.log(
  `Dane na żądanie: ${content.techniques.length} chunków technik i ${glossaryEntries.length} chunków słownika ` +
    `oraz lekki indeks src/data/atlas.json (${Object.keys(mediaByTechnique).length} galerii).`,
);
