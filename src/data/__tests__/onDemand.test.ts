import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import { getGlossaryCardMedia, getTechniqueCardMedia } from "@/data";
import { loadGlossaryData, loadTechniqueData } from "@/data/onDemand";

const here = dirname(fileURLToPath(import.meta.url));
const readJson = (path: string) => JSON.parse(readFileSync(join(here, path), "utf8"));

describe("dane pobierane z jednego pliku na wpis", () => {
  it("zwraca galerię i wiedzę techniki z tego samego chunku", async () => {
    const data = await loadTechniqueData("seiken-morote-tsuki");
    const source = readJson("../../content/techniques/seiken-morote-tsuki/index.json");

    expect(data.media.length).toBeGreaterThan(0);
    expect(data.knowledge).toEqual(source.knowledge);
    expect(data.knowledge?.translation).toBeTruthy();
  });

  it("zwraca wiedzę hasła słownika", async () => {
    const data = await loadGlossaryData("fudo");

    expect(data.media).toEqual([]);
    expect(data.knowledge?.translation).toBeTruthy();
  });

  it("pobiera plik tylko raz dla danego id", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockClear();

    await loadTechniqueData("seiken-oi-tsuki");
    await loadTechniqueData("seiken-oi-tsuki");

    const calls = fetchMock.mock.calls.filter(([input]) =>
      String(input).includes("data/techniques/seiken-oi-tsuki.json"),
    );
    expect(calls).toHaveLength(1);
  });

  it("przy błędzie sieci zwraca puste dane i pozwala spróbować ponownie", async () => {
    const fetchMock = vi.mocked(fetch);
    const id = "test-blad-sieci";

    fetchMock.mockImplementationOnce(async () => ({ ok: false, status: 500 }) as Response);
    expect(await loadTechniqueData(id)).toEqual({ media: [], knowledge: null });
    fetchMock.mockClear();
    await loadTechniqueData(id);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("indeks miniaturek nie wymaga pełnych galerii", () => {
    expect(getTechniqueCardMedia("seiken-morote-tsuki").thumbnail).toContain("/poster/");
    expect(getGlossaryCardMedia("seiken").thumbnail).toContain("/images/glossary/");
    expect(getTechniqueCardMedia("nie-ma-mnie")).toEqual({ thumbnail: null, firstIsVideo: false });
  });
});
