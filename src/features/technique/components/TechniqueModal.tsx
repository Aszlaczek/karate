import type { EntryData, Technique } from "@/data/types";
import { getLevelsForTechnique } from "@/data";
import { loadTechniqueData } from "@/data/onDemand";
import { useOnDemandData } from "@/hooks/useOnDemandData";
import MediaGallery from "@/features/technique/components/MediaGallery";
import TechniqueIllustration from "@/features/technique/components/TechniqueIllustration";
import EntryModalShell from "@/features/shared/components/EntryModalShell";
import Icon from "@/components/ui/Icon";

const EMPTY: EntryData = { media: [], knowledge: null };

const SAFETY_NOTE =
  "Ćwicz pod opieką instruktora. Zdjęcie poglądowe nie zastępuje korekty technicznej sensei. Programy egzaminacyjne mogą różnić się między organizacjami i dojo.";

const TechniqueModal = ({ technique, onClose }: { technique: Technique; onClose: () => void }) => {
  const { media, knowledge } = useOnDemandData(technique.id, loadTechniqueData, EMPTY);
  const levels = getLevelsForTechnique(technique);

  return (
    <EntryModalShell
      ariaLabel={`Szczegóły techniki ${technique.name}`}
      closeLabel="Zamknij szczegóły techniki"
      onClose={onClose}
      panelClassName="technique-detail-panel"
      category={technique.category}
      overline="Wizualizacja techniki"
      kanji={technique.japanese}
      eyebrow={`Atlas / ${technique.category}`}
      title={technique.name}
      reading={technique.reading}
      visual={
        media.length > 0 ? (
          <MediaGallery key={technique.id} items={media} title={technique.name} />
        ) : (
          <TechniqueIllustration technique={technique} />
        )
      }
      knowledge={knowledge}
      description={technique.description}
      beforeDetail={
        <div className="detail-levels" aria-label="Stopnie w programie atlasu">
          {levels.map((level) => <span key={level.id}>{level.kyu}</span>)}
        </div>
      }
      afterDetail={
        <div className="checkpoint">
          <Icon name="target" size={22} />
          <div><small>Najważniejszy punkt</small><strong>{technique.focus}</strong></div>
        </div>
      }
      safetyNote={SAFETY_NOTE}
    />
  );
};

export default TechniqueModal;
