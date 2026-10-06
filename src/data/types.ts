export type BeltId = "white" | "orange" | "blue" | "yellow" | "green" | "brown" | "black";

export interface RequirementGroup {
  title: string;
  items: string[];
}

export interface Level {
  id: string;
  kyu: string;
  number: number;
  order: number;
  belt: BeltId;
  color: string;
  stripe: string | null;
  level: string;
  time: string;
  intro: string;
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
  infographic: string;
  image: string;
  video: string | null;
}

export interface GlossaryEntry {
  id: string;
  term: string;
  japanese: string;
  reading: string;
  description: string;
  image: string | null;
  related: string[];
}

export interface GlossaryCategory {
  id: string;
  name: string;
  description: string;
  entries: GlossaryEntry[];
}

export interface DojoKunEntry {
  japanese: string;
  reading: string;
  polish: string;
}
