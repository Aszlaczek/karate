import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadMediaEnv } from "../media-env.mjs";

const keys = ["R2_TEST_A", "R2_TEST_B", "R2_TEST_C"];
let folder: string | null = null;

afterEach(() => {
  for (const key of keys) delete process.env[key];
  delete process.env.R2_ENV_FILE;
  if (folder) rmSync(folder, { recursive: true, force: true });
  folder = null;
});

describe("ładowanie sekretów R2", () => {
  it("czyta plik wskazany przez R2_ENV_FILE i obsługuje cytaty oraz export", () => {
    folder = mkdtempSync(join(tmpdir(), "media-env-"));
    const file = join(folder, "secrets.env");
    writeFileSync(
      file,
      ["# komentarz", "R2_TEST_A=wartość", 'export R2_TEST_B="pełna wartość"', "R2_TEST_C='cudzysłowy'"].join("\n"),
    );
    process.env.R2_ENV_FILE = file;
    process.env.R2_TEST_A = "z środowiska";

    loadMediaEnv();

    expect(process.env.R2_TEST_A).toBe("z środowiska");
    expect(process.env.R2_TEST_B).toBe("pełna wartość");
    expect(process.env.R2_TEST_C).toBe("cudzysłowy");
  });

  it("nie zawodzi, gdy plik nie istnieje", () => {
    folder = mkdtempSync(join(tmpdir(), "media-env-"));
    process.env.R2_ENV_FILE = join(folder, "brak.env");

    expect(() => loadMediaEnv()).not.toThrow();
    expect(process.env.R2_TEST_B).toBeUndefined();
  });
});
