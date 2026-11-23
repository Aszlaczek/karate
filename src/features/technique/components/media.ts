import type { MediaItem } from "@/data/types";

/** Ścieżki z public/ działają też pod ścieżką bazową GitHub Pages. */
export const resolveMediaSrc = (value: string): string =>
  value.startsWith("/")
    ? `${import.meta.env.BASE_URL}${value.slice(1)}`
    : value;

const YOUTUBE = /(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/;

export const youtubeId = (src: string): string | null => src.match(YOUTUBE)?.[1] ?? null;

/** Rozszerzenia obsługiwane przez <img>; reszta lokalnych plików to wideo. */
export const isImageSrc = (src: string): boolean =>
  /\.(gif|webp|jpe?g|png|svg)(\?|#|$)/i.test(src);

/** Miniatura karty: pierwszy dostępny obraz albo poster pierwszego filmu. */
export const getMediaThumbnail = (items: MediaItem[]): string | null => {
  for (const item of items) {
    if (item.type === "image") return item.src;
    if (item.poster) return item.poster;
  }
  return null;
};

export const isFirstMediaVideo = (items: MediaItem[]): boolean =>
  items[0]?.type === "video";
