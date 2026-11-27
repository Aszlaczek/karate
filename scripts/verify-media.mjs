import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { catalogKeys, readBaseUrl, readCatalog } from "./catalog.mjs";

/** Jedyna bramka sprawdzająca media: treść kanoniczna ↔ pliki ↔ opcjonalnie R2. */
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = readCatalog(root);
const baseUrl = readBaseUrl(root);
const { desiredKeys } = catalogKeys(catalog);

const buildRoot = join(root, "media-build");
if (existsSync(buildRoot)) {
  const missing = [...desiredKeys].filter((key) => !existsSync(join(buildRoot, key)));
  if (missing.length) {
    console.error("W media-build/ brakuje " + missing.length + " plików z treści technik:");
    for (const key of missing.slice(0, 10)) console.error(" - " + key);
    if (missing.length > 10) console.error(` - …i ${missing.length - 10} więcej`);
    process.exit(1);
  }
  console.log(`media-build/: wszystkie ${desiredKeys.size} kluczy są obecne.`);
} else {
  console.log("media-build/ nie istnieje — pomijam sprawdzanie plików do uploadu.");
}
console.log(`Treść technik: ${Object.keys(catalog).length} folderów, ${desiredKeys.size} kluczy R2 (${baseUrl}).`);

// Opcjonalne sprawdzenie dostępności URL-i — jedyne wejście do weryfikacji R2.
// Włączane lokalnie: MEDIA_VERIFY_REMOTE=1 npm run media:verify.
if (process.env.MEDIA_VERIFY_REMOTE === "1") {
  const keys = [...desiredKeys];
  let checked = 0;
  let cursor = 0;
  const failures = [];
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const checkOne = async (key) => {
    for (const [attempt, wait] of [0, 300, 1000, 2500].entries()) {
      if (wait) await delay(wait);
      try {
        const response = await fetch(`${baseUrl}${key}`, { method: "HEAD" });
        if (response.ok) return;
        // R2/r2.dev ogranicza liczbę szybkich zapytań — ponawiamy tylko 429.
        if (response.status !== 429 || attempt === 3) return `${key}: HTTP ${response.status}`;
      } catch (error) {
        if (attempt === 3) return `${key}: ${error.message}`;
      }
    }
  };
  // Mała rotacja, żeby nie wywoływać limitu 429 na publicznej domenie R2.
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (cursor < keys.length) {
      const key = keys[cursor++];
      const failure = await checkOne(key);
      if (failure) failures.push(failure);
      if (++checked % 50 === 0) console.log(`  sprawdzono ${checked}/${keys.length} URL-i…`);
    }
  }));
  if (failures.length) {
    console.error("Zdalne URL-e niedostępne (" + failures.length + "):");
    for (const failure of failures.slice(0, 20)) console.error(" - " + failure);
    if (failures.length > 20) console.error(` - …i ${failures.length - 20} więcej`);
    process.exit(1);
  }
  console.log(`Wszystkie ${keys.length} zdalnych URL-i są osiągalne.`);
}
