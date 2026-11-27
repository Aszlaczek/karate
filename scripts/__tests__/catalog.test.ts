import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import {
  assertCatalogComplete,
  buildCatalog,
  buildMediaItems,
  catalogKeys,
  readBaseUrl,
  readCatalog,
  readContent,
} from "../catalog.mjs";
import { checkDeletionLimit, deletionLimit, planSync } from "../r2-ops.mjs";

const root = mkdtempSync(join(tmpdir(), "karate-content-"));
afterAll(() => rmSync(root, { recursive: true, force: true }));

const write = (path: string, value: unknown) => {
  const absolute = join(root, path);
  mkdirSync(join(absolute, ".."), { recursive: true });
  writeFileSync(absolute, JSON.stringify(value, null, 2) + "\n");
};
write("src/content/techniques/index.json", ["mae-geri", "bez-filmu"]);
write("src/content/techniques/mae-geri/index.json", {
  id: "mae-geri", name: "Mae geri", knowledge: { sections: [{ title: "Ruch", body: "..." }] },
});
write("src/content/techniques/mae-geri/details.json", {
  media: [{ source: "mae-geri-f1.mp4", label: "Przód 1", alt: "Nagranie z dojo", zone: "jodan" }],
});
write("src/content/techniques/bez-filmu/index.json", {
  id: "bez-filmu", name: "Bez filmu", knowledge: { sections: [{ title: "Ruch", body: "..." }] },
});
write("src/content/techniques/bez-filmu/details.json", { media: [] });
write("src/data/media-config.json", { baseUrl: "https://example.r2.dev/" });

describe("katalog wyprowadzony z folderów technik", () => {
  it("buduje klucze R2 i URL-e wyłącznie z ID oraz nazwy pliku", () => {
    const catalog = readCatalog(root);
    expect(catalog["mae-geri"].items[0]).toMatchObject({
      key: "mae-geri/video/mae-geri-f1.mp4",
      posterKey: "mae-geri/poster/mae-geri-f1.jpg",
      source: "videos/mae-geri/video/mae-geri-f1.mp4",
      label: "Przód 1",
      zone: "jodan",
    });
    const media = buildMediaItems(catalog, readBaseUrl(root));
    expect(media["mae-geri"][0].src).toBe("https://example.r2.dev/mae-geri/video/mae-geri-f1.mp4");
    expect(media["mae-geri"][0].poster).toBe("https://example.r2.dev/mae-geri/poster/mae-geri-f1.jpg");
    expect(media["bez-filmu"]).toBeUndefined();
  });

  it("liczy aktywne ID i klucze", () => {
    const keys = catalogKeys(readCatalog(root));
    expect(keys.ids.size).toBe(2);
    expect(keys.activeIds.size).toBe(1);
    expect(keys.desiredKeys.size).toBe(2);
    expect(() => assertCatalogComplete(readCatalog(root))).toThrow(/niekompletny/);
  });

  it("odrzuca nieprawidłowe źródło i powtórzony klucz", () => {
    write("src/content/techniques/mae-geri/details.json", {
      media: [
        { source: "mae-geri-f1.mp4", label: "Przód 1", alt: "Opis" },
        { source: "../mae-geri-f1.mp4", label: "Duplikat", alt: "Opis" },
      ],
    });
    expect(() => readContent(root)).toThrow(/nieprawidłowe source/);
    write("src/content/techniques/mae-geri/details.json", {
      media: [
        { source: "klip-f1.mp4", label: "A", alt: "Opis" },
        { source: "klip-f1.mp4", label: "B", alt: "Opis" },
      ],
    });
    expect(() => buildCatalog(readContent(root))).toThrow(/powtórzony klucz/);
    write("src/content/techniques/mae-geri/details.json", {
      media: [{ source: "mae-geri-f1.mp4", label: "Przód 1", alt: "Nagranie z dojo", zone: "jodan" }],
    });
  });

  it("czyta rzeczywistą treść projektu", () => {
    const real = readCatalog(process.cwd());
    expect(Object.keys(real).length).toBeGreaterThan(20);
    expect(catalogKeys(real).desiredKeys.size).toBeGreaterThan(100);
  });
});

describe("plan synchronizacji R2", () => {
  const videoKey = "mae-geri/video/mae-geri-f1.mp4";
  const posterKey = "mae-geri/poster/mae-geri-f1.jpg";

  it("wysyła brakujące klucze i usuwa tylko stare klucze w zakresie katalogu", () => {
    const plan = planSync({
      desiredKeys: new Set([videoKey, posterKey]),
      scopedIds: new Set(["mae-geri", "bez-filmu"]),
      remoteKeys: new Set([videoKey, "mae-geri/video/stare-f1.mp4", "inne-id/video/f2.mp4", ".DS_Store"]),
      buildRoot: "/build",
      exists: () => true,
    });
    expect(plan.uploads.map((item) => item.key)).toEqual([posterKey]);
    expect(plan.deletions).toEqual([".DS_Store", "mae-geri/video/stare-f1.mp4"]);
    expect(plan.errors).toEqual([]);
  });

  it("zgłasza brak przygotowanego pliku zamiast wysyłać cokolwiek", () => {
    const plan = planSync({
      desiredKeys: new Set([videoKey]),
      scopedIds: new Set(["mae-geri"]),
      remoteKeys: new Set(),
      buildRoot: "/build",
      exists: () => false,
    });
    expect(plan.uploads).toEqual([]);
    expect(plan.errors[0]).toContain("media:prepare");
  });

  it("ogranicza liczbę usunięć bez --force", () => {
    expect(deletionLimit(100)).toBe(20);
    expect(deletionLimit(1000)).toBe(50);
    expect(checkDeletionLimit(new Array(20).fill("k"), 100)).toBeNull();
    expect(checkDeletionLimit(new Array(21).fill("k"), 100)).toMatch(/przekracza bezpieczny limit/);
    expect(checkDeletionLimit(new Array(21).fill("k"), 100, true)).toBeNull();
  });
});
