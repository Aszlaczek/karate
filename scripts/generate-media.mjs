import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mediaPath = "src/data/media.json";
const glossary = JSON.parse(readFileSync(join(root, "src/data/glossary.json"), "utf8"));
const previous = existsSync(join(root, mediaPath))
  ? JSON.parse(readFileSync(join(root, mediaPath), "utf8"))
  : { techniques: {}, glossary: {} };

const entries = glossary.categories.flatMap((category) =>
  category.entries.map((entry) => ({ id: entry.id, reading: entry.reading, stance: category.id === "pozycje" })),
);

const normalize = (value) => value
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[āīūōē]/g, (char) => ({ ā: "a", ī: "i", ū: "u", ō: "o", ē: "e" })[char])
  .toLowerCase();

const filesIn = (relative) => {
  const absolute = join(root, "public", relative);
  if (!existsSync(absolute)) return [];
  return readdirSync(absolute, { withFileTypes: true })
    .filter((item) => item.isFile() && !item.name.startsWith("."))
    .map((item) => item.name)
    .sort();
};

const dirsIn = (relative) => {
  const absolute = join(root, "public", relative);
  if (!existsSync(absolute)) return [];
  return readdirSync(absolute, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name)
    .sort();
};

const bySrc = new Map(
  Object.values(previous).flatMap((group) => Object.values(group ?? {}).flat()).map((item) => [item.src, item]),
);
const labelFrom = (stem) => stem.replace(/[-_]+/g, " ").replace(/^./, (char) => char.toUpperCase());
const isVideo = (name) => /\.(mp4|webm|mov)$/i.test(name);
const isImage = (name) => /\.(jpe?g|png|webp|gif|svg)$/i.test(name);
const stemOf = (name) => name.replace(extname(name), "");
const isPosterFor = (image, videos) => videos.some((video) => stemOf(video) === stemOf(image));

const makeItem = (src, fallbackPoster) => {
  const saved = bySrc.get(src);
  const item = {
    type: saved?.type ?? (isVideo(src) ? "video" : "image"),
    src,
    label: saved?.label ?? labelFrom(stemOf(src.split("/").pop())),
  };
  const poster = saved?.poster ?? (item.type === "video" ? fallbackPoster : undefined);
  if (poster) item.poster = poster;
  if (saved?.alt) item.alt = saved.alt;
  if (saved?.caption) item.caption = saved.caption;
  return item;
};

const matchEntry = (stem, stance) => entries
  .filter((entry) => entry.stance === stance && normalize(stem).startsWith(normalize(entry.reading)))
  .sort((a, b) => b.reading.length - a.reading.length)[0];

const manifest = { techniques: {}, glossary: {} };

// Techniki: jeden folder na id, filmy i zdjęcia razem.
for (const id of dirsIn("videos/techniques")) {
  const videos = filesIn(`videos/techniques/${id}`).filter(isVideo);
  const images = filesIn(`images/techniques/${id}`).filter(isImage);
  const items = [
    ...videos.map((name) => {
      const poster = images.find((image) => stemOf(image) === stemOf(name));
      return makeItem(`/videos/techniques/${id}/${name}`, poster ? `/images/techniques/${id}/${poster}` : undefined);
    }),
    ...images.filter((name) => !isPosterFor(name, videos)).map((name) => makeItem(`/images/techniques/${id}/${name}`)),
  ];
  if (items.length) manifest.techniques[id] = items;
}

// Postawy: płaskie pliki w videos/stances i images/stances.
const stanceVideos = filesIn("videos/stances").filter(isVideo);
const stanceSources = [
  { folder: "videos/stances", prefix: "/videos/stances/" },
  { folder: "images/stances", prefix: "/images/stances/" },
];
for (const { folder, prefix } of stanceSources) {
  for (const name of filesIn(folder).filter(
    (file) => (isVideo(file) || isImage(file)) && !(isImage(file) && isPosterFor(file, stanceVideos)),
  )) {
    const match = matchEntry(stemOf(name), true);
    if (!match) {
      console.warn(`  pominięto (brak postawy dla pliku): ${name}`);
      continue;
    }
    const src = prefix + name;
    const poster = isVideo(name)
      ? filesIn("images/stances").find((image) => stemOf(image) === stemOf(name))
      : undefined;
    const items = (manifest.glossary[match.id] ??= []);
    if (!items.some((item) => item.src === src)) {
      items.push(makeItem(src, poster ? `/images/stances/${poster}` : undefined));
    }
  }
}

// Pozostałe hasła słownika (dłonie, stopy): płaskie pliki w videos/glossary i images/glossary.
const glossaryVideos = filesIn("videos/glossary").filter(isVideo);
const glossarySources = [
  { folder: "videos/glossary", prefix: "/videos/glossary/" },
  { folder: "images/glossary", prefix: "/images/glossary/" },
];
for (const { folder, prefix } of glossarySources) {
  for (const name of filesIn(folder).filter(
    (file) => (isVideo(file) || isImage(file)) && !(isImage(file) && isPosterFor(file, glossaryVideos)),
  )) {
    const match = matchEntry(stemOf(name), false);
    if (!match) {
      console.warn(`  pominięto (brak hasła dla pliku): ${name}`);
      continue;
    }
    const src = prefix + name;
    const poster = isVideo(name)
      ? filesIn("images/glossary").find((image) => stemOf(image) === stemOf(name))
      : undefined;
    const items = (manifest.glossary[match.id] ??= []);
    if (!items.some((item) => item.src === src)) {
      items.push(makeItem(src, poster ? `/images/glossary/${poster}` : undefined));
    }
  }
}

const byTypeThenSrc = (a, b) =>
  a.type === b.type ? a.src.localeCompare(b.src) : a.type === "video" ? -1 : 1;
for (const group of Object.values(manifest.glossary)) group.sort(byTypeThenSrc);

writeFileSync(join(root, mediaPath), JSON.stringify(manifest, null, 2) + "\n");
console.log("media.json zaktualizowany (" + mediaPath + ")");
console.log("  techniki: " + Object.keys(manifest.techniques).length);
console.log("  hasła słownika: " + Object.keys(manifest.glossary).length);
console.log("  Uwaga: nowe pozycje dostają opis z nazwy pliku — dopisz własny label i alt.");
