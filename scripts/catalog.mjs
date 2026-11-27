import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, extname, join } from "node:path";

/**
 * Katalog R2 nie jest już plikiem do edycji. Powstaje w pamięci z Folderów
 * technik: <id>/index.json (wiedza) i <id>/details.json (filmy).
 */
export const CONTENT = "src/content/techniques";
export const MEDIA_CONFIG = "src/data/media-config.json";

const ID = /^[a-z0-9-]{2,}$/;
const STEM = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const ZONES = new Set(["jodan", "chudan", "gedan"]);

export const readJson = (root, path) => {
  const absolute = join(root, path);
  if (!existsSync(absolute)) throw new Error(`Brak ${path}`);
  return JSON.parse(readFileSync(absolute, "utf8"));
};

/** Jedyne miejsce z publicznym adresem R2 — bez sekretów i bez URL-i w danych. */
export const readBaseUrl = (root) => {
  const { baseUrl } = readJson(root, MEDIA_CONFIG);
  if (!baseUrl || !/^https:\/\/[^/]+\//.test(baseUrl)) {
    throw new Error(`${MEDIA_CONFIG}: nieprawidłowy baseUrl`);
  }
  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
};

/** Czyste dane autorskie: kolejność, karty, wiedza i listy filmów. */
export const readContent = (root) => {
  const order = readJson(root, `${CONTENT}/index.json`);
  if (!Array.isArray(order) || !order.length || new Set(order).size !== order.length) {
    throw new Error(`${CONTENT}/index.json: nieprawidłowa kolejność ID`);
  }
  const dir = join(root, CONTENT);
  const folders = readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  if (order.length !== folders.length || order.some((id) => !folders.includes(id))) {
    throw new Error(`${CONTENT}/index.json nie zgadza się z folderami technik`);
  }

  const errors = [];
  const techniques = order.map((id) => {
    const index = readJson(root, `${CONTENT}/${id}/index.json`);
    const details = readJson(root, `${CONTENT}/${id}/details.json`);
    if (!ID.test(id)) errors.push(`${id}: nieprawidłowe ID`);
    if (index.id !== id) errors.push(`${id}: index.json ma inne id (${index.id})`);
    if (!index.knowledge || !Array.isArray(index.knowledge.sections)) {
      errors.push(`${id}: brak knowledge.sections`);
    }
    if (!details || !Array.isArray(details.media)) errors.push(`${id}: brak tablicy media w details.json`);
    for (const [position, item] of (details?.media ?? []).entries()) {
      const label = `${id}/details.json[${position}]`;
      const stem = typeof item?.source === "string"
        ? basename(item.source, extname(item.source))
        : "";
      if (!STEM.test(stem) || item.source !== `${stem}.mp4`) {
        errors.push(`${label}: nieprawidłowe source "${item?.source}"`);
      }
      if (!item?.label || typeof item.label !== "string") errors.push(`${label}: brak label`);
      if (!item?.alt || typeof item.alt !== "string") errors.push(`${label}: brak alt`);
      if (item.zone !== undefined && !ZONES.has(item.zone)) errors.push(`${label}: nieprawidłowa strefa`);
    }
    return { id, index, details };
  });

  if (errors.length) throw new Error("Nieprawidłowa treść technik:\n - " + errors.slice(0, 20).join("\n - "));
  return { order, techniques };
};

/** Klucze R2 i źródła wyliczone wyłącznie z ID oraz nazwy pliku. */
export const catalogItem = (id, media) => {
  const stem = basename(media.source, extname(media.source));
  return {
    type: "video",
    key: `${id}/video/${stem}.mp4`,
    posterKey: `${id}/poster/${stem}.jpg`,
    source: `videos/${id}/video/${stem}.mp4`,
    label: media.label,
    alt: media.alt,
    ...(media.zone ? { zone: media.zone } : {}),
    ...(media.caption ? { caption: media.caption } : {}),
  };
};

export const buildCatalog = (content) => {
  const catalog = {};
  const errors = [];
  const seen = new Set();
  for (const { id, details } of content.techniques) {
    const items = [];
    for (const media of details.media) {
      const item = catalogItem(id, media);
      for (const key of [item.key, item.posterKey]) {
        if (seen.has(key)) errors.push(`powtórzony klucz ${key}`);
        seen.add(key);
      }
      items.push(item);
    }
    catalog[id] = { section: "techniques", items };
  }
  if (errors.length) throw new Error("Nieprawidłowy katalog mediów:\n - " + errors.join("\n - "));
  return catalog;
};

export const readCatalog = (root) => buildCatalog(readContent(root));

/** Zestawy kluczy potrzebne przy uploadzie, weryfikacji i usuwaniu. */
export const catalogKeys = (catalog) => {
  const ids = new Set(Object.keys(catalog));
  const activeIds = new Set();
  const r2Keys = new Set();
  const posterKeys = new Set();
  for (const [id, group] of Object.entries(catalog)) {
    if (!group.items.length) continue;
    activeIds.add(id);
    for (const item of group.items) {
      r2Keys.add(item.key);
      if (item.posterKey) posterKeys.add(item.posterKey);
    }
  }
  return {
    ids,
    activeIds,
    r2Keys,
    posterKeys,
    desiredKeys: new Set([...r2Keys, ...posterKeys]),
  };
};

/** Strażnik przed destrukcyjnymi operacjami na niekompletnym katalogu. */
export const assertCatalogComplete = (catalog) => {
  const { ids, desiredKeys } = catalogKeys(catalog);
  if (ids.size < 20 || desiredKeys.size < 100) {
    throw new Error(
      `Katalog jest niekompletny (${ids.size} grup, ${desiredKeys.size} kluczy R2) — odmawiam operacji destrukcyjnych.`,
    );
  }
};

/** Widok galerii techniki: gotowe URL-e dla aplikacji. */
export const buildMediaItems = (catalog, baseUrl) =>
  Object.fromEntries(
    Object.entries(catalog)
      .filter(([, group]) => group.items.length)
      .map(([id, group]) => [
        id,
        group.items.map((item) => ({
          type: item.type,
          src: `${baseUrl}${item.key}`,
          ...(item.zone ? { zone: item.zone } : {}),
          label: item.label,
          ...(item.alt ? { alt: item.alt } : {}),
          ...(item.caption ? { caption: item.caption } : {}),
          poster: `${baseUrl}${item.posterKey}`,
        })),
      ]),
  );
