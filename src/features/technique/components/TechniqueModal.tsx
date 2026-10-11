import type { Technique } from "@/data/types";
import { getLevelsForTechnique, getTechniqueDetail } from "@/data";
import Icon from "@/components/ui/Icon";
import TechniqueIllustration from "@/features/technique/components/TechniqueIllustration";
import TechniqueDetailContent from "@/features/technique/components/TechniqueDetailContent";
import { useModalBase } from "@/hooks/useModalBase";

const TechniqueModal = ({ technique, onClose }: { technique: Technique; onClose: () => void }) => {
  const { onBackdropMouseDown } = useModalBase(onClose);
  const detail = getTechniqueDetail(technique.id);
  const levels = getLevelsForTechnique(technique);

  return (
    <div className="tech-modal" role="dialog" aria-modal="true" aria-label={`Szczegóły techniki ${technique.name}`} onMouseDown={onBackdropMouseDown}>
      <div className="tech-modal-panel technique-detail-panel">
        <button className="modal-close" aria-label="Zamknij szczegóły techniki" onClick={onClose}><Icon name="close" /></button>
        <div className="visualization-stage">
          <div className="visualization-topline">
            <span>{technique.category}</span>
            <small>Wizualizacja techniki</small>
          </div>
          <TechniqueIllustration technique={technique} />
        </div>
        <div className="visualization-copy">
          <span className="modal-kanji" lang="ja" aria-hidden="true">{technique.japanese}</span>
          <p className="modal-eyebrow">Atlas / {technique.category}</p>
          <h2>{technique.name}</h2>
          <p className="modal-reading">Wymowa: <strong>{technique.reading}</strong></p>
          <div className="detail-levels" aria-label="Stopnie w programie atlasu">
            {levels.map((level) => <span key={level.id}>{level.kyu}</span>)}
          </div>
          {detail ? <TechniqueDetailContent detail={detail} /> : <p className="modal-description">{technique.description}</p>}
          <div className="checkpoint">
            <Icon name="target" size={22} />
            <div><small>Najważniejszy punkt</small><strong>{technique.focus}</strong></div>
          </div>
          <p className="safety-note">Ćwicz pod opieką instruktora. Zdjęcie poglądowe nie zastępuje korekty technicznej sensei. Programy egzaminacyjne mogą różnić się między organizacjami i dojo.</p>
        </div>
      </div>
    </div>
  );
};

export default TechniqueModal;
