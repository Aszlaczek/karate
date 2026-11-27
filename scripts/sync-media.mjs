import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assertCatalogComplete, catalogKeys, readCatalog } from "./catalog.mjs";
import {
  checkDeletionLimit,
  createClient,
  deleteKeys,
  listKeys,
  planSync,
  requireR2Env,
  uploadFiles,
} from "./r2-ops.mjs";

/** Jedyny zapis na R2: podgląd różnicy treść ↔ R2, --apply wykonuje zmiany. */
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const apply = args.includes("--apply");
const force = args.includes("--force");
const env = requireR2Env();
const catalog = readCatalog(root);
assertCatalogComplete(catalog);

const { desiredKeys, ids } = catalogKeys(catalog);
const client = createClient(env);
const remoteKeys = await listKeys(client, env.R2_BUCKET);
const plan = planSync({
  desiredKeys,
  scopedIds: ids,
  remoteKeys,
  buildRoot: join(root, "media-build"),
  exists: (file) => existsSync(file),
});

if (plan.errors.length) {
  console.error("Niekompletny build — odmawiam synchronizacji:");
  for (const error of plan.errors.slice(0, 20)) console.error(" - " + error);
  if (plan.errors.length > 20) console.error(` - …i ${plan.errors.length - 20} więcej`);
  console.error("Uruchom najpierw npm run media:prepare.");
  process.exit(1);
}

const limitError = checkDeletionLimit(plan.deletions, remoteKeys.size, force);
if (limitError) {
  console.error(limitError);
  process.exit(1);
}

console.log(`Treść: ${Object.keys(catalog).length} folderów, ${desiredKeys.size} kluczy R2.`);
console.log(`R2: ${remoteKeys.size} obiektów; do wysłania ${plan.uploads.length}, do usunięcia ${plan.deletions.length}.`);
for (const { key } of plan.uploads.slice(0, 10)) console.log("  + " + key);
if (plan.uploads.length > 10) console.log(`  …i ${plan.uploads.length - 10} więcej`);
for (const key of plan.deletions.slice(0, 10)) console.log("  - " + key);
if (plan.deletions.length > 10) console.log(`  …i ${plan.deletions.length - 10} więcej`);

if (!apply) {
  console.log("Podgląd — nic nie zmieniono. Uruchom z --apply, aby wysłać i usunąć wskazane obiekty.");
  process.exit(0);
}

if (plan.uploads.length) {
  await uploadFiles(client, env.R2_BUCKET, plan.uploads, (done, total) => {
    if (done % 25 === 0) console.log(`  wysłano ${done}/${total} plików…`);
  });
}
if (plan.deletions.length) await deleteKeys(client, env.R2_BUCKET, plan.deletions);
console.log(`Synchronizacja zakończona: +${plan.uploads.length}, -${plan.deletions.length}.`);
console.log("Następnie: npm run media:verify i MEDIA_VERIFY_REMOTE=1 npm run media:verify");
