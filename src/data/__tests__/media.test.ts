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

  it("publikuje techniki jako filmy, a słownik jako lokalne obrazy", () => {
    for (const items of Object.values(media.techniques)) {
      expect(items.every((item) => item.type === "video" && item.src.startsWith("https://"))).toBe(true);
    }
    for (const items of Object.values(media.glossary)) {
      expect(items.length).toBeGreaterThan(0);
      expect(items.every((item) => item.type === "image" && item.src.startsWith("/images/glossary/"))).toBe(true);
    }
    expect(media.techniques["mae-kakato-geri"]).toBeUndefined();
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
    expect(Object.values(media.techniques).flat().every((item) => item.src.startsWith("https://"))).toBe(true);
  });

  it("udostępnia seiken jako jedno zdjęcie pięści", () => {
    const items = getGlossaryMedia("seiken");

    expect(items.map((item) => item.type)).toEqual(["image"]);
    expect(items[0].src).toBe("/images/glossary/human-parts/seiken-piesc.jpg");
    expect(getGlossaryCardMedia("seiken").thumbnail).toBe(items[0].src);
    expect(getGlossaryCardMedia("seiken").firstIsVideo).toBe(false);
  });

  it("udostępnia postawę jako lokalne zdjęcie", () => {
    const items = getGlossaryMedia("fudo");

    expect(items.map((item) => item.type)).toEqual(["image"]);
    expect(items[0].src).toBe("/images/glossary/stances/Fudo-Dachi.png");
  });

  it("udostępnia kumite jako galerię, a haishu jako zdjęcie karty słownika", () => {
    expect(getGlossaryMedia("kumite")).toMatchObject([
      { type: "image", src: "/images/glossary/trening-komendy/kumite.jpg" },
    ]);
    const haishu = glossary.flatMap((category) => category.entries).find((entry) => entry.id === "haishu");
    expect(haishu?.image).toBe("/images/glossary/ustawienia-dloni/haishu.jpg");
    expect(getGlossaryMedia("haishu")).toHaveLength(0);
    expect(getTechniqueMedia("haishu")).toHaveLength(5);
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

  it("rozróżnia warianty ustawienia stopy i dłoni w podpisach", () => {
    const labels = getTechniqueMedia("mae-geri-chudan").map((item) => item.label);

    expect(labels.some((label) => label.includes("(kakato)"))).toBe(true);
    expect(labels.some((label) => label.includes("(chūsoku)"))).toBe(true);
    expect(getTechniqueMedia("seiken-jodan-uke").some((item) => item.label.includes("(jūji)"))).toBe(true);
    expect(getTechniqueMedia("oroshi-soto-kakato-geri").every((item) => item.label.includes("(kakato)"))).toBe(true);
    for (const id of ["mawashi-geri-chudan-chusoku", "mawashi-geri-chudan-haisoku", "mawashi-geri-jodan-chusoku", "mawashi-geri-jodan-haisoku"]) {
      const labels = getTechniqueMedia(id).map((item) => item.label);
      const variant = id.endsWith("chusoku") ? "chūsoku" : "haisoku";
      expect(labels.length).toBeGreaterThan(0);
      expect(labels.every((label) => label.includes(`(${variant})`))).toBe(true);
      expect(labels.some((label) => label.includes(`(${variant}) (${variant})`))).toBe(false);
    }
  });

  it("publikuje nowe nagrania z archiwum", () => {
    for (const id of ["ippon-kumite-10-1-kyu", "oroshi-soto-kakato-geri", "yoko-tobi-geri"]) {
      const items = getTechniqueMedia(id);
      expect(items.filter((item) => item.type === "video")).toHaveLength(2);
      expect(items[0].poster).toBeTruthy();
    }
  });

  it("publikuje podzielone techniki i nowe galerie", () => {
    const counts = {
      "mawashi-geri-chudan-chusoku": 2,
      "mawashi-geri-chudan-haisoku": 4,
      "mawashi-geri-jodan-chusoku": 4,
      "mawashi-geri-jodan-haisoku": 4,
    };
    for (const [id, count] of Object.entries(counts)) {
      expect(getTechniqueMedia(id)).toHaveLength(count);
    }
    const uchi = getTechniqueMedia("jodan-uchi-haisoku-geri");
    expect(uchi).toHaveLength(3);
    expect(uchi.every((item) => item.zone === "jodan")).toBe(true);
    expect(uchi.every((item) => item.label.includes("Jōdan uchi haisoku-geri"))).toBe(true);

    expect(getTechniqueMedia("haishu")).toHaveLength(5);
    expect(getGlossaryMedia("haishu")).toHaveLength(0);
    expect(techniques.some((item) => item.id === "mawashi-geri-chudan-chusoku-haisoku")).toBe(false);
  });
});
