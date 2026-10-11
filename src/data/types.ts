export type BeltId = "white" | "orange" | "blue" | "yellow" | "green" | "brown" | "black";

export type RequirementItem =
  | { type: "technique"; id: string }
  | { type: "glossary"; id: string }
  | { type: "text"; text: string };

export interface RequirementGroup {
  title: string;
  items: RequirementItem[];
}

export interface Level {
  id: string;
  kyu: string;
  number: number;
  order: number;
  belt: BeltId;
  color: string;
  stripe: string | null;
  stripes?: number;
  level: string;
  time: string;
  intro: string;
  fights: number | null;
  groups: RequirementGroup[];
}

export interface Technique {
  id: string;
  name: string;
  japanese: string;
  reading: string;
  category: string;
  description: string;
  tags: string[];
  focus: string;
  levels: number[];
  aliases: string[];
  image: string;
  video: string | null;
}

export interface TechniqueDetail {
  translation: string;
  nameParts: { term: string; polish: string }[];
  sections: { title: string; body: string }[];
  note?: string;
}

export interface GlossaryEntry {
  id: string;
  term: string;
  japanese: string;
  reading: string;
  description: string;
  image: string | null;
  related: string[];
  levels?: number[];
}

export interface GlossaryCategory {
  id: string;
  name: string;
  description: string;
  entries: GlossaryEntry[];
  sources?: ContentSource[];
}

export interface DojoKunEntry {
  japanese: string;
  reading: string;
  polish: string;
}

export interface ContentSource {
  title: string;
  url: string;
}

export interface Guide {
  id: string;
  title: string;
  tag: string;
  intro: string;
  equipment: string;
  steps: { title: string; body: string }[];
  note: string;
  sources: ContentSource[];
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  body: string;
  sources: ContentSource[];
}
