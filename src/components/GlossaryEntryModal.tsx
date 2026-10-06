import { useEffect } from "react";
import { getRelatedTechniques } from "../data";
import type { GlossaryCategory, GlossaryEntry, Technique } from "../data/types";
import Icon from "./Icon";

interface GlossaryEntryModalProps {
  entry: GlossaryEntry;
  category: GlossaryCategory;
  onClose: () => void;
  onSelectTechnique: (technique: Technique) => void;
}

const GlossaryEntryModal = ({ entry, category, onClose, onSelectTechnique }: GlossaryEntryModalProps) => {
  const related = getRelatedTechniques(entry);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return (
    <div
      className="tech-modal glossary-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`Hasło słownika ${entry.term}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="tech-modal-panel glossary-modal-panel">
        <button className="modal-close" aria-label="Zamknij hasło" onClick={onClose}><Icon name="close" /></button>
        <div className="visualization-stage glossary-visual">
          <div className="visualization-topline">
            <span>{category.name}</span>
            <small>Hasło słownikowe</small>
          </div>
          {entry.image ? (
            <img className="glossary-photo" src={entry.image} alt={entry.term} />
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
                  <button key={technique.id} onClick={() => onSelectTechnique(technique)}>
                    {technique.name}
                    <Icon name="arrow" size={13} />
                  </button>
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
