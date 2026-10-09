import dojoKunJson from "./dojoKun.json";
import glossaryJson from "./glossary.json";
import levelsJson from "./levels.json";
import techniquesJson from "./techniques.json";
import type { BeltId, DojoKunEntry, GlossaryCategory, GlossaryEntry, Level, RequirementItem, Technique } from "./types";

const mapRequirementItem = (item: { type: string; id?: string; text?: string }): RequirementItem =>
  item.type === "technique" && item.id !== undefined
    ? { type: "technique", id: item.id }
    : item.type === "glossary" && item.id !== undefined
      ? { type: "glossary", id: item.id }
      : { type: "text", text: item.text ?? "" };

export const levels: Level[] = levelsJson.map((level) => ({
  ...level,
  belt: level.belt as BeltId,
  fights: level.fights ?? null,
  groups: level.groups.map((group) => ({ ...group, items: group.items.map(mapRequirementItem) })),
}));
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

export const STANCE_CATEGORY_ID = "pozycje";

export const getStanceEntries = (): GlossaryEntry[] => {
  const category = glossary.find((c) => c.id === STANCE_CATEGORY_ID);
  return category?.entries ?? [];
};

export const filterStances = (query: string, levelNumber: number | null): GlossaryEntry[] => {
  const entries = getStanceEntries();
  return entries.filter((entry) => {
    const hasLevel = levelNumber === null || (entry.levels?.length ? entry.levels.includes(levelNumber) : false);
    const matchesQuery =
      query === "" ||
      `${entry.term} ${entry.japanese} ${entry.reading} ${entry.description}`.toLowerCase().includes(query.toLowerCase());
    return hasLevel && matchesQuery;
  });
};

export type AtlasItem =
  | { kind: "technique"; technique: Technique }
  | { kind: "stance"; entry: GlossaryEntry; category: GlossaryCategory };

export const filterAtlas = (category: string, query: string, levelNumber: number | null): AtlasItem[] => {
  const results: AtlasItem[] = [];
  const stanceCategory = glossary.find((c) => c.id === STANCE_CATEGORY_ID);

  if (category === "Pozycje" || category === "Wszystkie") {
    const stances = filterStances(query, levelNumber);
    if (stanceCategory) {
      for (const entry of stances) {
        results.push({ kind: "stance", entry, category: stanceCategory });
      }
    }
  }

  if (category !== "Pozycje") {
    const techs = filterTechniques(techniques, category, query, levelNumber);
    for (const technique of techs) {
      results.push({ kind: "technique", technique });
    }
  }

  return results;
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