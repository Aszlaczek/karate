import { useMemo } from "react";
import { Link } from "react-router";
import { BELT_NAMES, buildTechniqueLinkPattern, findTechniqueByAlias, getNeighbourLevels } from "../data";
import type { Level } from "../data/types";
import Icon from "./Icon";
import { useModals } from "./ModalProvider";

const RequirementsPanel = ({ level }: { level: Level }) => {
  const { openTechnique } = useModals();
  const pattern = useMemo(() => buildTechniqueLinkPattern(), []);
  const { prev, next } = getNeighbourLevels(level.order);

  const renderRequirementItem = (item: string) =>
    item.split(pattern).map((part, index) => {
      const technique = findTechniqueByAlias(part);
      if (!technique) return <span key={`${part}-${index}`}>{part}</span>;
      return (
        <button className="requirement-tech-link" key={`${part}-${index}`} onClick={() => openTechnique(technique)}>
          {part}<Icon name="arrow" size={12} />
        </button>
      );
    });

  return (
    <section className="requirements">
      <div className="requirement-side">
        <span className="vertical-label">WYMAGANIA EGZAMINACYJNE</span>
        <div className="selected-belt-mark" style={{ backgroundColor: level.color }}>
          {level.stripe && <i style={{ backgroundColor: level.stripe }} />}
        </div>
        <span className="gi-symbol">空手</span>
      </div>
      <div className="requirement-content">
        <div className="requirement-title">
          <div>
            <span>{level.kyu} / {level.level} / {BELT_NAMES[level.belt]}</span>
            <h2>Pas {BELT_NAMES[level.belt].toLowerCase()}{level.stripe ? " z belką" : ""}</h2>
            <p>{level.intro}</p>
          </div>
          <div className="time-badge"><small>Orientacyjny staż</small><strong>{level.time}</strong></div>
        </div>
        <div className="requirement-groups">
          {level.groups.map((group, index) => (
            <article key={group.title}>
              <span className="group-number">0{index + 1}</span>
              <h3>{group.title}</h3>
              <ul>{group.items.map((item) => <li key={item}><Icon name="check" size={16} /><span>{renderRequirementItem(item)}</span></li>)}</ul>
            </article>
          ))}
        </div>
        <p className="requirements-note"><strong>Ważne:</strong> programy egzaminacyjne mogą różnić się między organizacjami i dojo. Zawsze potwierdź aktualny zakres u swojego sensei.</p>
        <nav className="level-nav" aria-label="Nawigacja między stopniami">
          {prev ? (
            <Link className="level-nav-cell level-nav-prev" to={`/kyu/${prev.id}`}>
              <small>← Poprzedni stopień</small>
              <strong>{prev.kyu}</strong>
              <span>{prev.level}</span>
            </Link>
          ) : (
            <span className="level-nav-cell level-nav-placeholder">
              <small>← Poprzedni stopień</small>
              <strong>—</strong>
            </span>
          )}
          <Link className="level-nav-cell level-nav-all" to="/#stopnie">
            <small>Cała ścieżka</small>
            <strong>Wszystkie stopnie</strong>
            <span>12 stopni egzaminu</span>
          </Link>
          {next ? (
            <Link className="level-nav-cell level-nav-next" to={`/kyu/${next.id}`}>
              <small>Następny stopień →</small>
              <strong>{next.kyu}</strong>
              <span>{next.level}</span>
            </Link>
          ) : (
            <span className="level-nav-cell level-nav-placeholder">
              <small>Następny stopień →</small>
              <strong>—</strong>
            </span>
          )}
        </nav>
      </div>
    </section>
  );
};

export default RequirementsPanel;
