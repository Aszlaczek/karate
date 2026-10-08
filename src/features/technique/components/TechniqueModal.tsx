import { useEffect } from "react";
import type { Technique } from "../data/types";
import Icon from "./Icon";
import TechniqueIllustration from "./TechniqueIllustration";

const TechniqueModal = ({ technique, onClose }: { technique: Technique; onClose: () => void }) => {
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
    <div className="tech-modal" role="dialog" aria-modal="true" aria-label={`Wizualizacja techniki ${technique.name}`} onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div className="tech-modal-panel">
        <button className="modal-close" aria-label="Zamknij wizualizację" onClick={onClose}><Icon name="close" /></button>
        <div className="visualization-stage">
          <div className="visualization-topline">
            <span>{technique.category}</span>
            <small>Wizualizacja techniki</small>
          </div>
          <TechniqueIllustration technique={technique} />
          {!technique.video && (
            <div className="visualization-legend">
              <span><i className="legend-solid" /> Pozycja końcowa</span>
              <span><i className="legend-ghost" /> Pozycja początkowa</span>
              <span><i className="legend-red" /> Kierunek ruchu</span>
            </div>
          )}
        </div>
        <div className="visualization-copy">
          <span className="modal-kanji">{technique.japanese}</span>
          <p className="modal-eyebrow">Technika krok po kroku</p>
          <h2>{technique.name}</h2>
          <p className="modal-reading">Wymowa: <strong>{technique.reading}</strong></p>
          <p className="modal-description">{technique.description}</p>
          <div className="checkpoint">
            <Icon name="target" size={22} />
            <div><small>Najważniejszy punkt</small><strong>{technique.focus}</strong></div>
          </div>
          <ol>
            <li><span>01</span><p><strong>Przygotuj pozycję</strong>Ustaw stabilną bazę, rozluźnij barki i utrzymaj wzrok na celu.</p></li>
            <li><span>02</span><p><strong>Poprowadź ruch</strong>Wykonaj technikę po zaznaczonej czerwonej linii, angażując biodra.</p></li>
            <li><span>03</span><p><strong>Zatrzymaj i wróć</strong>Kontroluj punkt końcowy, zachowaj gardę i płynnie wróć do kamae.</p></li>
          </ol>
          <p className="safety-note">Ćwicz pod opieką instruktora. Schemat pokazuje kierunek ruchu i nie zastępuje korekty technicznej sensei.</p>
        </div>
      </div>
    </div>
  );
};

export default TechniqueModal;
