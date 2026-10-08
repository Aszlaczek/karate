import { useMemo, useState } from "react";
import {
  BELT_NAMES,
  CATEGORIES,
  filterTechniques,
  getLevelsForTechnique,
  levels,
  techniques,
} from "../data";
import Icon from "./Icon";
import TechniqueIllustration from "./TechniqueIllustration";
import { useModals } from "./ModalProvider";

interface TechniquesSectionProps {
  sectionId?: string;
  heading?: { number?: string; title: string; subtitle: string };
  levelNumber?: number;
}

const defaultHeading = {
  number: "02",
  title: "Atlas technik",
  subtitle: "Japońska nazwa, zapis, wymowa i praktyczne wskazówki w jednym miejscu.",
};

const TechniquesSection = ({ sectionId = "techniki", heading = defaultHeading, levelNumber }: TechniquesSectionProps) => {
  const [category, setCategory] = useState("Wszystkie");
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<number | null>(null);
  const { openTechnique } = useModals();
  const effectiveLevel = levelNumber ?? levelFilter;

  const filtered = useMemo(
    () => filterTechniques(techniques, category, query, effectiveLevel),
    [category, query, effectiveLevel],
  );

  return (
    <section className="section techniques-section" id={sectionId}>
      <div className="section-heading">
        <div>
          {heading.number && <span className="section-number">{heading.number}</span>}
          <h2>{heading.title}</h2>
        </div>
        <p>{heading.subtitle}</p>
      </div>
      <div className="tech-toolbar">
        <div className="category-tabs">
          {CATEGORIES.map((item) => (
            <button className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>
        <div className="tech-filters">
          {levelNumber === undefined && (
            <label className="level-select">
              <span>Stopień</span>
              <select
                aria-label="Filtruj po stopniu"
                onChange={(event) => setLevelFilter(event.target.value ? Number(event.target.value) : null)}
                value={levelFilter ?? ""}
              >
                <option value="">Wszystkie stopnie</option>
                {levels.map((level) => (
                  <option key={level.id} value={level.number}>{level.kyu} — {BELT_NAMES[level.belt].toLowerCase()}</option>
                ))}
              </select>
            </label>
          )}
          <label className="search-box"><Icon name="search" size={18} /><input aria-label="Szukaj techniki" onChange={(event) => setQuery(event.target.value)} placeholder="Szukaj techniki..." value={query} /></label>
        </div>
      </div>
      <div className="tech-grid">
        {filtered.map((technique, index) => (
          <article className="tech-card" key={technique.id} onClick={() => openTechnique(technique)}>
            <button
              className="tech-image"
              type="button"
              aria-label={`Otwórz wizualizację techniki ${technique.name}`}
            >
              <TechniqueIllustration technique={technique} controls={false} />
              <span>{technique.category}</span>
              <small>{String(index + 1).padStart(2, "0")}</small>
              <b>Zobacz ruch <Icon name="arrow" size={16} /></b>
            </button>
            <div className="tech-body">
              <div className="japanese">{technique.japanese}</div>
              <h3>{technique.name}</h3>
              <div className="pronunciation">Wymowa: <strong>{technique.reading}</strong></div>
              <p>{technique.description}</p>
              <div className="tech-focus"><Icon name="target" size={17} /><span>Klucz:</span><strong>{technique.focus}</strong></div>
              <div className="tech-levels">
                {getLevelsForTechnique(technique).map((level) => (
                  <span key={level.id}>{level.kyu}</span>
                ))}
              </div>
              <div className="tech-tags">{technique.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </div>
          </article>
        ))}
        {filtered.length === 0 && <div className="empty-state">Nie znaleziono techniki. Spróbuj innej nazwy, kategorii lub stopnia.</div>}
      </div>
    </section>
  );
};

export default TechniquesSection;
