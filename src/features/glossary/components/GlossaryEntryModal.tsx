import { getRelatedTechniques } from "@/data";
import type { GlossaryCategory, GlossaryEntry } from "@/data/types";
import { resolveMediaSrc } from "@/features/technique/components/TechniqueIllustration";
import Icon from "@/components/ui/Icon";
import TechniqueLink from "@/features/technique/components/TechniqueLink";
import ZoneIllustration, { zoneForEntry } from "@/features/glossary/components/ZoneIllustration";
import { useModalBase } from "@/hooks/useModalBase";

interface GlossaryEntryModalProps {
  entry: GlossaryEntry;
  category: GlossaryCategory;
  onClose: () => void;
}

const GlossaryEntryModal = ({ entry, category, onClose }: GlossaryEntryModalProps) => {
  const related = getRelatedTechniques(entry);
  const zone = zoneForEntry(entry.id);
  const { onBackdropMouseDown } = useModalBase(onClose);

  return (
    <div
      className="tech-modal glossary-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`Hasło słownika ${entry.term}`}
      onMouseDown={onBackdropMouseDown}
    >
      <div className="tech-modal-panel glossary-modal-panel">
        <button className="modal-close" aria-label="Zamknij hasło" onClick={onClose}><Icon name="close" /></button>
        <div className="visualization-stage glossary-visual">
          <div className="visualization-topline">
            <span>{category.name}</span>
            <small>Hasło słownikowe</small>
          </div>
          {entry.image ? (
            <img className="glossary-photo" src={resolveMediaSrc(entry.image)} alt={entry.term} />
          ) : zone ? (
            <ZoneIllustration zone={zone} />
          ) : (
            <div className="glossary-visual-placeholder" aria-hidden="true">
              <span>{entry.japanese}</span>
              <small>{entry.reading}</small>
            </div>
          )}
        </div>
        <div className="visualization-copy glossary-copy">
          <span className="modal-kanji">{entry.japanese}</span>
          <p className="modal-eyebrow">Słownik / {category.name}</p>
          <h2>{entry.term}</h2>
          <p className="modal-reading">Wymowa: <strong>{entry.reading}</strong></p>
          <p className="modal-description">{entry.description}</p>

          {related.length > 0 && (
            <div className="glossary-related">
              <small>Powiązane techniki</small>
              <div>
                {related.map((technique) => (
                  <TechniqueLink key={technique.id} id={technique.id} variant="chip" />
                ))}
              </div>
            </div>
          )}

          <p className="safety-note">
            Słownik opisuje terminy używane na egzaminach — zakres i interpretację zawsze potwierdź u swojego sensei.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlossaryEntryModal;
