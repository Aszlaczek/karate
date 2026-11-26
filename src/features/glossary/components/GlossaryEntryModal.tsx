import { getRelatedTechniques, STANCE_CATEGORY_ID } from "@/data";
import { loadGlossaryData } from "@/data/onDemand";
import type { EntryData, GlossaryCategory, GlossaryEntry } from "@/data/types";
import { useOnDemandData } from "@/hooks/useOnDemandData";
import MediaGallery from "@/features/technique/components/MediaGallery";
import { resolveMediaSrc } from "@/features/technique/components/TechniqueIllustration";
import Icon from "@/components/ui/Icon";
import TechniqueLink from "@/features/technique/components/TechniqueLink";
import ZoneIllustration, {
  zoneForEntry,
} from "@/features/glossary/components/ZoneIllustration";
import { useModalBase } from "@/hooks/useModalBase";
import TechniqueDetailContent from "@/features/technique/components/TechniqueDetailContent";

interface GlossaryEntryModalProps {
  entry: GlossaryEntry;
  category: GlossaryCategory;
  onClose: () => void;
}

const EMPTY: EntryData = { media: [], detail: null };

const GlossaryEntryModal = ({
  entry,
  category,
  onClose,
}: GlossaryEntryModalProps) => {
  const related = getRelatedTechniques(entry);
  const zone = zoneForEntry(entry.id);
  const { onBackdropMouseDown } = useModalBase(onClose);
  const data = useOnDemandData(entry.id, loadGlossaryData, EMPTY);
  const detail = category.id === STANCE_CATEGORY_ID ? data.detail : null;
  // Zdjęcie postawy jest tylko miniaturką na kafelku — w modalu startują filmy.
  const media = data.media;

  return (
    <div
      className="tech-modal glossary-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`Hasło słownika ${entry.term}`}
      onMouseDown={onBackdropMouseDown}
    >
      <div
        className={`tech-modal-panel glossary-modal-panel${detail ? " technique-detail-panel" : ""}`}
      >
        <button
          className="modal-close"
          aria-label="Zamknij hasło"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
        <div className="visualization-stage glossary-visual">
          <div className="visualization-topline">
            <span>{category.name}</span>
            <small>Hasło słownikowe</small>
          </div>
          {media.length > 0 ? (
            <MediaGallery key={entry.id} items={media} title={entry.term} />
          ) : category.id !== STANCE_CATEGORY_ID && entry.image ? (
            <img
              className="glossary-photo"
              src={resolveMediaSrc(entry.image)}
              alt={entry.term}
            />
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
          <p className="modal-reading">
            Wymowa: <strong>{entry.reading}</strong>
          </p>
          {detail ? (
            <TechniqueDetailContent detail={detail} />
          ) : (
            <p className="modal-description">{entry.description}</p>
          )}

          {related.length > 0 && (
            <div className="glossary-related">
              <small>Powiązane techniki</small>
              <div>
                {related.map((technique) => (
                  <TechniqueLink
                    key={technique.id}
                    id={technique.id}
                    variant="chip"
                  />
                ))}
              </div>
            </div>
          )}

          <p className="safety-note">
            Słownik opisuje terminy używane na egzaminach — zakres i
            interpretację zawsze potwierdź u swojego sensei.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlossaryEntryModal;
