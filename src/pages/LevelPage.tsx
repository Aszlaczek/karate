import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router";
import BeltPath from "../components/BeltPath";
import RequirementsPanel from "../components/RequirementsPanel";
import TechniquesSection from "../components/TechniquesSection";
import { BELT_NAMES, getLevel, getNeighbourLevels } from "../data";

const LevelPage = () => {
  const { kyuId } = useParams();
  const level = getLevel(kyuId);

  useEffect(() => {
    if (!level) return;
    document.title = `Wymagania ${level.kyu} — pas ${BELT_NAMES[level.belt].toLowerCase()} | Kihon`;
  }, [level]);

  if (!level) return <Navigate to="/nie-istnieje" replace />;

  const { prev, next } = getNeighbourLevels(level.order);

  return (
    <>
      <section className="section belts-section level-belts">
        <div className="section-heading">
          <div><span className="section-number">01</span><h2>Wybór stopnia</h2></div>
          <p>Każdy kyu ma własny zakres egzaminu. Pas z belką to drugi stopień w danym kolorze.</p>
        </div>
        <BeltPath activeId={level.id} />
      </section>

      <RequirementsPanel level={level} />

      <TechniquesSection
        sectionId="techniki-stopnia"
        levelNumber={level.number}
        heading={{
          number: "02",
          title: "Techniki tego stopnia",
          subtitle: `Techniki wskazane na egzaminie ${level.kyu} — pobrane z atlasu technik.`,
        }}
      />

      <nav className="level-nav" aria-label="Nawigacja między stopniami">
        {prev ? (
          <Link className="level-nav-link" to={`/kyu/${prev.id}`}>
            <small>← Poprzedni</small>
            <strong>{prev.kyu}</strong>
            <span>{prev.level}</span>
          </Link>
        ) : <span />}
        <Link className="level-nav-all" to="/#stopnie">Wszystkie stopnie</Link>
        {next ? (
          <Link className="level-nav-link level-nav-next" to={`/kyu/${next.id}`}>
            <small>Następny →</small>
            <strong>{next.kyu}</strong>
            <span>{next.level}</span>
          </Link>
        ) : <span />}
      </nav>
    </>
  );
};

export default LevelPage;
