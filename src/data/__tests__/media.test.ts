import { describe, expect, it } from "vitest";
import { getGlossaryCardMedia, getTechniqueCardMedia, glossary, techniques } from "@/data";
import { getGlossaryMedia, getTechniqueMedia, media } from "@/data/fullData";
import { getMediaThumbnail, isImageSrc, resolveMediaSrc } from "@/features/technique/components/media";

describe("galerie mediów", () => {
  it("nie trzyma obrazów i filmów w techniques.json", () => {
    for (const technique of techniques) {
      expect(technique).not.toHaveProperty("image");
      expect(technique).not.toHaveProperty("video");
    }
  });

  it("udostępnia galerię techniki z posterem jako miniaturą karty", () => {
    const items = getTechniqueMedia("seiken-morote-tsuki");

    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(items[0].type).toBe("video");
    expect(items[0].alt).toContain("Nagranie z dojo");
    expect(getMediaThumbnail(items)).toBe(items[0].poster);
    expect(getTechniqueCardMedia("seiken-morote-tsuki").thumbnail).toBe(getMediaThumbnail(items));
    expect(getTechniqueCardMedia("seiken-morote-tsuki").firstIsVideo).toBe(true);
  });

  it("nie udostępnia nagrań demo ani grafik GenAI", () => {
    const all = Object.values(media.techniques).flat().concat(Object.values(media.glossary).flat());

    expect(all.some((item) => /-demo\.(mp4|jpg)|GenAI/i.test(item.src))).toBe(false);
    expect(all.every((item) => item.src.startsWith("https://"))).toBe(true);
  });

  it("udostępnia seiken jako jedno zdjęcie pięści", () => {
    const items = getGlossaryMedia("seiken");

    expect(items.map((item) => item.type)).toEqual(["image"]);
    expect(items[0].src).toContain("/seiken/image/seiken-piesc.jpg");
    expect(getGlossaryCardMedia("seiken").thumbnail).toBe(items[0].src);
    expect(getGlossaryCardMedia("seiken").firstIsVideo).toBe(false);
  });

  it("udostępnia galerię postawy z filmem i zdjęciem", () => {
    const items = getGlossaryMedia("fudo");

    expect(items.map((item) => item.type)).toEqual(["video", "image"]);
  });

  it("podpisuje pozycje walki jako lewą i prawą stronę", () => {
    const items = getGlossaryMedia("kumite");

    expect(items).toHaveLength(2);
    expect(items[0].label).toContain("lewa");
    expect(items[1].label).toContain("prawa");
    expect(items[0].alt).toContain("lewa strona");
    expect(items[1].alt).toContain("prawa strona");
  });

  it("przypisuje zdjęcia human-parts do odpowiednich haseł", () => {
    const images = new Map(
      glossary.flatMap((category) => category.entries).map((entry) => [entry.id, entry.image]),
    );
    const expected = ["haito", "kakato", "chusoku", "haisoku", "teisoku", "hiza"];

    for (const id of expected) {
      expect(images.get(id)).toBe(`/images/glossary/human-parts/${id}.svg`);
    }
  });

  it("pozostawia pełne URL-e R2 bez dodawania bazy aplikacji", () => {
    const url = "https://pub-example.r2.dev/fudo/video/fudo-dachi-f1.mp4";

    expect(resolveMediaSrc(url)).toBe(url);
    expect(isImageSrc("https://pub-example.r2.dev/fudo/poster/fudo-dachi-f1.jpg")).toBe(true);
  });

  it("dodaje bazę aplikacji tylko do ścieżek lokalnych", () => {
    expect(resolveMediaSrc("/videos/fudo/video/fudo-dachi-f1.mp4")).toBe(
      `${import.meta.env.BASE_URL}videos/fudo/video/fudo-dachi-f1.mp4`,
    );
  });

  it("publikuje wszystkie nagrania i oznacza ich strefy", () => {
    const all = Object.values(media.techniques).flat().concat(Object.values(media.glossary).flat());
    const counts = Object.values(media.techniques).map((items) => items.filter((item) => item.type === "video").length);

    expect(Math.max(...counts)).toBeGreaterThan(4);
    for (const item of all) {
      if (item.zone !== undefined) expect(["jodan", "chudan", "gedan"]).toContain(item.zone);
    }
    expect(all.some((item) => item.zone === "jodan")).toBe(true);
    expect(all.some((item) => item.zone === "chudan")).toBe(true);
    expect(all.some((item) => item.zone === "gedan")).toBe(true);
  });
});
