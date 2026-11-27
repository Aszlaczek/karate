import { getRelatedTechniques } from "@/data";
import { loadGlossaryData } from "@/data/onDemand";
import type { EntryData, GlossaryCategory, GlossaryEntry } from "@/data/types";
import { useOnDemandData } from "@/hooks/useOnDemandData";
import { resolveMediaSrc } from "@/features/technique/components/media";
import TechniqueLink from "@/features/technique/components/TechniqueLink";
import EntryModalShell from "@/features/shared/components/EntryModalShell";
import KanjiPlaceholder from "@/features/shared/components/KanjiPlaceholder";
import ZoneIllustration, { zoneForEntry } from "@/features/glossary/components/ZoneIllustration";

interface GlossaryEntryModalProps {
  entry: GlossaryEntry;
  category: GlossaryCategory;
  onClose: () => void;
}

const EMPTY: EntryData = { media: [], knowledge: null };
const SAFETY_NOTE =
  "Słownik opisuje terminy używane na egzaminach — zakres i interpretację zawsze potwierdź u swojego sensei.";

const GlossaryEntryModal = ({ entry, category, onClose }: GlossaryEntryModalProps) => {
  const related = getRelatedTechniques(entry);
  const zone = zoneForEntry(entry.id);
  const { knowledge } = useOnDemandData(entry.id, loadGlossaryData, EMPTY);

  return (
    <EntryModalShell
      ariaLabel={`Hasło słownika ${entry.term}`}
      closeLabel="Zamknij hasło"
      onClose={onClose}
      className="glossary-modal"
      panelClassName={`glossary-modal-panel${knowledge ? " technique-detail-panel" : ""}`}
      visualClassName="glossary-visual"
      copyClassName="glossary-copy"
      category={category.name}
      overline="Hasło słownikowe"
      kanji={entry.japanese}
      eyebrow={`Słownik / ${category.name}`}
      title={entry.term}
      reading={entry.reading}
      visual={
        entry.image ? (
          <img className="glossary-photo" src={resolveMediaSrc(entry.image)} alt={entry.term} />
        ) : zone ? (
          <ZoneIllustration zone={zone} />
        ) : (
          <KanjiPlaceholder
            className="glossary-visual-placeholder"
            kanji={entry.japanese}
            reading={entry.reading}
            decorative
          />
        )
      }
      knowledge={knowledge}
      description={entry.description}
      afterDetail={
        related.length > 0 ? (
          <div className="glossary-related">
            <small>Powiązane techniki</small>
            <div>
              {related.map((technique) => (
                <TechniqueLink key={technique.id} id={technique.id} variant="chip" />
              ))}
            </div>
          </div>
        ) : null
      }
      safetyNote={SAFETY_NOTE}
    />
  );
};

export default GlossaryEntryModal;
