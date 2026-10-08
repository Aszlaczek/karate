import { Link } from "react-router";
import { BELT_NAMES, getNeighbourLevels, levels } from "@/data";
import type { Level, RequirementItem } from "@/data/types";
import Icon from "@/components/ui/Icon";
import TechniqueLink from "@/features/technique/components/TechniqueLink";

const itemKey = (item: RequirementItem) => (item.type === "technique" ? item.id : item.text);

const fightsLabel = (count: number) => {
  const plural = count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? "walki" : "walk";
  return `${count} ${count === 1 ? "walka" : plural}`;
};

const RequirementsPanel = ({ level }: { level: Level }) => {
  const { prev, next } = getNeighbourLevels(level.order);

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
          <div className="requirement-badges">
            <div className="time-badge"><small>Orientacyjny staż</small><strong>{level.time}</strong></div>
            {level.fights !== null && (
              <div className="time-badge fights-badge"><small>Walki egzaminacyjne</small><strong>{fightsLabel(level.fights)}</strong></div>
            )}
          </div>
        </div>
        <div className="requirement-groups">
          {level.groups.map((group, index) => (
            <article key={group.title}>
              <span className="group-number">0{index + 1}</span>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={itemKey(item)}>
                    <Icon name="check" size={16} />
                    <span>{item.type === "technique" ? <TechniqueLink id={item.id} /> : item.text}</span>
                  </li>
                ))}
              </ul>
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
            <span>{levels.length} stopni egzaminu</span>
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
