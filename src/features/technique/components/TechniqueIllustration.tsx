import type { Technique } from "@/data/types";
import KanjiPlaceholder from "@/features/shared/components/KanjiPlaceholder";

interface TechniqueIllustrationProps {
  technique: Technique;
}

function TechniqueIllustration({ technique }: TechniqueIllustrationProps) {
  return (
    <KanjiPlaceholder
      className="technique-media-frame technique-visual-placeholder"
      kanji={technique.japanese}
      reading={technique.reading}
      decorative
    />
  );
}

export default TechniqueIllustration;
