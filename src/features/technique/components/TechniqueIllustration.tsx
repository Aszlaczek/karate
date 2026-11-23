import type { MediaItem, Technique } from "@/data/types";
import genaiImagesJson from "@/features/technique/data/genaiImages.json";
import MediaFrame from "./MediaFrame";
import { isImageSrc, resolveMediaSrc } from "./media";

// Zachowane dla importerów w słowniku (GlossaryCard, GlossaryEntryModal).
export { resolveMediaSrc } from "./media";

// Tymczasowe zdjęcia postaci (public/images/GenAI) — mapa id → ścieżka.
// Generowana ręcznie; technika bez wpisu dostaje placeholder z kanji.
const GENAI_IMAGES: Record<string, string> = genaiImagesJson as Record<string, string>;

export const resolveTechniqueImage = (technique: Technique): string | null =>
  GENAI_IMAGES[technique.id] ?? null;

/** Legacy pole `video` traktujemy jak jednoelementową galerię. */
const legacyMediaItem = (video: string, technique: Technique): MediaItem => ({
  type: isImageSrc(video) ? "image" : "video",
  src: video,
  label: technique.name,
  alt: technique.name,
});

interface TechniqueIllustrationProps {
  technique: Technique;
  controls?: boolean;
}

function TechniqueIllustration({
  technique,
  controls = true,
}: TechniqueIllustrationProps) {
  if (technique.video) {
    return (
      <MediaFrame
        item={legacyMediaItem(technique.video, technique)}
        title={technique.name}
        controls={controls}
      />
    );
  }

  const image = resolveTechniqueImage(technique);

  if (image) {
    return (
      <div className="technique-media-frame technique-photo-frame">
        <img
          className="technique-media"
          src={resolveMediaSrc(image)}
          alt={technique.name}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  // Brak zdjęcia — placeholder z kanji (wzór ze słownika).
  return (
    <div className="technique-media-frame technique-visual-placeholder">
      <span>{technique.japanese}</span>
      <small>{technique.reading}</small>
    </div>
  );
}

export default TechniqueIllustration;
