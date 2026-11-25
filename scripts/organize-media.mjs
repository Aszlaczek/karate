import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { EXCLUDED_MEDIA_STEMS, loadTargets, resolveId, selectCandidates } from "./media-map.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = join(root, "public/videos");
const archiveRoot = join(root, "media-source/videos");
const { targets } = loadTargets();
const sectionById = new Map(targets.map((target) => [target.id, target.section]));

const isVideo = (name) => /\.(mp4|webm|mov)$/i.test(name) && !name.startsWith(".");
const filesIn = (folder) =>
  existsSync(folder)
    ? readdirSync(folder, { withFileTypes: true })
        .filter((entry) => entry.isFile() && isVideo(entry.name))
        .map((entry) => entry.name)
        .sort()
    : [];
const listed = (relative) => filesIn(join(publicRoot, relative))
  .filter((name) => !EXCLUDED_MEDIA_STEMS.has(name.replace(/\.[^.]+$/, "")));

const archiveFile = (sourcePath, id, name, copy) => {
  const folder = id ? join(archiveRoot, id, "video") : join(archiveRoot, "_nieprzypisane");
  mkdirSync(folder, { recursive: true });
  const target = join(folder, name.replace(/\.[^.]+$/, ".mp4"));
  if (!existsSync(target)) {
    if (copy) copyFileSync(sourcePath, target);
    else renameSync(sourcePath, target);
  }
};

let moved = 0;

// Nowe, płaskie pliki — przenosimy do archiwum.
for (const name of listed("techniques")) {
  const source = join(publicRoot, "techniques", name);
  const hit = resolveId(name, targets);
  archiveFile(source, hit?.id ?? null, name, false);
  moved += 1;
}

// Istniejące demo — kopiujemy, żeby stare media.json działało do czasu uploadu na R2.
for (const folder of ["techniques/seiken-morote-tsuki", "stances", "glossary"]) {
  for (const name of listed(folder)) {
    const hit = resolveId(name, targets);
    if (!hit) continue;
    archiveFile(join(publicRoot, folder, name), hit.id, name, true);
    moved += 1;
  }
}

// Gdy zmienią się reguły mapowania, popraw również już istniejące archiwum.
for (const entry of readdirSync(archiveRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const folder = join(archiveRoot, entry.name);
  const isUnassigned = entry.name === "_nieprzypisane";
  const files = isUnassigned ? filesIn(folder) : filesIn(join(folder, "video"));
  for (const name of files) {
    const hit = resolveId(name, targets);
    const desiredId = hit?.id ?? null;
    const desiredFolder = desiredId
      ? join(archiveRoot, desiredId, "video")
      : join(archiveRoot, "_nieprzypisane");
    const source = isUnassigned ? join(folder, name) : join(folder, "video", name);
    const target = join(desiredFolder, name.replace(/\.[^.]+$/, ".mp4"));
    if (source === target || existsSync(target)) continue;
    mkdirSync(desiredFolder, { recursive: true });
    renameSync(source, target);
    moved += 1;
  }
}

// Raport jest budowany z archiwum, więc `media:organize` można uruchamiać wielokrotnie.
const grouped = new Map();
const unresolved = filesIn(join(archiveRoot, "_nieprzypisane"));
for (const entry of readdirSync(archiveRoot, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name === "_nieprzypisane") continue;
  const files = filesIn(join(archiveRoot, entry.name, "video"));
  if (files.length) grouped.set(entry.name, { section: sectionById.get(entry.name) ?? "glossary", files });
}

const total = [...grouped.values()].reduce((sum, bucket) => sum + bucket.files.length, 0) + unresolved.length;
const lines = [
  "# Mapowanie plików wideo",
  "",
  `W archiwum jest ${total} plików: ${grouped.size} wpisów i ${unresolved.length} plików bez dopasowania.`,
  "Ostatnie uruchomienie przeniosło/skopiowało " + moved + " plików.",
  "",
  "| ID | Sekcja | Pliki | Wybrane do publikacji (max 4) |",
  "| --- | --- | --- | --- |",
];
for (const [id, bucket] of [...grouped].sort(([a], [b]) => a.localeCompare(b))) {
  const selected = selectCandidates(bucket.files);
  lines.push(
    `| \`${id}\` | ${bucket.section} | ${bucket.files.length} | ${selected.map((file) => `\`${file}\``).join(", ")} |`,
  );
}
lines.push("", "## Bez dopasowania", "");
lines.push(...(unresolved.length ? unresolved.map((name) => `- \`${name}\``) : ["- brak"]));
lines.push("");

writeFileSync(join(root, "media-source/MAPPING.md"), lines.join("\n"));
console.log(`Archiwum: ${total} plików, ${grouped.size} wpisów, ${unresolved.length} bez dopasowania.`);
console.log("Raport: media-source/MAPPING.md");
