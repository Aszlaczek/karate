import type { Technique } from "@/data/types";

// Zachowane dla importerów w słowniku (GlossaryCard, GlossaryEntryModal).
export { resolveMediaSrc } from "./media";

interface TechniqueIllustrationProps {
  technique: Technique;
  controls?: boolean;
}

function TechniqueIllustration({ technique }: TechniqueIllustrationProps) {
  // Brak galerii — placeholder z kanji (wzór ze słownika).
  return (
    <div className="technique-media-frame technique-visual-placeholder">
      <span>{technique.japanese}</span>
      <small>{technique.reading}</small>
    </div>
  );
}

export default TechniqueIllustration;
