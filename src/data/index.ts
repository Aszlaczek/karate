import dojoKunJson from "./dojoKun.json";
import glossaryJson from "./glossary.json";
import levelsJson from "./levels.json";
import techniquesJson from "./techniques.json";
import type { BeltId, DojoKunEntry, GlossaryCategory, GlossaryEntry, Level, Technique } from "./types";

export const levels: Level[] = levelsJson.map((level) => ({ ...level, belt: level.belt as BeltId }));
export const techniques: Technique[] = techniquesJson;
export const glossary: GlossaryCategory[] = glossaryJson.categories;
export const dojoKun: DojoKunEntry[] = dojoKunJson;

export const BELT_NAMES: Record<BeltId, string> = {
  white: "Biały",
  orange: "Pomarańczowy",
  blue: "Niebieski",
  yellow: "Żółty",
  green: "Zielony",
  brown: "Brązowy",
  black: "Czarny",
};

export const CATEGORIES = ["Wszystkie", "Uderzenia", "Kopnięcia", "Bloki", "Pozycje", "Kumite", "Kata"] as const;

export const getLevel = (id?: string): Level | undefined => levels.find((level) => level.id === id);

export const getLevelByNumber = (number: number): Level | undefined =>
  levels.find((level) => level.number === number);

export const getNeighbourLevels = (order: number) => ({
  prev: levels.find((level) => level.order === order - 1),
  next: levels.find((level) => level.order === order + 1),
});

export const getTechniqueById = (id?: string): Technique | undefined =>
  techniques.find((technique) => technique.id === id);

export const getTechniquesForLevel = (number: number): Technique[] =>
  techniques.filter((technique) => technique.levels.includes(number));

export const getLevelsForTechnique = (technique: Technique): Level[] =>
  levels.filter((level) => technique.levels.includes(level.number));

export const filterTechniques = (items: Technique[], category: string, query: string, levelNumber: number | null): Technique[] =>
  items.filter(
    (technique) =>
      (category === "Wszystkie" || technique.category === category) &&
      (levelNumber === null || technique.levels.includes(levelNumber)) &&
      `${technique.name} ${technique.japanese} ${technique.reading} ${technique.description}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );

export const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const MACRONS: Record<string, string> = { "ā": "a", "ī": "i", "ū": "u", "ō": "o", "ē": "e" };
const VOWELS: Record<string, string> = { a: "ā", i: "ī", u: "ū", o: "ō", e: "ē" };

const foldMacrons = (value: string): string => value.replace(/[āīūōē]/g, (char) => MACRONS[char]);

export const normalizeAlias = (value: string): string =>
  foldMacrons(value.toLowerCase())
    .replace(/[\s\u2014-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const aliasPatternSource = (alias: string): string => {
  let source = "";
  let separator = false;
  const flushSeparator = () => {
    if (separator && source) source += "[\\s\u2014-]+";
    separator = false;
  };
  for (const char of alias) {
    const lower = foldMacrons(char.toLowerCase());
    if (lower in VOWELS) {
      flushSeparator();
      source += `[${lower}${VOWELS[lower]}]`;
    } else if (/[\s\u2014-]/.test(char)) {
      separator = true;
    } else {
      flushSeparator();
      source += escapeRegExp(char);
    }
  }
  const start = /^[\p{L}\p{N}]/u.test(alias) ? "(?<![\\p{L}\\p{N}-])" : "";
  const end = /[\p{L}\p{N}]$/u.test(alias) ? "(?![\\p{L}\\p{N}-])" : "";
  return start + source + end;
};

export const buildTechniqueLinkPattern = (): RegExp =>
  new RegExp(
    `(${[...new Set(techniques.flatMap((technique) => technique.aliases))]
      .sort((a, b) => b.length - a.length)
      .map(aliasPatternSource)
      .join("|")})`,
    "gi",
  );

export const findTechniqueByAlias = (value: string): Technique | undefined => {
  const needle = normalizeAlias(value);
  if (!needle) return undefined;
  return techniques.find((technique) =>
    technique.aliases.some((alias) => normalizeAlias(alias) === needle),
  );
};

export interface GlossaryLookup {
  entry: GlossaryEntry;
  category: GlossaryCategory;
}

export const getGlossaryEntry = (id?: string): GlossaryLookup | undefined => {
  if (!id) return undefined;
  for (const category of glossary) {
    const entry = category.entries.find((item) => item.id === id);
    if (entry) return { entry, category };
  }
  return undefined;
};

export const getRelatedTechniques = (entry: GlossaryEntry): Technique[] =>
  entry.related
    .map((id) => getTechniqueById(id))
    .filter((technique): technique is Technique => technique !== undefined);
