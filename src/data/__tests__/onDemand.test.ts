import { describe, expect, it, vi } from "vitest";
import { getGlossaryCardMedia, getTechniqueCardMedia } from "@/data";
import { loadGlossaryData, loadTechniqueData } from "@/data/onDemand";
import { getGlossaryMedia, getTechniqueMedia } from "@/data/fullData";

describe("dane pobierane na żądanie", () => {
  it("zwraca galerię i opis wybranej techniki", async () => {
    const data = await loadTechniqueData("seiken-morote-tsuki");

    expect(data.media).toEqual(getTechniqueMedia("seiken-morote-tsuki"));
    expect(data.detail?.translation).toBeTruthy();
  });

  it("zwraca galerię i opis wybranego hasła", async () => {
    const data = await loadGlossaryData("fudo");

    expect(data.media).toEqual(getGlossaryMedia("fudo"));
    expect(data.detail).not.toBeNull();
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
    expect(await loadTechniqueData(id)).toEqual({ media: [], detail: null });
    fetchMock.mockClear();
    await loadTechniqueData(id);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("indeks miniaturek nie wymaga pełnych galerii", () => {
    expect(getTechniqueCardMedia("seiken-morote-tsuki").thumbnail).toContain("/poster/");
    expect(getGlossaryCardMedia("seiken").thumbnail).toContain("/seiken/image/");
    expect(getTechniqueCardMedia("nie-ma-mnie")).toEqual({
      thumbnail: null,
      firstIsVideo: false,
    });
  });
});
