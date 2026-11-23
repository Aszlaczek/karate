import { describe, expect, it } from "vitest";
import { getGlossaryMedia, getTechniqueMedia } from "@/data";
import { getMediaThumbnail } from "@/features/technique/components/media";

describe("galerie mediów", () => {
  it("udostępnia galerię techniki z posterem jako miniaturą karty", () => {
    const items = getTechniqueMedia("seiken-morote-tsuki");

    expect(items).toHaveLength(2);
    expect(items[0].type).toBe("video");
    expect(items[0].alt).toContain("przykład do zastąpienia");
    expect(getMediaThumbnail(items)).toBe(items[0].poster);
  });

  it("udostępnia galerię postawy z filmem i zdjęciem", () => {
    const items = getGlossaryMedia("fudo");

    expect(items.map((item) => item.type)).toEqual(["video", "image"]);
  });
});
