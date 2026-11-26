import mediaJson from "./media.json";
import techniqueDetailsJson from "./techniqueDetails.json";
import type { MediaItem, MediaManifest, TechniqueDetail } from "./types";

/**
 * Pełne dane synchroniczne. Używają ich tylko testy i narzędzia — aplikacja
 * pobiera galerie i opisy z public/data/ dopiero po otwarciu wpisu.
 */
export const media = mediaJson as MediaManifest;

export const getTechniqueMedia = (id: string): MediaItem[] => media.techniques[id] ?? [];
export const getGlossaryMedia = (id: string): MediaItem[] => media.glossary[id] ?? [];

const techniqueDetails: Record<string, TechniqueDetail> = techniqueDetailsJson.techniques;
const stanceDetails: Record<string, TechniqueDetail> = techniqueDetailsJson.stances;

export const getTechniqueDetail = (id: string): TechniqueDetail | undefined => techniqueDetails[id];
export const getStanceDetail = (id: string): TechniqueDetail | undefined => stanceDetails[id];
