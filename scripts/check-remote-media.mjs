import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadMediaEnv } from "./media-env.mjs";

loadMediaEnv();

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const media = JSON.parse(readFileSync(join(root, "src/data/media.json"), "utf8"));
const timeout = Number(process.env.MEDIA_CHECK_TIMEOUT_MS ?? 15000);

const urls = new Set();
for (const group of Object.values(media)) {
  for (const items of Object.values(group ?? {})) {
    for (const item of items ?? []) {
      if (item.src?.startsWith("http")) urls.add(item.src);
      if (item.poster?.startsWith("http")) urls.add(item.poster);
    }
  }
}

if (!urls.size) {
  console.log("Brak zdalnych URL-i w media.json — nic do sprawdzenia.");
  process.exit(0);
}

const queue = [...urls];
let active = 0;
let done = 0;
const failures = [];
const next = () => {
  while (active < 8 && queue.length) {
    const url = queue.shift();
    active += 1;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    fetch(url, { method: "HEAD", signal: controller.signal })
      .then((response) => {
        if (!response.ok) failures.push(`${response.status} ${url}`);
      })
      .catch((error) => failures.push(`${error.message} ${url}`))
      .finally(() => {
        clearTimeout(timer);
        active -= 1;
        done += 1;
        if (done % 25 === 0) console.log(`  sprawdzono ${done}/${urls.size} URL-i…`);
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
  console.error(`Nieosiągalne URL-e (${failures.length}):`);
  for (const failure of failures.slice(0, 20)) console.error(" - " + failure);
  if (failures.length > 20) console.error(` - …i ${failures.length - 20} więcej`);
  process.exit(1);
}
console.log(`Wszystkie ${urls.size} zdalnych URL-i są osiągalne.`);
