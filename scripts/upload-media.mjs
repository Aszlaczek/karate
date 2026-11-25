import { createReadStream, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { loadMediaEnv } from "./media-env.mjs";

loadMediaEnv();

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const buildRoot = join(root, "media-build");

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  R2_PUBLIC_BASE_URL,
} = process.env;

const missing = [
  ["R2_ACCOUNT_ID", R2_ACCOUNT_ID],
  ["R2_ACCESS_KEY_ID", R2_ACCESS_KEY_ID],
  ["R2_SECRET_ACCESS_KEY", R2_SECRET_ACCESS_KEY],
  ["R2_BUCKET", R2_BUCKET],
  ["R2_PUBLIC_BASE_URL", R2_PUBLIC_BASE_URL],
].filter(([, value]) => !value).map(([name]) => name);

if (missing.length) {
  console.error("Brak zmiennych środowiskowych: " + missing.join(", "));
  console.error("Zobacz media-source/README.md i sekcję Publikacja w README.md.");
  process.exit(1);
}

if (!existsSync(join(buildRoot, "manifest-source.json"))) {
  console.error("Brak media-build/manifest-source.json — uruchom najpierw npm run media:prepare.");
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

const files = [];
const walk = (folder) => {
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    if (entry.name === "manifest-source.json" || entry.name.startsWith(".")) continue;
    const full = join(folder, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (statSync(full).isFile()) files.push(full);
  }
};
walk(buildRoot);

const contentType = (name) =>
  /\.mp4$/i.test(name) ? "video/mp4"
    : /\.jpg$/i.test(name) ? "image/jpeg"
      : "application/octet-stream";

const queue = [...files];
let active = 0;
let done = 0;
const failures = [];

const upload = async (file) => {
  const key = relative(buildRoot, file).split("/").join("/");
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await client.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: key,
          Body: createReadStream(file),
          ContentType: contentType(file),
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );
      return;
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  throw lastError;
};

const next = () => {
  while (active < 4 && queue.length) {
    const file = queue.shift();
    active += 1;
    upload(file)
      .catch((error) => failures.push(`${relative(buildRoot, file)}: ${error.message}`))
      .finally(() => {
        active -= 1;
        done += 1;
        if (done % 25 === 0) console.log(`  wysłano ${done}/${files.length} plików…`);
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
  }, 100);
});

if (failures.length) {
  console.error("Błędy uploadu:");
  for (const failure of failures.slice(0, 10)) console.error(" - " + failure);
  process.exitCode = 1;
} else {
  console.log(`Wysłano ${files.length} plików do buckets ${R2_BUCKET}.`);
  console.log(`Następnie: R2_PUBLIC_BASE_URL=${R2_PUBLIC_BASE_URL} npm run media:manifest`);
}
