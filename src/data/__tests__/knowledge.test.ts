import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// W jsdom globalny URL jest implementacją przeglądarki — używamy ścieżek Node.
const here = dirname(fileURLToPath(import.meta.url));
const readJson = (path: string) => JSON.parse(readFileSync(join(here, path), "utf8"));

const knowledge = "../knowledge";
const contentRoot = "../../content/techniques";
const techniqueIds: string[] = readJson(`${contentRoot}/index.json`);
const readTechnique = (id: string) => readJson(`${contentRoot}/${id}/index.json`);
const techniques = techniqueIds.map(readTechnique);

describe("jedno źródło wiedzy", () => {
  it("każda technika ma wiedzę w index.json i media w details.json", () => {
    expect(techniques.length).toBeGreaterThan(100);
    for (const technique of techniques) {
      expect(technique.id).toBeTruthy();
      expect(technique.knowledge.sections.length).toBeGreaterThanOrEqual(2);
      expect(technique).not.toHaveProperty("image");
      expect(technique).not.toHaveProperty("video");
      expect(technique).not.toHaveProperty("media");
      expect(technique).not.toHaveProperty("detail");
      expect(readJson(`${contentRoot}/${technique.id}/details.json`).media).toBeInstanceOf(Array);
    }
  });

  it("chunk techniki to dokładnie index.json + wygenerowane media", () => {
    for (const technique of techniques) {
      const chunk = readJson(`../../../public/data/techniques/${technique.id}.json`);
      const { media, ...entry } = chunk;
      expect(entry).toEqual(technique);
      expect(media.length).toBe(readJson(`${contentRoot}/${technique.id}/details.json`).media.length);
    }
  });

  it("lekki indeks zawiera te same ID bez wiedzy", () => {
    const atlas = readJson("../atlas.json");
    expect(atlas.techniques.map((item: { id: string }) => item.id)).toEqual(techniqueIds);
    expect(atlas.techniques.every((item: object) => !("knowledge" in item))).toBe(true);
  });

  it("postawy, ustawienia dłoni i ustawienia stopy są osobnymi domenami", () => {
    const residual = readJson(`${knowledge}/glossary.json`).categories;
    const categories = [
      ...residual,
      readJson(`${knowledge}/stances.json`),
      readJson(`${knowledge}/hand-positions.json`),
      readJson(`${knowledge}/foot-positions.json`),
    ];
    expect(residual.map((category: { id: string }) => category.id)).not.toContain("pozycje");
    expect(residual.map((category: { id: string }) => category.id)).not.toContain("ustawienia-dloni");
    expect(residual.map((category: { id: string }) => category.id)).not.toContain("ustawienia-stopy");
    expect(categories.flatMap((category: { entries: unknown[] }) => category.entries).length).toBe(68);

    const view = readJson("../atlas.json").glossary.categories;
    expect(view.map((category: { id: string }) => category.id)).toEqual([
      "strefy", "czesci-ciala", "pozycje", "ustawienia-dloni", "ustawienia-stopy",
      "dojo-etykieta", "trening-komendy", "stroj-sprzet",
    ]);
    expect(view.every((category: { entries: object[] }) => category.entries.every((entry) => !("knowledge" in entry)))).toBe(true);
  });

  it("haishu pozostaje osobną techniką i osobnym ustawieniem dłoni", () => {
    const technique = readTechnique("haishu");
    const hand = readJson(`${knowledge}/hand-positions.json`).entries.find((item: { id: string }) => item.id === "haishu");
    expect(hand).toBeDefined();
    expect(technique).toHaveProperty("knowledge");
    expect(hand).not.toHaveProperty("knowledge");
  });
});
