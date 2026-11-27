import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { getGlossaryCardMedia, getTechniqueCardMedia, glossary, techniques } from "@/data";
import type { EntryData } from "@/data/types";
import { getMediaThumbnail, isImageSrc, resolveMediaSrc } from "@/features/technique/components/media";

const here = dirname(fileURLToPath(import.meta.url));
const readJson = (path: string) => JSON.parse(readFileSync(join(here, path), "utf8"));
const chunk = (id: string): EntryData => readJson(`../../../public/data/techniques/${id}.json`);
const mediaOf = (id: string) => chunk(id).media;
const allMedia = () => techniques.flatMap((technique) => mediaOf(technique.id));

describe("media wygenerowane z jednego miejsca", () => {
  it("nie trzyma pól medialnych w danych technik", () => {
    for (const technique of techniques) {
      expect(technique).not.toHaveProperty("image");
      expect(technique).not.toHaveProperty("video");
    }
  });

  it("publikuje techniki wyłącznie jako filmy z R2 i posterem", () => {
    const items = allMedia();
    expect(items.length).toBeGreaterThan(300);
    for (const item of items) {
      expect(item.type).toBe("video");
      expect(item.src).toMatch(/^https:\/\/[^/]+\/.+\/video\/.+\.mp4$/);
      expect(item.poster).toMatch(/^https:\/\/[^/]+\/.+\/poster\/.+\.jpg$/);
      expect(item.label).toBeTruthy();
      expect(item.alt).toBeTruthy();
    }
    expect(items.some((item) => /-demo\.|GenAI/i.test(item.src))).toBe(false);
  });

  it("nie powtarza kluczy i wyprowadza je z ID techniki", () => {
    const keys = allMedia().map((item) => item.src);
    expect(new Set(keys).size).toBe(keys.length);
    for (const item of allMedia()) {
      const id = item.src.split("/video/")[0].split("/").pop();
      expect(item.src.startsWith(item.poster!.replace(/\/poster\/.*$/, ""))).toBe(true);
      expect(techniques.some((technique) => technique.id === id)).toBe(true);
    }
  });

  it("używa postera jako miniatury karty", () => {
    const items = mediaOf("seiken-morote-tsuki");
    expect(getMediaThumbnail(items)).toBe(items[0].poster);
    expect(getTechniqueCardMedia("seiken-morote-tsuki")).toEqual({
      thumbnail: items[0].poster,
      firstIsVideo: true,
    });
  });

  it("oznacza strefy i rozróżnia warianty w podpisach", () => {
    const items = allMedia();
    expect(items.some((item) => item.zone === "jodan")).toBe(true);
    expect(items.some((item) => item.zone === "chudan")).toBe(true);
    expect(items.some((item) => item.zone === "gedan")).toBe(true);
    for (const item of items) {
      if (item.zone !== undefined) expect(["jodan", "chudan", "gedan"]).toContain(item.zone);
    }
    expect(mediaOf("mae-geri-chudan").some((item) => item.label.includes("(kakato)"))).toBe(true);
    expect(mediaOf("seiken-jodan-uke").some((item) => item.label.includes("(jūji)"))).toBe(true);
    for (const id of ["mawashi-geri-chudan-chusoku", "mawashi-geri-chudan-haisoku"]) {
      const variant = id.endsWith("chusoku") ? "chūsoku" : "haisoku";
      const labels = mediaOf(id).map((item) => item.label);
      expect(labels.length).toBeGreaterThan(0);
      expect(labels.every((label) => label.includes(`(${variant})`))).toBe(true);
    }
  });

  it("zachowuje ustalone galerie technik", () => {
    expect(mediaOf("haishu")).toHaveLength(5);
    expect(mediaOf("jodan-uchi-haisoku-geri")).toHaveLength(3);
    expect(mediaOf("ippon-kumite-10-1-kyu")).toHaveLength(2);
    expect(techniques.some((item) => item.id === "mawashi-geri-chudan-chusoku-haisoku")).toBe(false);
  });

  it("słownik ma jedno lokalne zdjęcie z wiedzy, bez galerii", () => {
    const entries = glossary.flatMap((category) => category.entries);
    for (const entry of entries) {
      expect(getGlossaryCardMedia(entry.id).thumbnail).toBe(entry.image);
      expect(getGlossaryCardMedia(entry.id).firstIsVideo).toBe(false);
    }
    expect(entries.find((entry) => entry.id === "sokuto")?.image).toBe(
      "/images/glossary/human-parts/sokuto.svg",
    );
    expect(entries.find((entry) => entry.id === "seiken")?.image).toBe(
      "/images/glossary/human-parts/seiken-piesc.jpg",
    );
  });

  it(" zachowuje zasady adresów URL", () => {
    const url = "https://pub-example.r2.dev/fudo/video/fudo-dachi-f1.mp4";
    expect(resolveMediaSrc(url)).toBe(url);
    expect(isImageSrc(url.replace(".mp4", ".jpg"))).toBe(true);
    expect(resolveMediaSrc("/images/glossary/stances/fudo.png")).toBe(
      `${import.meta.env.BASE_URL}images/glossary/stances/fudo.png`,
    );
  });
});
