import { readFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Literówki i warianty zapisu, które nie dają się wywnioskować z reguł. */
export const OVERRIDES = {
  "hiraken-mawashi-uchi-f2": "hira-ken-mawashi-uchi",
  "saiken-morote-tsuki-f1": "seiken-morote-tsuki",
  "uchi-hachi-ji-dachi-f1": "uchi-hachiji",
  //„jōdan-uke” jest aliasem seiken, ale tu nazwa pliku zaczyna się od kōken-uke.
  "koken-uke-jodan-f1": "koken-uke",
  "koken-uke-jodan-f1a": "koken-uke",
  "koken-uke-jodan-f2": "koken-uke",
  "koken-uke-jodan-f2a": "koken-uke",
  "koken-uke-jodan-s1": "koken-uke",
  "koken-uke-jodan-s2": "koken-uke",
};

/** Przykładowe nagrania, które nie trafiają do biblioteki. */
export const EXCLUDED_MEDIA_STEMS = new Set([
  "fudo-dachi-demo",
  "seiken-demo",
  "seiken-morote-tsuki-demo",
]);

/** Pliki, których nie da się jednoznacznie przypisać do wpisu w danych. */
export const UNRESOLVED_HINTS = [
  "IDK_1",
  "mae-tobi-geri1",
  "mae-tobi-geri2",
  "mae-tobi-geri3",
  "seiken-yodan-tsuki",
  "seiken-yodan-uke",
  "seiken-chudan-tsuki",
  "seiken-gedan-tsuki",
];

const SYNONYMS = {
  shote: "shotei",
  sanchi: "sanchin",
  musibi: "musubi",
  kotustu: "kokutsu",
  orochi: "oroshi",
  ganmen: "komekami",
  kaage: "keage",
  mai: "mae",
  hiraken: "hira ken",
  saiken: "seiken",
};

const MACRONS = { ā: "a", ī: "i", ū: "u", ō: "o", ē: "e" };

export const normalizeTokens = (value) =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[āīūōē]/g, (char) => MACRONS[char])
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((token) => SYNONYMS[token]?.split(/[^a-z0-9]+/)[0] ?? token)
    .flatMap((token) => token.split(/(?<=[a-z])(?=\d)/));

const VARIANT_PATTERNS = [
  /[_-](?:f|s|d|b)\d*a?$/i,
  /[_-]all$/i,
  /[_-]\d+$/i,
  /[_-]migi$/i,
  /[_-]+$/,
];

/** Nazwa pliku bez rozszerzenia i bez sufiksu opisującego ujęcie. */
export const baseStem = (name) => {
  let stem = name.replace(new RegExp(`${extname(name).replace(".", "\\.")}$`, "i"), "");
  for (let pass = 0; pass < 4; pass += 1) {
    const before = stem;
    for (const pattern of VARIANT_PATTERNS) stem = stem.replace(pattern, "");
    if (stem === before) break;
  }
  return stem;
};

/** Informacja o ujęciu używana do etykiet i altów. */
export const viewInfo = (name) => {
  const stem = name.replace(/\.[^.]+$/, "");
  const match = /(?:^|[_-])(f|s|d|b)(\d+)(a?)$/i.exec(stem);
  if (!match) return { label: "ujęcie", alt: "ujęcie" };
  const views = {
    f: ["widok z przodu", "widok z przodu"],
    s: ["widok z boku", "widok z boku"],
    d: ["detal", "zbliżenie na detal techniki"],
    b: ["ujęcie b", "dodatkowe ujęcie"],
  };
  const [label, alt] = views[match[1].toLowerCase()];
  return {
    label: `${label} ${match[2]}${match[3] ? "a" : ""}`,
    alt: `${alt} ${match[2]}${match[3] ? "a" : ""}`,
  };
};

export const describeMedia = (stem, title) => {
  const view = viewInfo(stem);
  return {
    label: `${title} — ${view.label}`,
    alt: `${title}: ${view.alt}. Nagranie z dojo.`,
  };
};

const overlap = (a, b) => {
  const setA = new Set(a);
  const setB = new Set(b);
  let shared = 0;
  for (const token of setA) if (setB.has(token)) shared += 1;
  return shared / Math.max(setA.size, setB.size, 1);
};

