import { spawn } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";
import { readCatalog } from "./catalog.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const archiveRoot = join(root, "media-source");
const buildRoot = join(root, "media-build");
const catalog = readCatalog(root);

// Tryb przyrostowy: MEDIA_PREPARE_ONLY=id1,id2 przygotowuje tylko wskazane wpisy.
const onlyIds = new Set(
  (process.env.MEDIA_PREPARE_ONLY ?? "").split(",").map((value) => value.trim()).filter(Boolean),
);
if (onlyIds.size) {
  const unknown = [...onlyIds].filter((id) => !catalog[id]);
  if (unknown.length) {
    console.error("Nieznane ID w MEDIA_PREPARE_ONLY: " + unknown.join(", "));
    process.exit(1);
  }
}

const jobs = [];
const errors = [];
const enqueue = (job) => {
  if (existsSync(job.output) && statSync(job.output).size > 0) return;
  jobs.push(job);
};

for (const [id, group] of Object.entries(catalog)) {
  if (onlyIds.size && !onlyIds.has(id)) continue;
  for (const item of group.items) {
    if (!item.key) continue; // lokalne zdjęcia słownika nie trafiają do R2
    const input = join(archiveRoot, item.source);
    if (!existsSync(input)) {
      errors.push(`${id}: brak pliku źródłowego ${item.source}`);
      continue;
    }
    const output = join(buildRoot, item.key);
    mkdirSync(dirname(output), { recursive: true });
    enqueue({ kind: "video", input, output });
    if (item.posterKey) {
      const poster = join(buildRoot, item.posterKey);
      mkdirSync(dirname(poster), { recursive: true });
      enqueue({ kind: "poster", input, output: poster });
    }
  }
}

if (errors.length) {
  console.error("Katalog wskazuje na nieistniejące źródła:");
  for (const error of errors.slice(0, 20)) console.error(" - " + error);
  if (errors.length > 20) console.error(` - …i ${errors.length - 20} więcej`);
  process.exit(1);
}
if (!jobs.length) {
  console.log("Wszystkie pliki z katalogu są już przygotowane w media-build/.");
  process.exit(0);
}

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

if (failures.length) {
  console.error("Błędy ffmpeg:");
  for (const failure of failures.slice(0, 10)) console.error(" - " + failure);
  if (failures.length > 10) console.error(` - …i ${failures.length - 10} więcej`);
  process.exitCode = 1;
} else {
  const videos = jobs.filter((job) => job.kind === "video").length;
  console.log(`Przygotowano ${videos} filmów i ${jobs.length - videos} posterów w media-build/.`);
}
