import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";
import {
  describeMedia,
  EXCLUDED_MEDIA_STEMS,
  loadTargets,
  normalizeTokens,
  selectCandidates,
  sourceFolderFor,
  surfaceTokenFor,
  viewInfo,
  zoneOf,
} from "./media-map.mjs";
import { loadMediaEnv } from "./media-env.mjs";

loadMediaEnv();

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const archiveRoot = join(root, "media-source/videos");
const buildRoot = join(root, "media-build");
const sourcePath = join(buildRoot, "manifest-source.json");
// Tryb przyrostowy: MEDIA_PREPARE_ONLY=id1,id2 dodaje/brakujące pliki do istniejącego
// media-build zamiast kodować wszystkiego od nowa.
const onlyIds = (process.env.MEDIA_PREPARE_ONLY ?? "")
  .split(",").map((value) => value.trim()).filter(Boolean);
if (!onlyIds.length && existsSync(buildRoot)) {
  // macOS potrafi zwrócić ENOTEMPTY przy pierwszym czyszczeniu katalogu z .DS_Store.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      rmSync(buildRoot, { recursive: true, force: true });
      break;
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }
}
mkdirSync(buildRoot, { recursive: true });
const previous = JSON.parse(readFileSync(join(root, "src/data/media.json"), "utf8"));
const { glossary, targets } = loadTargets();
// `haishu` istnieje i jako technika, i jako hasło słownika — filmy należą do techniki.
const targetById = new Map();
for (const target of targets) {
  if (!targetById.has(target.id) || target.section === "techniques") targetById.set(target.id, target);
}
const entryById = new Map(
  glossary.categories.flatMap((category) => category.entries.map((entry) => [entry.id, entry])),
);
// Nowe ID czytają opisy z dawnych galerii łączonych, żeby zachować ręczne podpisy.
const previousIdBy = {
  "mawashi-geri-chudan-chusoku": "mawashi-geri-chudan-chusoku-haisoku",
  "mawashi-geri-chudan-haisoku": "mawashi-geri-chudan-chusoku-haisoku",
  "mawashi-geri-jodan-chusoku": "mawashi-geri-jodan-chusoku-haisoku",
  "mawashi-geri-jodan-haisoku": "mawashi-geri-jodan-chusoku-haisoku",
};
// Puste grupy pozostają w manifeście tylko po to, by cleanup usunął stare klucze R2.
const retiredIds = [
  "mawashi-geri-chudan-chusoku-haisoku",
  "mawashi-geri-jodan-chusoku-haisoku",
  "mae-kakato-geri",
];

const previousByKey = new Map();
for (const [id, items] of Object.entries(previous.techniques ?? {})) {
  for (const item of items) previousByKey.set(`${id}:${stemOf(item.src)}`, item);
}
for (const [id, items] of Object.entries(previous.glossary ?? {})) {
  for (const item of items) previousByKey.set(`${id}:${stemOf(item.src)}`, item);
}
function stemOf(src) {
  const name = decodeURIComponent(src.split("/").pop().split("?")[0]);
  return name.replace(/\.[^.]+$/, "");
}
const savedFor = (id, stem) => {
  const direct = previousByKey.get(`${id}:${stem}`);
  if (direct) return direct;
  const previousId = previousIdBy[id];
  return previousByKey.get(previousId ? `${previousId}:${stem}` : "") ?? previousByKey.get(stem);
};

const run = (args) =>
  new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`ffmpeg (${code}): ${stderr.slice(-600)}`)),
    );
  });

// Wszystkie filmy i postery mają identyczny wymiar — pełny pion 9:16 bez ucinania.
// Źródła to 1728×3072, więc nie skalujemy w dół: ~710 MB całości mieści się
// w darmowym limicie R2 (10 GB-month), a egress jest bezpłatny.
const UNIFORM_FILTER =
  "scale=1080:1920:force_original_aspect_ratio=decrease," +
  "pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1";

const transcode = (input, output) =>
  run([
    "-y", "-i", input,
    "-vf", UNIFORM_FILTER,
    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
    "-an", "-movflags", "+faststart", output,
  ]);

const frame = (input, output, seconds) =>
  run([
    "-y", "-ss", String(seconds), "-i", input,
    "-frames:v", "1", "-vf", UNIFORM_FILTER, "-q:v", "2", output,
  ]);

const filesIn = (folder, pattern) =>
  existsSync(folder)
    ? readdirSync(folder, { withFileTypes: true })
        .filter((entry) => entry.isFile() && pattern.test(entry.name) && !entry.name.startsWith("."))
        .map((entry) => entry.name)
        .sort()
    : [];

const ids = [...new Set([
  ...readdirSync(archiveRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "_nieprzypisane")
    .map((entry) => entry.name),
  // Techniki po podziale czytają surowe pliki z folderu łączonego.
  ...targets
    .filter((target) => target.section === "techniques" && sourceFolderFor(target.id) !== target.id)
    .map((target) => target.id),
])].sort();
const limit = Number(process.env.MEDIA_PREPARE_LIMIT ?? 0);
const selectedIds = onlyIds.length
  ? ids.filter((id) => onlyIds.includes(id))
  : limit > 0 ? ids.slice(0, limit) : ids;

const manifestSource = onlyIds.length && existsSync(sourcePath)
  ? JSON.parse(readFileSync(sourcePath, "utf8"))
  : {};
const jobs = [];
// W trybie przyrostowym pomijamy pliki, które już istnieją w media-build.
const enqueue = (job) => {
  if (existsSync(job.output) && statSync(job.output).size > 0) return;
  jobs.push(job);
};


