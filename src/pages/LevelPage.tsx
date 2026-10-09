import { Navigate, useParams } from "react-router";
import BeltPath from "@/features/level/components/BeltPath";
import RequirementsPanel from "@/features/level/components/RequirementsPanel";
import TechniquesSection from "@/features/technique/components/TechniquesSection";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { BELT_NAMES, getLevel } from "@/data";
import SectionHeading from "@/components/ui/SectionHeading";

const LevelPage = () => {
  const { kyuId } = useParams();
  const level = getLevel(kyuId);

  useDocumentTitle(
    level
      ? `Wymagania ${level.kyu} — pas ${BELT_NAMES[level.belt].toLowerCase()} | Kihon`
      : null,
  );

  if (!level) return <Navigate to="/nie-istnieje" replace />;

  return (
    <>
      <section className="section belts-section level-belts">
        <SectionHeading number="01" title="Wybór stopnia" subtitle="Każdy kyu ma własny zakres egzaminu. Pas z belką to drugi stopień w danym kolorze." />
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