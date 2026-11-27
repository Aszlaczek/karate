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
}

export interface TechniqueDetail {
  translation: string;
  nameParts: { term: string; polish: string }[];
  sections: { title: string; body: string }[];
  note?: string;
}

/** Typ materiału w galerii — rozróżnia filmy i zdjęcia w UI i w audycie. */
export type MediaKind = "video" | "image";

/** Strefa ciała rozpoznana z nazwy pliku; brak oznaczenia oznacza brak pola. */
export type MediaZone = "jodan" | "chudan" | "gedan";

export interface MediaItem {
  type: MediaKind;
  /** Ścieżka od "/" w public/ lub pełny adres URL. */
  src: string;
  /** Opcjonalna strefa: jōdan, chūdan albo gedan. */
  zone?: MediaZone;
  /** Krótka etykieta miniaturki (nie jest opisem dla czytnika ekranu). */
  label: string;
  /** Miniatura filmu — dzięki niej galeria nie ładuje kilku filmów naraz. */
  poster?: string;
  /** Opcjonalny, widoczny podpis pod odtwarzaczem. */
  caption?: string;
  /** Opis dla czytnika ekranu (`alt` obrazu / `aria-label` wideo). */
  alt?: string;
}

export interface MediaManifest {
  /** Klucz: id z techniques.json. */
  techniques: Record<string, MediaItem[]>;
  /** Klucz: id hasła z glossary.json (również postawy). */
  glossary: Record<string, MediaItem[]>;
}

/** To, czego kafelki potrzebują z galerii — bez pełnych opisów i URL-i filmów. */
export interface CardMedia {
  thumbnail: string | null;
  firstIsVideo: boolean;
}

export interface MediaThumbnails {
  techniques: Record<string, CardMedia>;
  glossary: Record<string, CardMedia>;
}

/** Zawartość jednego pliku z public/data/ — pobieranego po kliknięciu kafelka. */
export interface EntryData {
  media: MediaItem[];
  detail: TechniqueDetail | null;
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
