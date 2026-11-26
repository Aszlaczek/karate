import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (path) => JSON.parse(readFileSync(join(root, path), "utf8"));

const writeJson = (path, value) => {
  const absolute = join(root, path);
  mkdirSync(dirname(absolute), { recursive: true });
  writeFileSync(absolute, JSON.stringify(value, null, 2) + "\n");
};

const techniques = readJson("src/data/techniques.json");
const glossary = readJson("src/data/glossary.json");
const details = readJson("src/data/techniqueDetails.json");
const media = readJson("src/data/media.json");
const entries = glossary.categories.flatMap((category) => category.entries);

/** Ta sama reguła co getMediaThumbnail() — pierwszy obraz albo poster pierwszego filmu. */
const cardInfo = (items = []) => {
  const firstIsVideo = items[0]?.type === "video";
  for (const item of items) {
    if (item.type === "image") return { thumbnail: item.src, firstIsVideo };
    if (item.poster) return { thumbnail: item.poster, firstIsVideo };
  }
  return { thumbnail: null, firstIsVideo };
};

// Lekki indeks dla kart — wchodzi do głównego bundle'u.
const thumbnails = { techniques: {}, glossary: {} };
for (const technique of techniques) {
  thumbnails.techniques[technique.id] = cardInfo(media.techniques[technique.id] ?? []);
}
for (const entry of entries) {
  thumbnails.glossary[entry.id] = cardInfo(media.glossary[entry.id] ?? []);
}
writeJson("src/data/media-thumbnails.json", thumbnails);

// Pełne dane jednego wpisu — pobierane dopiero po kliknięciu.
const dataDir = "public/data";
rmSync(join(root, dataDir), { recursive: true, force: true });
for (const technique of techniques) {
  writeJson(`${dataDir}/techniques/${technique.id}.json`, {
    media: media.techniques[technique.id] ?? [],
    detail: details.techniques[technique.id] ?? null,
  });
}
for (const entry of entries) {
  writeJson(`${dataDir}/glossary/${entry.id}.json`, {
    media: media.glossary[entry.id] ?? [],
    detail: details.stances[entry.id] ?? null,
  });
}

console.log(
  `Dane na żądanie: ${techniques.length} technik + ${entries.length} haseł ` +
    `oraz indeks miniaturek (${Object.keys(thumbnails.techniques).length} + ${Object.keys(thumbnails.glossary).length}).`,
);
