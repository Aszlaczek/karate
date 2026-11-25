import { existsSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Wczytuje sekrety R2 z lokalnego pliku (domyślnie `.env.r2`).
 * Zmienne już ustawione w środowisku — np. GitHub Secrets w workflow — mają
 * zawsze pierwszeństwo. `R2_ENV_FILE` pozwala wskazać inny plik.
 */
export const loadMediaEnv = () => {
  const configured = process.env.R2_ENV_FILE;
  const file = configured
    ? isAbsolute(configured) ? configured : resolve(root, configured)
    : join(root, ".env.r2");
  if (!existsSync(file)) return;

  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(trimmed);
    if (!match) continue;
    const [, key, raw] = match;
    let value = raw.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
};
