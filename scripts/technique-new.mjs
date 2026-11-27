import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CONTENT } from "./catalog.mjs";

/** Nowa technika = jeden folder. Wszystkie pozostałe dane powstają w buildzie. */
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const id = args.find((arg) => !arg.startsWith("-") && !/^\d+$/.test(arg));
const levelArg = args.indexOf("--level");
const groupArg = args.indexOf("--group");
const levelNumber = levelArg >= 0 ? Number(args[levelArg + 1]) : null;
const groupTitle = groupArg >= 0 ? args[groupArg + 1] : "Techniki";

if (!id || !/^[a-z0-9-]{2,}$/.test(id)) {
  console.error("Użycie: npm run technique:new -- <id> [--level <number>] [--group <tytuł>]");
  process.exit(1);
}
const dir = join(root, CONTENT, id);
if (existsSync(dir)) {
  console.error(`Technika ${id} już istnieje.`);
  process.exit(1);
}
if (levelArg >= 0 && (!Number.isInteger(levelNumber) || levelNumber < 0)) {
  console.error("--level wymaga numeru stopnia (0–15).");
  process.exit(1);
}

const write = (path, value) => writeFileSync(path, JSON.stringify(value, null, 2) + "\n");
mkdirSync(dir, { recursive: true });
write(join(dir, "index.json"), {
  id,
  name: id.replaceAll("-", " "),
  japanese: "",
  reading: "",
  category: "Uderzenia",
  description: "",
  tags: [],
  focus: "",
  levels: levelNumber === null ? [] : [levelNumber],
  aliases: [],
  knowledge: {
    translation: "",
    nameParts: [],
    sections: [{ title: "Ruch i powierzchnia kontaktu", body: "" }],
  },
});
write(join(dir, "details.json"), { media: [] });

const orderPath = join(root, CONTENT, "index.json");
const order = JSON.parse(readFileSync(orderPath, "utf8"));
order.push(id);
write(orderPath, order);

if (levelNumber !== null) {
  const levelsPath = join(root, "src/data/levels.json");
  const levels = JSON.parse(readFileSync(levelsPath, "utf8"));
  const level = levels.find((item) => item.number === levelNumber);
  if (!level) {
    console.error(`Brak stopnia ${levelNumber} w src/data/levels.json.`);
    process.exit(1);
  }
  let group = level.groups.find((item) => item.title === groupTitle);
  if (!group) {
    group = { title: groupTitle, items: [] };
    level.groups.push(group);
  }
  group.items.push({ type: "technique", id });
  write(levelsPath, levels);
}

console.log(`Utworzono ${CONTENT}/${id}/ (index.json + details.json).`);
console.log("Wrzuć wideo do media-source/videos/<id>/video/, wpisz source (samą nazwę pliku) w details.json i uruchom npm run check.");
