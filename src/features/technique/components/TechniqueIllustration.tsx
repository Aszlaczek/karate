import type { ReactElement } from "react";
import type { Technique } from "@/data/types";
import genaiImagesJson from "@/features/technique/data/genaiImages.json";

// Tymczasowe zdjęcia postaci (public/images/GenAI) — mapa id → ścieżka.
// Generowana ręcznie; technika bez wpisu dostaje placeholder z kanji.
const GENAI_IMAGES: Record<string, string> = genaiImagesJson as Record<string, string>;

export const resolveMediaSrc = (value: string): string =>
  value.startsWith("/")
    ? `${import.meta.env.BASE_URL}${value.slice(1)}`
    : value;

export const resolveTechniqueImage = (technique: Technique): string | null =>
  GENAI_IMAGES[technique.id] ?? null;

const renderMedia = (
  video: string,
  technique: Technique,
  controls: boolean,
): ReactElement => {
  const youtube = video.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/,
  );
  if (youtube) {
    return (
      <iframe
        className="technique-media"
        src={`https://www.youtube.com/embed/${youtube[1]}`}
        title={`Wideo: ${technique.name}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  const src = resolveMediaSrc(video);
  if (/\.(gif|webp|jpe?g|png)(\?|#|$)/i.test(video)) {
    return <img className="technique-media" src={src} alt={technique.name} />;
  }
  return <video className="technique-media" src={src} controls={controls} />;
};

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
      <div className="technique-media-frame">
        {renderMedia(technique.video, technique, controls)}
      </div>
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
