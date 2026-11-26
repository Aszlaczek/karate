import { spawn } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";
import { describeMedia, EXCLUDED_MEDIA_STEMS, loadTargets, selectCandidates } from "./media-map.mjs";
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
const { targets } = loadTargets();
const targetById = new Map(targets.map((target) => [target.id, target]));

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
const savedFor = (id, stem) => previousByKey.get(`${id}:${stem}`) ?? previousByKey.get(stem);

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

// Samodzielne zdjęcia (seiken, sokuto) kopiujemy bez rekompresji —
// oryginały 1448×1086 są już w dobrej jakości, a ponowny encode tylko
// odbierałby im detale.
const copyImage = (input, output) => {
  copyFileSync(input, output);
  return Promise.resolve();
};

const IMAGE_SOURCE_DIRS = [
  join(root, "public/images/glossary/human-parts"),
  join(root, "public/images/glossary"),
  join(root, "public/images/techniques"),
];
const localImageSource = (stem) => {
  for (const folder of IMAGE_SOURCE_DIRS) {
    for (const ext of [".jpg", ".jpeg", ".png", ".webp"]) {
      const file = join(folder, `${stem}${ext}`);
      if (existsSync(file)) return file;
    }
  }
  return null;
};

const filesIn = (folder, pattern) =>
  existsSync(folder)
    ? readdirSync(folder, { withFileTypes: true })
        .filter((entry) => entry.isFile() && pattern.test(entry.name) && !entry.name.startsWith("."))
        .map((entry) => entry.name)
        .sort()
    : [];

const ids = readdirSync(archiveRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== "_nieprzypisane")
  .map((entry) => entry.name)
  .sort();
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
let videoCount = 0;

for (const id of selectedIds) {
  const target = targetById.get(id);
  if (!target) continue;
  // Pliki mogą leżeć w <id>/video/ albo bezpośrednio w <id>/ — obie lokalizacje
  // traktujemy tak samo i zapamiętujemy faktyczną ścieżkę źródłową każdego stemu.
  const videoSources = new Map();
  for (const folder of [join(archiveRoot, id, "video"), join(archiveRoot, id)]) {
    for (const name of filesIn(folder, /\.(mp4|webm|mov)$/i)) {
      const stem = name.replace(/\.[^.]+$/, "");
      if (!videoSources.has(stem)) videoSources.set(stem, join(folder, name));
    }
  }
  const videos = [...videoSources.keys()]
    .sort()
    .filter((stem) => !EXCLUDED_MEDIA_STEMS.has(stem));
  if (!videos.length) continue;

  const folderVideo = join(buildRoot, id, "video");
  const folderPoster = join(buildRoot, id, "poster");
  const folderImage = join(buildRoot, id, "image");
  for (const folder of [folderVideo, folderPoster, folderImage]) mkdirSync(folder, { recursive: true });

  const items = [];
  for (const name of selectCandidates(videos)) {
    const stem = name.replace(/\.[^.]+$/, "");
    const saved = savedFor(id, stem);
    const described = describeMedia(stem, target.name);
    const videoKey = `${id}/video/${stem}.mp4`;
    const posterKey = `${id}/poster/${stem}.jpg`;
    items.push({
      key: videoKey,
      type: "video",
      label: saved?.label ?? described.label,
      alt: saved?.alt ?? described.alt,
      ...(saved?.caption ? { caption: saved.caption } : {}),
      posterKey,
    });
    const source = videoSources.get(stem);
    enqueue({ kind: "video", input: source, output: join(buildRoot, videoKey) });
    enqueue({ kind: "poster", input: source, output: join(buildRoot, posterKey) });
    videoCount += 1;
  }

  if (items.length === 1) {
    const stem = stemOf(items[0].key);
    const stillKey = `${id}/image/${stem}-still.jpg`;
    const saved = savedFor(id, `${stem}-still`);
    items.push({
      key: stillKey,
      type: "image",
      label: saved?.label ?? `${target.name} — klatka filmu`,
      alt: saved?.alt ?? `${target.name}: dodatkowa klatka z nagrania z dojo.`,
    });
    enqueue({
      kind: "still",
      input: videoSources.get(stem),
      output: join(buildRoot, stillKey),
    });
  }

  manifestSource[id] = { section: target.section, items };
}

// Hasła z samymi zdjęciami (seiken, sokuto) — pobieramy je z lokalnych
// oryginałów i kopiujemy bez strat, bez zmiany nazw kluczy na R2.
for (const [section, group] of [["techniques", previous.techniques ?? {}], ["glossary", previous.glossary ?? {}]]) {
  for (const [id, items] of Object.entries(group)) {
    if (manifestSource[id]) continue;
    const images = items.filter((item) => item.type === "image");
    if (!images.length) continue;
    const folder = join(buildRoot, id, "image");
    mkdirSync(folder, { recursive: true });
    const builtItems = [];
    for (const item of images.slice(0, 4)) {
      const stem = stemOf(item.src);
      const key = `${id}/image/${stem}.jpg`;
      const source = item.src.startsWith("http")
        ? localImageSource(stem)
        : join(root, "public", item.src.slice(1));
      if (source && existsSync(source)) {
        enqueue({ kind: "image", input: source, output: join(buildRoot, key) });
      } else {
        console.warn(`Brak lokalnego źródła dla ${key} — pozostawiam istniejący obiekt R2.`);
      }
      builtItems.push({
        key,
        type: "image",
        label: item.label,
        ...(item.alt ? { alt: item.alt } : {}),
        ...(item.caption ? { caption: item.caption } : {}),
      });
    }
    manifestSource[id] = { section, items: builtItems };
  }
}

const queue = [...jobs];
let active = 0;
let done = 0;
const failures = [];
const next = () => {
  while (active < 4 && queue.length) {
    const job = queue.shift();
    active += 1;
    const task =
      job.kind === "video"
        ? transcode(job.input, job.output)
        : job.kind === "image"
          ? copyImage(job.input, job.output)
          : frame(job.input, job.output, job.kind === "still" ? 2 : 1);
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
console.log(
  `Przygotowano ${videoCount} filmów i ${jobs.length - videoCount} obrazów dla ${Object.keys(manifestSource).length} wpisów.`,
);
console.log("Manifest źródłowy: media-build/manifest-source.json");
