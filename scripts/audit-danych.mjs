import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadMediaEnv } from "./media-env.mjs";

loadMediaEnv();

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const write = (p, s) => writeFileSync(join(root, p), s, "utf8");

const heroImage = "public/images/hero/osu-no-seishin.jpg";
const srcFiles = (dir = "src") =>
  readdirSync(join(root, dir), { withFileTypes: true }).flatMap((entry) => {
    const relative = join(dir, entry.name);
    return entry.isDirectory() ? srcFiles(relative) : entry.isFile() ? [relative] : [];
  });

const techs = JSON.parse(read("src/data/techniques.json"));
const levels = JSON.parse(read("src/data/levels.json"));
const glossary = JSON.parse(read("src/data/glossary.json"));
const indexTs = read("src/data/index.ts");
const media = JSON.parse(read("src/data/media.json"));
const details = JSON.parse(read("src/data/techniqueDetails.json"));
const learning = JSON.parse(read("src/data/learning.json"));

const categories = [
  ...indexTs
    .match(/export const CATEGORIES = \[(.*?)\]/s)[1]
    .matchAll(/"([^"]+)"/g),
].map((m) => m[1]);

const MACRONS = { "ā": "a", "ī": "i", "ū": "u", "ō": "o", "ē": "e" };
const foldMacrons = (value) => value.replace(/[āīūōē]/g, (char) => MACRONS[char]);