for (const id of selectedIds) {
  const target = targetById.get(id);
  if (!target || target.section !== "techniques") continue;
  // Pliki mogą leżeć w <folder>/video/ albo bezpośrednio w <folder>/ — obie
  // lokalizacje traktujemy tak samo i zapamiętujemy ścieżkę każdego stemu.
  const folderName = sourceFolderFor(id);
  const surface = surfaceTokenFor(id);
  const videoSources = new Map();
  for (const folder of [join(archiveRoot, folderName, "video"), join(archiveRoot, folderName)]) {
    for (const name of filesIn(folder, /\.(mp4|webm|mov)$/i)) {
      const stem = name.replace(/\.[^.]+$/, "");
      if (!videoSources.has(stem)) videoSources.set(stem, join(folder, name));
    }
  }
  const videos = [...videoSources.keys()]
    .sort()
    .filter((stem) => !EXCLUDED_MEDIA_STEMS.has(stem))
    .filter((stem) => !surface || normalizeTokens(stem).includes(surface));
  if (!videos.length) continue;

  const folderVideo = join(buildRoot, id, "video");
  const folderPoster = join(buildRoot, id, "poster");
  for (const folder of [folderVideo, folderPoster]) mkdirSync(folder, { recursive: true });

  const items = [];
  for (const name of selectCandidates(videos)) {
    const stem = name.replace(/\.[^.]+$/, "");
    const saved = savedFor(id, stem);
    const described = describeMedia(stem, target.name);
    // Podpisy wygenerowane wcześniej można odtworzyć z nową regułą wariantów;
    // prawdziwe opisy ręczne (np. „Kamae — lewa strona”) zostają nienaruszone.
    const view = viewInfo(stem);
    const oldLabel = saved?.label?.endsWith(` — ${view.label}`);
    const oldAlt = saved?.alt?.endsWith(`: ${view.alt}. Nagranie z dojo.`);
    const videoKey = `${id}/video/${stem}.mp4`;
    const posterKey = `${id}/poster/${stem}.jpg`;
    const zone = zoneOf(stem);
    items.push({
      key: videoKey,
      type: "video",
      ...(zone ? { zone } : {}),
      label: saved?.label && !oldLabel ? saved.label : described.label,
      alt: saved?.alt && !oldAlt ? saved.alt : described.alt,
      ...(saved?.caption ? { caption: saved.caption } : {}),
      posterKey,
    });
    const source = videoSources.get(stem);
    enqueue({ kind: "video", input: source, output: join(buildRoot, videoKey) });
    enqueue({ kind: "poster", input: source, output: join(buildRoot, posterKey) });
  }

  manifestSource[id] = { section: target.section, items };
}

/** Słownik wskazuje wyłącznie na lokalne pliki z public/images/glossary/. */
const localImageForStem = (stem) => {
  for (const folder of ["", "human-parts", "stances", "ustawienia-dloni", "ustawienia-stopy", "trening-komendy"]) {
    const relative = folder ? `images/glossary/${folder}/${stem}.jpg` : `images/glossary/${stem}.jpg`;
    if (existsSync(join(root, "public", relative))) return `/${relative}`;
  }
  return null;
};

for (const [id, items] of Object.entries(previous.glossary ?? {})) {
  if (manifestSource[id]?.section === "techniques") continue;
  const entry = entryById.get(id);
  if (!entry) continue;
  const sources = [];
  if (entry.image) sources.push(entry.image);
  for (const item of items) {
    if (item.type !== "image") continue;
    const local = localImageForStem(stemOf(item.src));
    if (local && !sources.includes(local)) sources.push(local);
  }
  if (!sources.length) continue;
  manifestSource[id] = {
    section: "glossary",
    items: sources.map((src, index) => {
      const saved = items.find((item) => stemOf(item.src) === stemOf(src));
      const label = saved?.label && !/klatka filmu/i.test(saved.label)
        ? saved.label
        : sources.length === 1 ? entry.term : `${entry.term} — zdjęcie ${index + 1}`;
      const alt = saved?.alt && !/klatka z nagrania/i.test(saved.alt)
        ? saved.alt
        : `${entry.term}: ${sources.length === 1 ? "zdjęcie" : `zdjęcie ${index + 1}`}.`;
      return { key: src, src, type: "image", label, alt, local: true };
    }),
  };
}

for (const id of retiredIds) manifestSource[id] = { section: "techniques", items: [] };

const queue = [...jobs];
let active = 0;
let done = 0;
const failures = [];
const next = () => {
  while (active < 4 && queue.length) {
    const job = queue.shift();
    active += 1;
    const task = job.kind === "video"
      ? transcode(job.input, job.output)
      : frame(job.input, job.output, 1);
    task
      .catch((error) => failures.push(`${job.output}: ${error.message}`))
      .finally(() => {
        active -= 1;
        done += 1;
        if (done % 25 === 0) console.log(`  przetworzono ${done}/${jobs.length} plików…`);
        next();
      });
  }
};
next();

await new Promise((resolve) => {
  const timer = setInterval(() => {
    if (active === 0 && queue.length === 0) {
      clearInterval(timer);
      resolve();
    }
  }, 50);
});

writeFileSync(sourcePath, JSON.stringify(manifestSource, null, 2) + "\n");

if (failures.length) {
  console.error("Błędy ffmpeg:");
  for (const failure of failures.slice(0, 10)) console.error(" - " + failure);
  if (failures.length > 10) console.error(` - …i ${failures.length - 10} więcej`);
  process.exitCode = 1;
}
const builtVideos = jobs.filter((job) => job.kind === "video").length;
console.log(
  `Przygotowano ${builtVideos} filmów i ${jobs.length - builtVideos} obrazów dla ${Object.keys(manifestSource).length} wpisów.`,
);
console.log("Manifest źródłowy: media-build/manifest-source.json");
