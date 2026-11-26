import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DeleteObjectsCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { loadMediaEnv } from "./media-env.mjs";

loadMediaEnv();

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const apply = args.includes("--apply");
const rawPrefixes = args.filter((arg) => arg !== "--apply");

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
} = process.env;

const missing = [
  ["R2_ACCOUNT_ID", R2_ACCOUNT_ID],
  ["R2_ACCESS_KEY_ID", R2_ACCESS_KEY_ID],
  ["R2_SECRET_ACCESS_KEY", R2_SECRET_ACCESS_KEY],
  ["R2_BUCKET", R2_BUCKET],
].filter(([, value]) => !value).map(([name]) => name);

if (!rawPrefixes.length) {
  console.error("Użycie: npm run media:delete-prefix -- <stare-id> [<stare-id> …] [--apply]");
  console.error("Bez --apply skrypt tylko pokazuje, co zostałoby usunięte.");
  process.exit(1);
}
if (missing.length) {
  console.error("Brak zmiennych środowiskowych: " + missing.join(", "));
  process.exit(1);
}

// Akceptujemy wyłącznie pojedyncze ID techniki/hasła — nigdy ścieżkę z gwiazdką
// ani prefiks obejmujący kilka wpisów.
const prefixes = [];
for (const raw of rawPrefixes) {
  const id = raw.replace(/\/$/, "");
  if (!/^[a-z0-9-]{2,}$/.test(id)) {
    console.error(`Nieprawidłowy prefiks „${raw}” — oczekiwano samego ID (np. stare-id).`);
    process.exit(1);
  }
  prefixes.push(`${id}/`);
}

const knownIds = new Set();
const techniques = JSON.parse(readFileSync(join(root, "src/data/techniques.json"), "utf8"));
for (const technique of techniques) knownIds.add(technique.id);
const glossary = JSON.parse(readFileSync(join(root, "src/data/glossary.json"), "utf8"));
for (const category of glossary.categories) {
  for (const entry of category.entries) knownIds.add(entry.id);
}
const sourcePath = join(root, "media-build/manifest-source.json");
if (existsSync(sourcePath)) {
  const source = JSON.parse(readFileSync(sourcePath, "utf8"));
  for (const id of Object.keys(source)) knownIds.add(id);
}
if (knownIds.size < 20) {
  console.error("Nie udało się wczytać listy aktywnych ID — odmawiam usuwania.");
  process.exit(1);
}

const unsafe = prefixes.filter((prefix) => knownIds.has(prefix.replace(/\/$/, "")));
if (unsafe.length) {
  console.error("Odmawiam usuwania prefiksów, które są nadal aktywnymi ID: " + unsafe.join(", "));
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const found = [];
for (const prefix of prefixes) {
  let token;
  const keys = [];
  do {
    const page = await client.send(new ListObjectsV2Command({
      Bucket: R2_BUCKET,
      Prefix: prefix,
      ContinuationToken: token,
    }));
    keys.push(...(page.Contents ?? []).map((object) => object.Key).filter(Boolean));
    token = page.NextContinuationToken;
  } while (token);
  console.log(`${prefix} — ${keys.length} obiektów`);
  for (const key of keys.slice(0, 6)) console.log("  - " + key);
  if (keys.length > 6) console.log(`  …i ${keys.length - 6} więcej`);
  found.push(...keys);
}

if (!found.length) {
  console.log("Nie znaleziono obiektów do usunięcia.");
  process.exit(0);
}
if (!apply) {
  console.log(`Podgląd: ${found.length} obiektów. Uruchom z --apply, aby je usunąć.`);
  process.exit(0);
}

for (let index = 0; index < found.length; index += 1000) {
  await client.send(new DeleteObjectsCommand({
    Bucket: R2_BUCKET,
    Delete: {
      Objects: found.slice(index, index + 1000).map((Key) => ({ Key })),
      Quiet: true,
    },
  }));
}
console.log(`Usunięto ${found.length} obiektów z R2 (${prefixes.join(", ")}).`);
