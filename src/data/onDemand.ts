import type { EntryData } from "./types";

const EMPTY: EntryData = { media: [], detail: null };
const cache = new Map<string, Promise<EntryData>>();

/** Pliki leżą w public/data/ — bazę aplikacji dodajemy tak samo jak dla obrazów. */
const load = (path: string): Promise<EntryData> => {
  const url = `${import.meta.env.BASE_URL}${path}`;
  const cached = cache.get(url);
  if (cached) return cached;

  const request = fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status} dla ${url}`);
      return response.json() as Promise<EntryData>;
    })
    .catch(() => {
      // Błąd sieci nie blokuje ponownej próby przy następnym otwarciu.
      cache.delete(url);
      return EMPTY;
    });

  cache.set(url, request);
  return request;
};

export const loadTechniqueData = (id: string): Promise<EntryData> =>
  load(`data/techniques/${encodeURIComponent(id)}.json`);

export const loadGlossaryData = (id: string): Promise<EntryData> =>
  load(`data/glossary/${encodeURIComponent(id)}.json`);

/** Podgrzanie cache'u przy najechaniu/focusie — kliknięcie jest wtedy natychmiastowe. */
export const prefetchTechnique = loadTechniqueData;
export const prefetchGlossary = loadGlossaryData;
