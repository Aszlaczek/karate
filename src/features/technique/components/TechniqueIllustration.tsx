import type { MediaItem, Technique } from "@/data/types";
import MediaFrame from "./MediaFrame";
import { isImageSrc } from "./media";

// Zachowane dla importerów w słowniku (GlossaryCard, GlossaryEntryModal).
export { resolveMediaSrc } from "./media";

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

  // Brak galerii — placeholder z kanji (wzór ze słownika).
  return (
    <div className="technique-media-frame technique-visual-placeholder">
      <span>{technique.japanese}</span>
      <small>{technique.reading}</small>
    </div>
  );
}

export default TechniqueIllustration;
