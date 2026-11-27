import { describe, expect, it } from "vitest";
import {
  baseStem,
  describeMedia,
  loadTargets,
  normalizeTokens,
  resolveId,
  r2Key,
  selectCandidates,
  sourceFolderFor,
  surfaceTokenFor,
  variantLabel,
  viewInfo,
  zoneOf,
} from "../media-map.mjs";

const { targets } = loadTargets();

describe("mapowanie nagrań", () => {
  it("normalizuje makrony, diakrytyki i literówki z nazw plików", () => {
    expect(normalizeTokens("Kōkutsu-dachi")).toEqual(["kokutsu", "dachi"]);
    expect(normalizeTokens("kaage")).toEqual(["keage"]);
    expect(normalizeTokens("mae-tobi-geri1")).toEqual(["mae", "tobi", "geri", "1"]);
  });

  it("odcina sufiks ujęcia przed dopasowaniem", () => {
    expect(baseStem("yoko-geri-chudan-f2.MP4")).toBe("yoko-geri-chudan");
    expect(baseStem("hira-ken-mawashi-s1a.mp4")).toBe("hira-ken-mawashi");
  });

  it("przypisuje techniki, postawy i hasła słownika", () => {
    expect(resolveId("mawashi-geri-jodan-haisoku-f2.MP4", targets)?.id).toBe("mawashi-geri-jodan-haisoku");
    expect(resolveId("mawashi-geri-chudan-chusoku-f1.MP4", targets)?.id).toBe("mawashi-geri-chudan-chusoku");
    expect(resolveId("haishu-chudan-f1.MP4", targets)).toMatchObject({ id: "haishu", section: "techniques" });
    expect(resolveId("fudo-dachi-f1.MP4", targets)).toMatchObject({ id: "fudo", section: "glossary" });
    expect(resolveId("kamae-s1.MP4", targets)?.id).toBe("kamae");
    // Prefiks „koken uke” wygrywa z aliasem „jodan-uke” techniki seiken.
    expect(resolveId("koken-uke-jodan-f1.MP4", targets)?.id).toBe("koken-uke");
  });

  it("poprawia oczywiste literówki przez nadpisania", () => {
    expect(resolveId("hiraken-mawashi-uchi-f2.MP4", targets)?.id).toBe("hira-ken-mawashi-uchi");
    expect(resolveId("uchi-hachi-ji-dachi-f1.MP4", targets)?.id).toBe("uchi-hachiji");
  });

  it("czyta podzielone techniki z jednego folderu archiwum", () => {
    expect(sourceFolderFor("mawashi-geri-jodan-haisoku")).toBe("mawashi-geri-jodan-chusoku-haisoku");
    expect(sourceFolderFor("mawashi-geri-chudan-chusoku")).toBe("mawashi-geri-chudan-chusoku-haisoku");
    expect(surfaceTokenFor("mawashi-geri-jodan-haisoku")).toBe("haisoku");
    expect(surfaceTokenFor("mawashi-geri-chudan-chusoku")).toBe("chusoku");
    expect(sourceFolderFor("jodan-uchi-haisoku-geri")).toBe("uchi-mawashi-geri-jodan");
    expect(resolveId("uchi-mawashi-geri-jodan-f1.MP4", targets)?.id).toBe("jodan-uchi-haisoku-geri");
  });

  it("pozostawia pliki bez pewnego przypisania nieprzypisane", () => {
    for (const name of [
      "IDK_1.MP4",
      "mae-tobi-geri1-s1.MP4",
      "seiken-yodan-uke-f1.MP4",
      "seiken-chudan-tsuki-f1.MP4",
    ]) {
      expect(resolveId(name, targets)).toBeNull();
    }
  });

  it("wybiera ujęcia w kolejności przód, bok, detal, z podanym limitem", () => {
    expect(selectCandidates(["f2", "s1", "f1", "d1", "extra", "s2"], 4)).toEqual([
      "f1",
      "f2",
      "s1",
      "s2",
    ]);
  });

  it("domyślnie wybiera wszystkie ujęcia", () => {
    expect(selectCandidates(["s1", "f2", "f1", "d1", "f3"])).toEqual([
      "f1",
      "f2",
      "f3",
      "s1",
      "d1",
    ]);
  });

  it("rozpoznaje strefę tylko z nazwy pliku", () => {
    expect(zoneOf("shotei-uchi-jodan-f1.mp4")).toBe("jodan");
    expect(zoneOf("koken-uke-chudan-f2.mp4")).toBe("chudan");
    expect(zoneOf("koken-uke-gedan-f1.mp4")).toBe("gedan");
    expect(zoneOf("shotei-uchi-f1.mp4")).toBeNull();
    expect(zoneOf("mae-geri-jodan-f1.mp4")).toBe("jodan");
  });

  it("tworzy etykiety i klucze R2 z sufiksu", () => {
    expect(viewInfo("waza-s2.mp4")).toEqual({
      label: "widok z boku 2",
      alt: "widok z boku 2",
    });
    expect(describeMedia("waza-f1.mp4", "Waza").label).toBe("Waza — widok z przodu 1");
    expect(r2Key("fudo", "poster", "fudo-dachi-f1")).toBe("fudo/poster/fudo-dachi-f1");
  });

  it("dopisuje wariant z nazwy pliku do etykiety i altu", () => {
    expect(variantLabel("mae-geri-kakato-chudan-f1.mp4")).toBe("kakato");
    expect(variantLabel("mae-geri-chusoku-chudan-f1.mp4")).toBe("chūsoku");
    expect(variantLabel("seiken-juji-uke-jodan-f1.mp4")).toBe("jūji");
    expect(variantLabel("shotei-uke-jodan-f1.mp4")).toBe("shōtei");
    expect(variantLabel("oroshi-soto-geri-kakato-f1.MP4")).toBe("kakato");
    expect(variantLabel("seiken-morote-uchi-uke-f1.mp4")).toBe("morote");
    expect(variantLabel("ippon-kumite10-f1.MP4")).toBeNull();

    expect(describeMedia("mae-geri-kakato-chudan-f1.mp4", "Mae-geri chūdan chūsoku")).toEqual({
      label: "Mae-geri chūdan chūsoku (kakato) — widok z przodu 1",
      alt: "Mae-geri chūdan chūsoku (kakato): widok z przodu 1. Nagranie z dojo.",
    });
  });

  it("nie powtarza wariantu, który jest już w nazwie techniki", () => {
    expect(describeMedia("mawashi-geri-haisoku-jodan-f1.mp4", "Mawashi-geri jōdan (haisoku)")).toEqual({
      label: "Mawashi-geri jōdan (haisoku) — widok z przodu 1",
      alt: "Mawashi-geri jōdan (haisoku): widok z przodu 1. Nagranie z dojo.",
    });
    expect(describeMedia("uchi-mawashi-geri-jodan-f1.mp4", "Jōdan uchi haisoku-geri").label)
      .toContain("Jōdan uchi haisoku-geri —");
  });
});
