import "@testing-library/jest-dom/vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// jsdom nie implementuje scrollTo — używane przez useScrollManager przy zmianie trasy.
Object.defineProperty(window, "scrollTo", { value: vi.fn(), writable: true });

// Testy czytają dokładnie te chunki, które aplikacja pobiera po kliknięciu kafelka.
// npm run data:build (pretest) generuje je z src/content/techniques/ i src/data/knowledge/.
const here = dirname(fileURLToPath(import.meta.url));
vi.stubGlobal(
  "fetch",
  vi.fn(async (input: string | URL | Request) => {
    const match = /\/data\/(techniques|glossary)\/([^/?]+)\.json$/.exec(String(input));
    if (!match) return { ok: false, status: 404, json: async () => ({}) };

    const [, section, id] = match;
    try {
      const body = JSON.parse(readFileSync(join(here, `../../public/data/${section}/${id}.json`), "utf8"));
      return { ok: true, status: 200, json: async () => body };
    } catch {
      return { ok: false, status: 404, json: async () => ({}) };
    }
  }),
);

afterEach(() => {
  cleanup();
});
