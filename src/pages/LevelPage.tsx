import { useEffect } from "react";
import { Navigate, useParams } from "react-router";
import BeltPath from "../components/BeltPath";
import RequirementsPanel from "../components/RequirementsPanel";
import TechniquesSection from "../components/TechniquesSection";
import { BELT_NAMES, getLevel } from "../data";

const LevelPage = () => {
  const { kyuId } = useParams();
  const level = getLevel(kyuId);

  useEffect(() => {
    if (!level) return;
    document.title = `Wymagania ${level.kyu} — pas ${BELT_NAMES[level.belt].toLowerCase()} | Kihon`;
  }, [level]);

  if (!level) return <Navigate to="/nie-istnieje" replace />;

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
    </>
  );
};

export default LevelPage;