const normalizeAlias = (value) =>
  foldMacrons(value.toLowerCase())
    .replace(/[\s\u2014-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const critical = [];
const warn = [];

const uniq = (arr) => new Set(arr).size;

// Szczegóły wszystkich pozycji atlasu: kompletność, struktura i człony nazw.
const words = (value) => value.match(/[\p{L}\p{N}]+/gu) ?? [];
const nonEmpty = (value) => typeof value === "string" && value.trim().length > 0;
const validSources = (sources) => Array.isArray(sources) && sources.length > 0 && sources.every((source) => {
  try { return nonEmpty(source.title) && new URL(source.url).protocol === "https:"; } catch { return false; }
});
for (const kind of ["guides", "timeline", "facts"]) {
  const entries = learning[kind];
  if (!Array.isArray(entries) || !entries.length) { critical.push(`learning.json — puste ${kind}`); continue; }
  if (uniq(entries.map((entry) => entry.id)) !== entries.length) critical.push(`learning.json — powtórzone id w ${kind}`);
  for (const entry of entries) {
    const label = `learning.json — ${kind}/${entry.id}`;
    if (!/^[a-z0-9-]+$/.test(entry.id) || !nonEmpty(entry.title) || !validSources(entry.sources)) critical.push(`${label}: nieprawidłowe id, tytuł lub źródła`);
    if (kind === "guides") {
      if (![entry.tag, entry.intro, entry.equipment, entry.note].every(nonEmpty) || !Array.isArray(entry.steps) || entry.steps.length < 3 || entry.steps.some((step) => !nonEmpty(step.title) || !nonEmpty(step.body))) critical.push(`${label}: niepełny poradnik`);
    } else if (!nonEmpty(entry.body) || (kind === "timeline" && !nonEmpty(entry.period))) critical.push(`${label}: niepełny opis`);
  }
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(learning.feedback?.email ?? "") || !Array.isArray(learning.feedback?.topics) || !learning.feedback.topics.length || !learning.feedback.topics.every(nonEmpty)) critical.push("learning.json — nieprawidłowa konfiguracja kontaktu");
for (const category of glossary.categories) {
  if (category.sources !== undefined && !validSources(category.sources)) critical.push(`glossary.json — nieprawidłowe źródła kategorii ${category.id}`);
}
const stanceEntries = glossary.categories.find((category) => category.id === "pozycje").entries;
for (const [kind, entries] of [["techniques", techs], ["stances", stanceEntries]]) {
  const group = details[kind] ?? {};
  for (const entry of entries) {
    const detail = group[entry.id];
    const label = `techniqueDetails.json — ${kind}/${entry.id}`;
    if (!detail) { critical.push(`${label}: brak szczegółów`); continue; }
    if (!nonEmpty(detail.translation)) critical.push(`${label}: brak polskiego znaczenia`);
    if (!Array.isArray(detail.nameParts) || !detail.nameParts.length ||
      detail.nameParts.some((part) => !nonEmpty(part.term) || !nonEmpty(part.polish))) {
      critical.push(`${label}: niepełne tłumaczenie członów nazwy`);
    } else if (words(kind === "techniques" ? entry.name : entry.reading).join(" ") !== detail.nameParts.map((part) => part.term).join(" ")) {
      critical.push(`${label}: człony nie pokrywają całej nazwy w jej kolejności`);
    }
    if (!Array.isArray(detail.sections) || detail.sections.length < 2 ||
      detail.sections.some((section) => !nonEmpty(section.title) || !nonEmpty(section.body))) {
      critical.push(`${label}: wymagane przynajmniej dwie pełne sekcje opisu`);
    }
    if (detail.note !== undefined && !nonEmpty(detail.note)) critical.push(`${label}: pusta uwaga`);
  }
  for (const id of Object.keys(group)) {
    if (!entries.some((entry) => entry.id === id)) critical.push(`techniqueDetails.json — martwy wpis ${kind}/${id}`);
  }
}

// --- 1. techniques.json -----------------------------------------------------

const dupIds = techs.map((t) => t.id).filter((id, i, a) => a.indexOf(id) !== i);
if (dupIds.length) critical.push("techniques.json — zduplikowane id: " + dupIds.join(", "));

for (const t of techs) {
  if (!t.id || !t.name || !t.description) critical.push("techniques.json — puste pole w \"" + t.id + "\" (id/name/description)");
  if (!Array.isArray(t.levels) || t.levels.length === 0) critical.push("techniques.json — \"" + t.id + "\" ma puste levels[]");
  if (t.levels && t.levels.some((l) => !Number.isInteger(l) || l < 0 || l > 15))
    critical.push("techniques.json — \"" + t.id + "\" ma levels poza zakresem 0–15: " + JSON.stringify(t.levels));
  if (!categories.includes(t.category)) critical.push("techniques.json — \"" + t.id + "\" ma kategorię spoza CATEGORIES: \"" + t.category + "\"");
}

// Media technik mają jedno źródło — media.json. Pola legacy są błędem.
const legacyMediaIds = techs.filter((t) => "image" in t || "video" in t).map((t) => t.id);
if (legacyMediaIds.length) critical.push("techniques.json — martwe pola image/video w: " + legacyMediaIds.join(", "));

const unsplashFiles = srcFiles().filter((path) => /images\.unsplash\.com/i.test(read(path)));
if (unsplashFiles.length) critical.push("src/ — zewnętrzne obrazy Unsplash: " + unsplashFiles.join(", "));
if (!existsSync(join(root, heroImage))) critical.push(`Hero — brak lokalnego zdjęcia ${heroImage}`);
if (!read("src/features/home/components/Hero.tsx").includes("images/hero/osu-no-seishin.jpg"))
  critical.push("Hero.tsx — brak lokalnej ścieżki images/hero/osu-no-seishin.jpg");

// --- 2. kolizje aliasów -----------------------------------------------------

const aliasMap = new Map();
for (const t of techs)
  for (const a of t.aliases ?? []) {
    const k = normalizeAlias(a);
    if (!aliasMap.has(k)) aliasMap.set(k, []);
    aliasMap.get(k).push(t.id);
  }
const collisions = [...aliasMap].filter(([, ids]) => new Set(ids).size > 1);
for (const [alias, ids] of collisions)
  warn.push("KOLIZJA — alias \"" + alias + "\" → " + ids.length + " technik: " + ids.join(", "));

// --- 3. glossary.json -------------------------------------------------------

const glossEntries = glossary.categories.flatMap((c) => c.entries);
const glossIds = new Set(glossEntries.map((e) => e.id));
const techIds = new Set(techs.map((t) => t.id));

const dupGloss = glossEntries.map((e) => e.id).filter((id, i, a) => a.indexOf(id) !== i);
if (dupGloss.length) critical.push("glossary.json — zduplikowane id: " + dupGloss.join(", "));
for (const e of glossEntries) {
  if (!e.term) critical.push("glossary.json — pusty term w \"" + e.id + "\"");
  for (const r of e.related ?? [])
    if (!techIds.has(r) && !glossIds.has(r)) critical.push("glossary.json — martwy related \"" + r + "\" w haśle \"" + e.id + "\"");
  if (e.image) {
    if (/^https?:\/\//i.test(e.image)) {
      if (!/^https:\/\//i.test(e.image)) critical.push(`glossary.json — "${e.id}" ma obraz HTTP: ${e.image}`);
    } else if (!e.image.startsWith("/")) {
      critical.push(`glossary.json — "${e.id}" ma ścieżkę obrazu bez "/": ${e.image}`);
    } else if (!existsSync(join(root, "public", e.image.slice(1)))) {
      critical.push(`glossary.json — brak pliku obrazu ${e.image} w haśle "${e.id}"`);
    }
  }
}

// --- 3b. Galerie mediów (media.json) ---------------------------------------

const stanceIds = new Set(
  glossary.categories.find((category) => category.id === "pozycje")?.entries.map((entry) => entry.id) ?? [],
);
// Brak drugiego nagrania w archiwum — galerie jednofilmowe są świadomym wyjątkiem.
const ONE_VIDEO_TECHNIQUES = new Set([
  "seiken-shita-tsuki",
  "yoko-keage",
]);
// Wpisy z jednym własnym zdjęciem zamiast filmu (jest też klatka techniki,
// której jedyne nagranie zostało przeniesione do innej galerii).
const IMAGE_ONLY_ENTRIES = new Set(["seiken", "mae-kakato-geri"]);
const allowedMedia = /\.(mp4|webm|mov|jpe?g|png|webp|gif|svg)$/i;
const mediaStats = { techniques: { sets: 0, items: 0, videos: 0 }, glossary: { sets: 0, items: 0, videos: 0 } };

const isRemoteSrc = (src) => /^https?:\/\//i.test(src);
const publicFile = (src) => src.startsWith("/") && existsSync(join(root, "public", src.slice(1)));
const pathOf = (src) => {
  try {
    return isRemoteSrc(src) ? decodeURIComponent(new URL(src).pathname) : src.split(/[?#]/)[0];
  } catch {
    return "";
  }
};
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const legacyRootFor = (section, id, type) =>
  section === "techniques" ? `/${type === "video" ? "videos" : "images"}/techniques/${id}/`
    : stanceIds.has(id) ? `/${type === "video" ? "videos" : "images"}/stances/`
      : `/${type === "video" ? "videos" : "images"}/glossary/`;

/** R2 używa kluczy `<id>/video|poster|image/<stem>`; localnie zostawiamy stare układy. */
const mediaFolder = (kind) => (kind === "video" ? "video" : kind === "poster" ? "poster" : "image");
const inMediaFolder = (src, id, kind, section) => {
  const path = pathOf(src);
  if (isRemoteSrc(src)) {
    return new RegExp(`(?:^|/)${escapeRegExp(id)}/${mediaFolder(kind)}/[^/]+$`).test(path);
  }
  return path.startsWith(legacyRootFor(section, id, kind === "video" ? "video" : "image"));
};
const mediaAvailable = (src) => isRemoteSrc(src) || publicFile(src);

const r2Base = (() => {
  if (!process.env.R2_PUBLIC_BASE_URL) return null;
  try {
    const url = new URL(process.env.R2_PUBLIC_BASE_URL);
    return `${url.origin}${url.pathname.replace(/\/$/, "")}/`;
  } catch {
    warn.push("R2_PUBLIC_BASE_URL: nieprawidłowy URL");
    return null;
  }
})();

for (const [section, ids] of [["techniques", techIds], ["glossary", glossIds]]) {
  const group = media[section] ?? {};
  for (const [id, items] of Object.entries(group)) {
    const label = `media.json — ${section}/${id}`;
    if (!ids.has(id)) { critical.push(`${label}: nieistniejący id`); continue; }
    if (!Array.isArray(items)) { critical.push(`${label}: galeria nie jest tablicą`); continue; }
    mediaStats[section].sets += 1;
    mediaStats[section].items += items.length;
    const videoCount = items.filter((item) => item?.type === "video").length;
    const imageCount = items.filter((item) => item?.type === "image").length;
    const oneVideoException = section === "techniques" && ONE_VIDEO_TECHNIQUES.has(id);
    const imageOnlyException = IMAGE_ONLY_ENTRIES.has(id);
    if (imageOnlyException) {
      if (videoCount !== 0 || imageCount !== 1)
        critical.push(`${label}: wyjątek obrazu wymaga dokładnie 1 zdjęcia i 0 filmów`);
    } else if (oneVideoException) {
      if (videoCount !== 1 || items.length > 2)
        critical.push(`${label}: wyjątek jednofilmowy wymaga 1 filmu i opcjonalnie 1 klatki`);
    } else if (items.length < 2) {
      warn.push(`${label}: galeria ma ${items.length} elementów (oczekiwano co najmniej 2)`);
    }

    const seen = new Set();
    for (const [index, item] of items.entries()) {
      const itemLabel = `${label}[${index}]`;
      if (!item || !nonEmpty(item.src) || !nonEmpty(item.label)) {
        critical.push(`${itemLabel}: wymagane src i label`);
        continue;
      }
      if (item.type !== "video" && item.type !== "image") critical.push(`${itemLabel}: nieprawidłowy type "${item.type}"`);
      if (item.zone !== undefined && !["jodan", "chudan", "gedan"].includes(item.zone))
        critical.push(`${itemLabel}: nieprawidłowa strefa "${item.zone}"`);
      if (/\/images\/GenAI\//i.test(item.src) || (item.poster && /\/images\/GenAI\//i.test(item.poster)))
        critical.push(`${itemLabel}: grafiki GenAI nie są już obsługiwane`);
      if (seen.has(item.src)) critical.push(`${itemLabel}: powtórzony src`);
      seen.add(item.src);
      if (/^http:\/\//i.test(item.src)) critical.push(`${itemLabel}: źródło musi używać HTTPS`);
      else if (!isRemoteSrc(item.src) && !item.src.startsWith("/"))
        critical.push(`${itemLabel}: ścieżka musi zaczynać się od "/"`);
      else if (!allowedMedia.test(pathOf(item.src)))
        critical.push(`${itemLabel}: niedozwolone rozszerzenie "${item.src}"`);
      else if (!mediaAvailable(item.src))
        critical.push(`${itemLabel}: brak pliku ${item.src}`);
      if (r2Base && isRemoteSrc(item.src) && !item.src.startsWith(r2Base))
        critical.push(`${itemLabel}: źródło poza R2_PUBLIC_BASE_URL`);
      if (!inMediaFolder(item.src, id, item.type === "video" ? "video" : "image", section))
        critical.push(`${itemLabel}: plik poza folderem "${id}/${mediaFolder(item.type)}"`);
      const path = pathOf(item.src);
      const ext = extname(path).toLowerCase();
      const extMatchesType = item.type === "video"
        ? [".mp4", ".webm", ".mov"].includes(ext)
        : [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(ext);
      if (!extMatchesType) critical.push(`${itemLabel}: rozszerzenie "${ext}" nie pasuje do typu "${item.type}"`);
      if (item.type === "video") {
        mediaStats[section].videos += 1;
        if (!nonEmpty(item.poster)) critical.push(`${itemLabel}: film bez posteru`);
        else if (!allowedMedia.test(pathOf(item.poster)) || !mediaAvailable(item.poster))
          critical.push(`${itemLabel}: nieprawidłowy poster "${item.poster}"`);
        else {
          if (!inMediaFolder(item.poster, id, "poster", section))
            critical.push(`${itemLabel}: poster poza folderem "${id}/poster"`);
          const stem = basename(path, extname(path));
          if (basename(pathOf(item.poster), extname(pathOf(item.poster))) !== stem)
            warn.push(`${itemLabel}: poster ma inny stem niż film (${stem})`);
        }
      }
      if (item.alt !== undefined && !nonEmpty(item.alt)) warn.push(`${itemLabel}: pusty alt`);
    }
  }
}

// --- 3c. Dane pobierane na żądanie (public/data/) ----------------------------

/** Ta sama reguła co getMediaThumbnail() — pierwszy obraz albo poster pierwszego filmu. */
const cardInfo = (items = []) => {
  const firstIsVideo = items[0]?.type === "video";
  for (const item of items) {
    if (item.type === "image") return { thumbnail: item.src, firstIsVideo };
    if (item.poster) return { thumbnail: item.poster, firstIsVideo };
  }
  return { thumbnail: null, firstIsVideo };
};

const thumbnails = JSON.parse(read("src/data/media-thumbnails.json"));
const chunkStats = { techniques: 0, glossary: 0 };
const chunkGroups = [
  ["techniques", techs.map((t) => t.id)],
  ["glossary", glossEntries.map((e) => e.id)],
];

for (const [section, ids] of chunkGroups) {
  const expectedIds = new Set(ids);
  const folder = join(root, "public/data", section);
  if (!existsSync(folder)) {
    critical.push(`Dane na żądanie — brak folderu public/data/${section}`);
    continue;
  }
  for (const file of readdirSync(folder)) {
    if (!file.endsWith(".json")) {
      critical.push(`Dane na żądanie — nieoczekiwany plik ${section}/${file}`);
    } else if (!expectedIds.has(basename(file, ".json"))) {
      critical.push(`Dane na żądanie — osierocony plik ${section}/${file}`);
    }
  }
  for (const id of ids) {
    const path = `public/data/${section}/${id}.json`;
    if (!existsSync(join(root, path))) {
      critical.push(`Dane na żądanie — brak ${path}`);
      continue;
    }
    let chunk;
    try {
      chunk = JSON.parse(read(path));
    } catch {
      critical.push(`Dane na żądanie — uszkodzony JSON ${path}`);
      continue;
    }
    chunkStats[section] += 1;
    const expectedMedia = media[section]?.[id] ?? [];
    const expectedDetail = section === "techniques" ? details.techniques[id] ?? null : details.stances[id] ?? null;
    if (JSON.stringify(chunk.media ?? []) !== JSON.stringify(expectedMedia))
      critical.push(`Dane na żądanie — ${section}/${id}: media nie zgadza się z media.json`);
    if (JSON.stringify(chunk.detail ?? null) !== JSON.stringify(expectedDetail ?? null))
      critical.push(`Dane na żądanie — ${section}/${id}: opis nie zgadza się z techniqueDetails.json`);
    if (JSON.stringify(thumbnails[section]?.[id] ?? null) !== JSON.stringify(cardInfo(expectedMedia)))
      critical.push(`Indeks miniaturek — ${section}/${id} nie zgadza się z media.json`);
  }
  for (const id of Object.keys(thumbnails[section] ?? {}))
    if (!expectedIds.has(id)) critical.push(`Indeks miniaturek — nieistniejący ${section}/${id}`);
}

// --- 4. levels.json (strukturalne wymagania ↔ atlas + słownik) ---------------

const techById = new Map(techs.map((t) => [t.id, t]));
const glossById = new Map(glossEntries.map((e) => [e.id, e]));
const levelByNumber = new Map(levels.map((l) => [l.number, l]));

if (uniq(levels.map((l) => l.id)) !== levels.length) critical.push("levels.json — zduplikowane id stopni");
if (uniq(levels.map((l) => l.number)) !== levels.length) critical.push("levels.json — zduplikowane number");
if (uniq(levels.map((l) => l.order)) !== levels.length) critical.push("levels.json — zduplikowane order");

const mismatches = [];
for (const l of levels) {
  if (!l.groups || l.groups.length === 0) critical.push("levels.json — \"" + l.id + "\" bez grup wymagań");
  if (l.fights !== null && (!Number.isInteger(l.fights) || l.fights < 0))
    critical.push("levels.json — \"" + l.id + "\" ma nieprawidłowe pole fights: " + JSON.stringify(l.fights));
  const seen = new Set();
  for (const g of l.groups ?? []) {
    if (!g.title) critical.push("levels.json — \"" + l.id + "\" ma grupę bez tytułu");
    for (const it of g.items ?? []) {
      let key;
      if (it && it.type === "technique") {
        if (!it.id || !it.id.trim()) critical.push("levels.json — \"" + l.id + "\" ma technikę bez id");
        else if (!techById.has(it.id)) critical.push("levels.json — \"" + l.id + "\" wskazuje nieistniejącą technikę \"" + it.id + "\"");
        else if (!techById.get(it.id).levels.includes(l.number))
          mismatches.push({ kyu: l.kyu, id: it.id, levels: [...techById.get(it.id).levels].sort((a, b) => b - a).join(", ") });
        key = "t:" + it.id;
      } else if (it && it.type === "glossary") {
        if (!it.id || !it.id.trim()) critical.push("levels.json — \"" + l.id + "\" ma hasło słownika bez id");
        else if (!glossById.has(it.id)) critical.push("levels.json — \"" + l.id + "\" wskazuje nieistniejące hasło \"" + it.id + "\"");
        else if (glossById.get(it.id).levels?.length && !glossById.get(it.id).levels.includes(l.number))
          mismatches.push({ kyu: l.kyu, id: it.id, levels: [...(glossById.get(it.id).levels ?? [])].sort((a, b) => b - a).join(", ") });
        key = "g:" + it.id;
      } else if (it && it.type === "text" && typeof it.text === "string" && it.text.trim()) {
        key = "x:" + it.text;
      } else {
        critical.push("levels.json — \"" + l.id + "\" ma nieprawidłowy element wymagania: " + JSON.stringify(it));
      }
      if (key) {
        if (seen.has(key)) critical.push("levels.json — \"" + l.id + "\" ma zduplikowane wymaganie (" + key + ")");
        seen.add(key);
      }
    }
  }
}
for (const m of mismatches)
  critical.push("P0.3 — \"" + m.id + "\" (levels=[" + m.levels + "]) wymagane w " + m.kyu + ", których nie ma w levels[]");

// --- 4b. Spójność belek (P0.4) ---
for (const l of levels) {
  const expected = l.stripe === null ? 0 : l.belt === "black" ? l.number - 10 : 1;
  const actual = l.stripes ?? (l.stripe ? 1 : 0);
  if (l.stripe === null && l.stripes != null) critical.push("P0.4 — \"" + l.id + "\" ma stripes bez stripe");
  else if (actual !== expected) critical.push("P0.4 — \"" + l.id + "\" (" + l.kyu + "): stripes=" + actual + ", oczekiwano " + expected);
}

const outsideRequirements = [];
for (const t of techs)
  for (const n of t.levels) {
    const l = levelByNumber.get(n);
    if (!l) continue;
    const refs = l.groups.flatMap((g) => g.items).filter((i) => i.type === "technique").map((i) => i.id);
    if (!refs.includes(t.id)) outsideRequirements.push(l.kyu + ": " + t.id);
  }
for (const o of outsideRequirements) warn.push("POZA WYMAGANIAMI — technika z atlasu nieuwzględniona w wymaganiach: " + o);

// --- 5. pokrycie i statystyki ----------------------------------------------

const coverage = levels.map((l) => {
  const items = l.groups.flatMap((g) => g.items);
  return {
    kyu: l.kyu,
    id: l.id,
    atlas: techs.filter((t) => t.levels.includes(l.number)).length,
    tech: items.filter((i) => i.type === "technique").length,
    gloss: items.filter((i) => i.type === "glossary").length,
    text: items.filter((i) => i.type === "text").length,
    fights: l.fights,
  };
});

const allItems = levels.flatMap((l) => l.groups.flatMap((g) => g.items.map((item) => ({ level: l, item }))));
const techItems = allItems.filter(({ item }) => item.type === "technique");
const glossItems = allItems.filter(({ item }) => item.type === "glossary");
const textItems = allItems.filter(({ item }) => item.type === "text");
const requiredTechIds = new Set(techItems.map(({ item }) => item.id));
const requiredGlossIds = new Set(glossItems.map(({ item }) => item.id));

const missingInAtlas = textItems.filter(({ item }) => /saiha|seienchin|ushiro-mawashi/i.test(item.text));

const withoutGallery = techs.filter((t) => !(media.techniques ?? {})[t.id]).length;
const allAliases = techs.flatMap((t) => t.aliases ?? []);

const dt = new Date().toISOString().slice(0, 10);
const lines = [];
const p = (...s) => lines.push(...s);

p(
  "# RAPORT.md — audyt danych KIHON",
  "",
  "> Generowany przez `node scripts/audit-danych.mjs` — nie edytuj ręcznie (data: " + dt + ").",
  "> Dane wejściowe: `src/data/techniques.json`, `levels.json`, `glossary.json`, `media.json`, `techniqueDetails.json`, `learning.json`,",
  "> `src/data/media-thumbnails.json`, `public/data/`, `src/data/index.ts` (CATEGORIES), zawartość `public/images/` (w tym `hero/`).",
  "",
  "## 1. Integralność struktury",
  "",
  critical.length
    ? "Krytyczne problemy: **" + critical.length + "**\n\n" + critical.map((c) => "- ❌ " + c).join("\n")
    : "Krytycznych problemów: **0** ✅ (id unikalne, obowiązkowe pola, kategorie ↔ `CATEGORIES`, `levels`∈0–15, słownik bez martwych `related`, `levels.json`: wymagania strukturalne wskazują istniejące techniki/haseła zgodne z P0.3, belki zgodne z stopniem P0.4).",
  "",
  "Ostrzeżenia: **" + warn.length + "**",
  "",
  "## 2. Pokrycie stopni",
  "",
  "| Stopień | Techniki w atlasie | Wymagania: techniki | Wymagania: postawy (slownik) | Wymagania: opisy | Walki |",
  "|---|---:|---:|---:|---:|---:|",
  ...coverage.map((c) => {
    const fightsStr = c.fights === null ? "\u2014" : String(c.fights);
    const parts = [c.kyu + " (" + c.id + ")", String(c.atlas), String(c.tech), String(c.gloss), String(c.text), fightsStr];
    return "| " + parts.join(" | ") + " |";
  }),
  "",
  "Zakres `levels[]` technik i numerów stopni: 0 (start) – 15 (5 dan).",
  "",
  "## 3. Spójność wymagań ↔ atlas (P0.3)",
  "",
  (mismatches.length || outsideRequirements.length)
    ? [
        mismatches.length ? "**Mismatches: " + mismatches.length + "** (krytyczne, sekcja 1)." : "",
        outsideRequirements.length
          ? "**Techniki poza wymaganiami: " + outsideRequirements.length + "** (ostrzeżenia):"
          : "",
        ...outsideRequirements.map((o) => "  - " + o),
      ].filter(Boolean).join("\n")
    : "Wszystkie techniki/haseła w wymaganiach mają właściwy stopień w `levels[]`, a każda technika z atlasu występuje w wymaganiach swojego stopnia ✅",
  "",
  "## 4. Kolizje aliasów",
  "",
  collisions.length
    ? collisions.map(([alias, ids]) => "- ⚠️ „" + alias + "\" → " + ids.length + " technik: " + ids.join(", ")).join("\n")
    : "Brak kolizji ✅ (aliasy to obecnie tylko metadane — aplikacja nie linkuje po aliasach, wymagania to referencje strukturalne).",
  "",
  "## 5. Pozycje wymagań bez techniki (typu `text` i `glossary`)",
  "",
  "**" + textItems.length + " / " + allItems.length + "** pozycji to opisy nielinkowane (etykieta, wiedza, próba).",
  "**" + glossItems.length + " / " + allItems.length + "** pozycji to linki do haseł słownika (postawy).",
  "",
  ...levels.flatMap((l) => {
    const texts = l.groups.flatMap((g) => g.items).filter((i) => i.type === "text");
    return texts.length ? ["- **" + l.kyu + "** (" + texts.length + "): " + texts.map((i) => i.text).join(" · ")] : [];
  }),
  "",
  ...levels.flatMap((l) => {
    const gloss = l.groups.flatMap((g) => g.items).filter((i) => i.type === "glossary");
    return gloss.length ? ["- **" + l.kyu + "** (" + gloss.length + "): " + gloss.map((i) => i.id).join(", ")] : [];
  }),
  "",
  missingInAtlas.length
    ? "\nZ tego braki w atlasie do zadania **P1.6**: " + missingInAtlas.map(({ item }) => "„" + item.text + "\"").join(", ") + "."
    : "",
  "",
  "## 6. Media i zdjęcia",
  "",
  "- martwe pola `image`/`video` w `techniques.json`: **" + legacyMediaIds.length + "/" + techs.length + "** ✅ (media wyłącznie w `media.json`)",
  "- zdjęcie Hero: **" + (existsSync(join(root, heroImage)) ? "lokalne `public/images/hero/osu-no-seishin.jpg`" : "BRAK") + "**; obrazy Unsplash w `src/`: **" + unsplashFiles.length + "**",
  "- techniki bez galerii (placeholder z kanji): **" + withoutGallery + "/" + techs.length + "**",
  "- galerie w `media.json`: **" + (mediaStats.techniques.sets + mediaStats.glossary.sets) + "** (techniki: " + mediaStats.techniques.sets + ", hasła słownika: " + mediaStats.glossary.sets + ")",
  "- materiały w galeriach: **" + (mediaStats.techniques.items + mediaStats.glossary.items) + "** (w tym filmy: " + (mediaStats.techniques.videos + mediaStats.glossary.videos) + ") — galerie od 2 elementów, bez górnego limitu filmów; wyjątki: techniki z 1 filmem i `seiken` z 1 zdjęciem; pliki w R2 albo w `public/`",
  "- dane na żądanie: **" + (chunkStats.techniques + chunkStats.glossary) + "** plików w `public/data/` (techniki: " + chunkStats.techniques + ", hasła: " + chunkStats.glossary + "); kafelki czytają tylko `media-thumbnails.json`, galerie i opisy wchodzą do bundle'u dopiero po otwarciu wpisu",
  "",
  "## 7. Statystyki",
  "",
  "- poradniki: **" + learning.guides.length + "**, wydarzenia historyczne: **" + learning.timeline.length + "**, ciekawostki: **" + learning.facts.length + "** (kompletność treści i źródeł sprawdzona)",
  "- szczegóły technik: **" + Object.keys(details.techniques).length + "/" + techs.length + "**, szczegóły postaw: **" + Object.keys(details.stances).length + "/" + stanceEntries.length + "** (tłumaczenie, wszystkie człony nazwy, minimum dwie sekcje)",
  "- stopni: **" + levels.length + "** (start, 10–1 kyu, 1–5 dan)",
  "- technik łącznie: **" + techs.length + "**",
  "- technik powiązanych z wymaganiami: **" + requiredTechIds.size + "** (poza wymaganiami: " + (techs.length - requiredTechIds.size) + ")",
  "- haseł słownika w wymaganiach: **" + requiredGlossIds.size + "**",
  "- aliasów łącznie: **" + allAliases.length + "** (kolizje: " + collisions.length + ")",
  "- haseł słownika: **" + glossEntries.length + "** w " + glossary.categories.length + " kategoriach (" + glossary.categories.map((c) => c.name + ": " + c.entries.length).join(", ") + ")",
  "",
  "## 8. Rekomendacje",
  "",
  "1. **P1.6** — dopisać do atlasu Seienchin i Ushiro-mawashi-geri (sekcja 5).",
  "2. **P1.7** — hasła Rei/Osu/Bunkai/Kamae + linkowanie opisów wymagań do słownika (sekcja 5); infrastruktura `{type:\"glossary\"}` gotowa.",
  "3. **P1.1** — weryfikacja treści 16 stopni ze sensei (nazwy, zakres, staż, liczby walk).",
  "",
);

write("RAPORT.md", lines.join("\n"));

console.log("RAPORT.md zapisany (" + dt + ")");
console.log("  krytyczne: " + critical.length);
console.log("  ostrzeżenia: " + warn.length + " (" + collisions.length + " KOLIZJA, " + outsideRequirements.length + " POZA WYMAGANIAMI)");
console.log("  wymagania: " + techItems.length + " technik + " + glossItems.length + " haseł + " + textItems.length + " opisów");
if (warn.length) {
  for (const w of warn) console.log("  ! " + w);
}
if (critical.length) {
  for (const c of critical) console.error("  ✗ " + c);
  process.exit(1);
}
