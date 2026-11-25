import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DeleteObjectsCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { loadMediaEnv } from "./media-env.mjs";

loadMediaEnv();

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = join(root, "media-build/manifest-source.json");
const apply = process.argv.includes("--apply");

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

if (missing.length) {
  console.error("Brak zmiennych środowiskowych: " + missing.join(", "));
  process.exit(1);
}
if (!existsSync(sourcePath)) {
  console.error("Brak media-build/manifest-source.json — uruchom najpierw npm run media:prepare.");
  process.exit(1);
}

const source = JSON.parse(readFileSync(sourcePath, "utf8"));
const ids = new Set(Object.keys(source));
const expected = new Set();
for (const group of Object.values(source)) {
  for (const item of group.items) {
    expected.add(item.key);
    if (item.posterKey) expected.add(item.posterKey);
  }
}
if (ids.size < 20 || expected.size < 100) {
  console.error("Manifest źródłowy jest niekompletny — odmawiam usuwania obiektów.");
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

const extras = [];
let token;
do {
  const page = await client.send(new ListObjectsV2Command({
    Bucket: R2_BUCKET,
    ContinuationToken: token,
  }));
  for (const object of page.Contents ?? []) {
    const key = object.Key ?? "";
    const match = /^([a-z0-9-]+)\/(video|poster|image)\//.exec(key);
    if (match && ids.has(match[1]) && !expected.has(key)) extras.push(key);
    // Plik systemowy mógł zostać wysłany przez starszą wersję uploadu.
    else if (key === ".DS_Store") extras.push(key);
  }
  token = page.NextContinuationToken;
} while (token);

if (!extras.length) {
  console.log("Brak nieużywanych obiektów w bucketach " + R2_BUCKET + ".");
} else {
  console.log("Nieużywane obiekty (" + extras.length + "):");
  for (const key of extras.slice(0, 20)) console.log(" - " + key);
  if (extras.length > 20) console.log(" - …i " + (extras.length - 20) + " więcej");
  if (!apply) {
    console.log("Podgląd — nic nie usunięto. Uruchom z --apply, aby usunąć te obiekty.");
    process.exit(0);
  }
  for (let index = 0; index < extras.length; index += 1000) {
    await client.send(new DeleteObjectsCommand({
      Bucket: R2_BUCKET,
      Delete: {
        Objects: extras.slice(index, index + 1000).map((Key) => ({ Key })),
        Quiet: true,
      },
    }));
  }
  console.log("Usunięto " + extras.length + " nieużywanych obiektów z buckets " + R2_BUCKET + ".");
}