export const loadTargets = () => {
  const techniques = JSON.parse(readFileSync(join(root, "src/data/techniques.json"), "utf8"));
  const glossary = JSON.parse(readFileSync(join(root, "src/data/glossary.json"), "utf8"));
  const stanceIds = new Set(
    glossary.categories.find((category) => category.id === "pozycje")?.entries.map((entry) => entry.id) ?? [],
  );
  return {
    techniques,
    glossary,
    stanceIds,
    targets: [
      ...techniques.map((item) => ({
        id: item.id,
        section: "techniques",
        name: item.name,
        keys: [item.id, item.name, item.reading, ...(item.aliases ?? [])],
        priority: 1,
      })),
      ...glossary.categories.flatMap((category) =>
        category.entries.map((entry) => ({
          id: entry.id,
          section: "glossary",
          name: entry.term,
          keys: [entry.id, entry.term, entry.reading],
          priority: stanceIds.has(entry.id) ? 2 : 3,
        })),
      ),
    ],
  };
};

const scoreCandidate = (candidate, tokens) =>
  Math.max(
    0,
    ...candidate.keys.map((key) => {
      const keyTokens = normalizeTokens(key);
      if (!keyTokens.length) return 0;
      if (keyTokens.every((token) => tokens.includes(token)))
        return 100 - (tokens.length - keyTokens.length) * 2;
      if (tokens.every((token) => keyTokens.includes(token)))
        return 95 - (keyTokens.length - tokens.length) * 2;
      return overlap(tokens, keyTokens) * 75;
    }),
  );

/** Zwraca wpis danych dla nazwy pliku albo null, gdy dopasowanie jest niepewne. */
export const resolveId = (name, targets) => {
  const stem = name.replace(/\.[^.]+$/, "");
  if (OVERRIDES[stem]) {
    const exact = targets.find((candidate) => candidate.id === OVERRIDES[stem]);
    if (exact) return { ...exact, score: 200 };
  }
  if (UNRESOLVED_HINTS.some((hint) => stem.startsWith(hint))) return null;

  const tokens = normalizeTokens(baseStem(name));
  const ranked = targets
    .map((candidate) => ({ candidate, score: scoreCandidate(candidate, tokens) }))
    .filter((hit) => hit.score >= 75 && hit.score >= 0)
    .sort((a, b) => b.score - a.score || a.candidate.priority - b.candidate.priority);

  const best = ranked[0];
  if (!best) return null;
  if (ranked[1] && ranked[1].score === best.score && ranked[1].candidate.priority !== best.candidate.priority) {
    return { ...best.candidate, score: best.score };
  }
  // „Hira-ken mawashi” to potoczna wersja „hira-ken mawashi-uchi” — jeden człon mniej.
  const shortened = ranked.find(
    (hit) => hit.score >= 90 && tokens.every((token) => new Set(normalizeTokens(hit.candidate.name)).has(token)),
  );
  if (shortened && !shortened.candidate.keys.some((key) => normalizeTokens(key).every((t) => tokens.includes(t)))) {
    return { ...shortened.candidate, score: shortened.score };
  }
  return { ...best.candidate, score: best.score };
};

const VIEW_ORDER = { f: 0, s: 1, d: 2, b: 3 };

/** Kolejność wyboru: przód, bok, detal, potem pozostałe ujęcia. */
export const selectCandidates = (names, limit = 4) =>
  [...names]
    .sort((a, b) => {
      const infoA = /(?:^|[_-])(f|s|d|b)\d+/i.exec(a);
      const infoB = /(?:^|[_-])(f|s|d|b)\d+/i.exec(b);
      const rankA = infoA ? VIEW_ORDER[infoA[1].toLowerCase()] : 9;
      const rankB = infoB ? VIEW_ORDER[infoB[1].toLowerCase()] : 9;
      return rankA - rankB || a.localeCompare(b);
    })
    .slice(0, limit);

/** Klucz R2 niezależny od nazwy repo i ścieżki base. */
export const r2Key = (id, kind, stem) => `${id}/${kind}/${stem}`;
