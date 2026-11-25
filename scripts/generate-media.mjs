import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadMediaEnv } from "./media-env.mjs";

loadMediaEnv();

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mediaPath = "src/data/media.json";
const sourcePath = "media-build/manifest-source.json";
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

const previousItems = Object.values(previous).flatMap((group) => Object.values(group ?? {}).flat());
const bySrc = new Map(previousItems.map((item) => [item.src, item]));
const byStem = new Map(
  previousItems.map((item) => [item.src.split("/").pop().replace(/\.[^.]+$/, ""), item]),
);
const labelFrom = (stem) => stem.replace(/[-_]+/g, " ").replace(/^./, (char) => char.toUpperCase());
const isVideo = (name) => /\.(mp4|webm|mov)$/i.test(name);
const isImage = (name) => /\.(jpe?g|png|webp|gif|svg)$/i.test(name);
const stemOf = (name) => name.replace(extname(name), "");
const isPosterFor = (image, videos) => videos.some((video) => stemOf(video) === stemOf(image));

const matchEntry = (stem, stance) => entries
  .filter((entry) => entry.stance === stance && normalize(stem).startsWith(normalize(entry.reading)))
  .sort((a, b) => b.reading.length - a.reading.length)[0];

const withSaved = (item, saved) => {
  const result = { ...item };
  if (saved?.label) result.label = saved.label;
  if (saved?.alt) result.alt = saved.alt;
  if (saved?.caption) result.caption = saved.caption;
  if (saved?.poster) result.poster = saved.poster;
  return result;
};

const write = (manifest, mode) => {
  writeFileSync(join(root, mediaPath), JSON.stringify(manifest, null, 2) + "\n");
  console.log(`media.json zaktualizowany (${mediaPath}) — tryb ${mode}`);
  console.log(`  techniki: ${Object.keys(manifest.techniques).length}`);
  console.log(`  hasła słownika: ${Object.keys(manifest.glossary).length}`);
};

// --- Tryb R2: media-build/manifest-source.json + R2_PUBLIC_BASE_URL --------
const baseUrl = process.env.R2_PUBLIC_BASE_URL;
if (baseUrl && existsSync(join(root, sourcePath))) {
  const source = JSON.parse(readFileSync(join(root, sourcePath), "utf8"));
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const manifest = { techniques: {}, glossary: {} };
  for (const [id, group] of Object.entries(source)) {
    const section = group.section === "techniques" ? "techniques" : "glossary";
    manifest[section][id] = group.items.map((item) => {
      const src = `${base}${item.key}`;
      const saved = bySrc.get(src) ?? byStem.get(stemOf(item.key.split("/").pop()));
      // Opisy ręczne mają pierwszeństwo, ale poster zawsze wskazuje na nowy plik na R2.
      const result = withSaved(
        {
          type: item.type,
          src,
          label: item.label,
          ...(item.alt ? { alt: item.alt } : {}),
        },
        saved,
      );
      if (item.posterKey) result.poster = `${base}${item.posterKey}`;
      else delete result.poster;
      return result;
    });
  }
  write(manifest, "R2");
  process.exit(0);
}

if (baseUrl) {
  console.error("R2_PUBLIC_BASE_URL jest ustawiony, ale brak media-build/manifest-source.json.");
  console.error("Uruchom najpierw: npm run media:prepare");
  process.exit(1);
}

// --- Tryb lokalny (zgodny z poprzednim układem public/) --------------------
const makeItem = (src, fallbackPoster) => {
  const saved = bySrc.get(src) ?? byStem.get(stemOf(src.split("/").pop()));
  const name = src.split("/").pop();
  const item = {
    type: saved?.type ?? (isVideo(name) ? "video" : "image"),
    src,
    label: labelFrom(stemOf(name)),
  };
  const poster = saved?.poster ?? (item.type === "video" ? fallbackPoster : undefined);
  if (poster) item.poster = poster;
  return withSaved(item, saved);
};

const manifest = { techniques: {}, glossary: {} };

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
    if (!match) continue;
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
    if (!match) continue;
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

write(manifest, "lokalny");
console.log("  Uwaga: ustaw R2_PUBLIC_BASE_URL i uruchom media:prepare, aby opublikować filmy.");
