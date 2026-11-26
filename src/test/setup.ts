import "@testing-library/jest-dom/vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// jsdom nie implementuje scrollTo — używane przez useScrollManager przy zmianie trasy.
Object.defineProperty(window, "scrollTo", { value: vi.fn(), writable: true });

const readJson = (path: string) =>
  JSON.parse(readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8"));

const media = readJson("../data/media.json");
const details = readJson("../data/techniqueDetails.json");

/** Odpowiednik plików z public/data/, generowanych przed buildem przez npm run data:chunks. */
vi.stubGlobal(
  "fetch",
  vi.fn(async (input: string | URL | Request) => {
    const match = /\/data\/(techniques|glossary)\/([^/?]+)\.json$/.exec(String(input));
    if (!match) return { ok: false, status: 404, json: async () => ({}) };

    const [, section, id] = match;
    const isTechnique = section === "techniques";
    const items = (isTechnique ? media.techniques[id] : media.glossary[id]) ?? [];
    const detail = isTechnique ? details.techniques[id] : details.stances[id];

    return {
      ok: true,
      status: 200,
      json: async () => ({ media: items, detail: detail ?? null }),
    };
  }),
);

afterEach(() => {
  cleanup();
});
