import { createReadStream } from "node:fs";
import { join } from "node:path";
import { DeleteObjectsCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { loadMediaEnv } from "./media-env.mjs";

const WRITE_ENV = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET",
];

export const requireR2Env = ({ publicUrl = false } = {}) => {
  loadMediaEnv();
  const names = publicUrl ? [...WRITE_ENV, "R2_PUBLIC_BASE_URL"] : WRITE_ENV;
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length) {
    console.error("Brak zmiennych środowiskowych: " + missing.join(", "));
    console.error("Zobacz media-source/README.md i sekcję Publikacja w README.md.");
    process.exit(1);
  }
  return Object.fromEntries(names.map((name) => [name, process.env[name]]));
};

export const createClient = (env) =>
  new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });

export const listKeys = async (client, bucket) => {
  const keys = new Set();
  let token;
  do {
    const page = await client.send(new ListObjectsV2Command({
      Bucket: bucket,
      ContinuationToken: token,
    }));
    for (const object of page.Contents ?? []) if (object.Key) keys.add(object.Key);
    token = page.NextContinuationToken;
  } while (token);
  return keys;
};

/** Czysta funkcja planująca zmiany — testowalna bez dostępu do R2. */
export const planSync = ({ desiredKeys, scopedIds, remoteKeys, buildRoot, exists }) => {
  const uploads = [];
  const deletions = [];
  const errors = [];

  for (const key of desiredKeys) {
    if (remoteKeys.has(key)) continue;
    const file = join(buildRoot, key);
    if (!exists(file)) errors.push(`brak przygotowanego pliku media-build/${key} — uruchom media:prepare`);
    else uploads.push({ key, file });
  }

  for (const key of remoteKeys) {
    if (desiredKeys.has(key)) continue;
    if (key === ".DS_Store") {
      deletions.push(key);
      continue;
    }
    // Usuwamy tylko klucze medialne znanych ID — obce pliki pod tym samym
    // prefiksem (np. kopie zapasowe) nie mogą zostać przypadkiem skasowane.
    const match = /^([a-z0-9-]{2,})\/(?:video|poster|image)\//.exec(key);
    if (match && scopedIds.has(match[1])) deletions.push(key);
  }

  return {
    uploads: uploads.sort((a, b) => a.key.localeCompare(b.key)),
    deletions: deletions.sort(),
    errors,
  };
};

/** Domyślny limit usunięć: nie więcej niż 5% bucketu, minimum 20 obiektów. */
export const deletionLimit = (total) => Math.max(20, Math.ceil(total * 0.05));

export const checkDeletionLimit = (deletions, total, force = false) => {
  const limit = deletionLimit(total);
  if (!force && deletions.length > limit) {
    return (
      `Usunięcie ${deletions.length} obiektów przekracza bezpieczny limit ${limit} ` +
      `(5% z ${total} obiektów, minimum 20). Uruchom z --force, jeśli to zamierzone.`
    );
  }
  return null;
};

const contentType = (name) =>
  /\.mp4$/i.test(name) ? "video/mp4"
    : /\.jpg$/i.test(name) ? "image/jpeg"
      : "application/octet-stream";

export const uploadFiles = async (client, bucket, files, onDone = () => {}) => {
  let cursor = 0;
  let done = 0;
  const failures = [];

  const worker = async () => {
    while (cursor < files.length) {
      const file = files[cursor++];
      let lastError;
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          await client.send(
            new PutObjectCommand({
              Bucket: bucket,
              Key: file.key,
              Body: createReadStream(file.file),
              ContentType: contentType(file.file),
              CacheControl: "public, max-age=31536000, immutable",
            }),
          );
          lastError = null;
          break;
        } catch (error) {
          lastError = error;
          if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
      if (lastError) failures.push(`${file.key}: ${lastError.message}`);
      onDone(++done, files.length);
    }
  };

  await Promise.all(Array.from({ length: 4 }, worker));
  if (failures.length) {
    console.error("Błędy uploadu:");
    for (const failure of failures.slice(0, 10)) console.error(" - " + failure);
    if (failures.length > 10) console.error(` - …i ${failures.length - 10} więcej`);
    throw new Error("Upload nie został ukończony.");
  }
};

export const deleteKeys = async (client, bucket, keys) => {
  const failures = [];
  for (let index = 0; index < keys.length; index += 1000) {
    const result = await client.send(new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Objects: keys.slice(index, index + 1000).map((Key) => ({ Key })),
        Quiet: true,
      },
    }));
    // Quiet: true wycisza listę usuniętych, ale nie błędy — bez tego
    // częściowo nieudane usunięcie wygląda jak pełny sukces.
    for (const error of result.Errors ?? []) failures.push(`${error.Key}: ${error.Code}`);
  }
  if (failures.length) {
    console.error("Błędy usuwania:");
    for (const failure of failures.slice(0, 10)) console.error(" - " + failure);
    if (failures.length > 10) console.error(` - …i ${failures.length - 10} więcej`);
    throw new Error("Usuwanie nie zostało ukończone.");
  }
};
