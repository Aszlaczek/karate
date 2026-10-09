import { useMemo, useState } from "react";
import { filterAtlas } from "@/data";
import { useModals } from "@/store/modalStore";
import TechniqueCard from "./TechniqueCard";
import TechniquesToolbar from "./TechniquesToolbar";
import SectionHeading from "@/components/ui/SectionHeading";
import GlossaryCard from "@/features/glossary/components/GlossaryCard";
import { getGlossaryEntry } from "@/data";
import EmptyState from "@/components/ui/EmptyState";

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

const TechniquesSection = ({
  sectionId = "techniki",
  heading = defaultHeading,
  levelNumber,
}: TechniquesSectionProps) => {
  const [category, setCategory] = useState("Wszystkie");
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<number | null>(null);
  const { openGlossaryEntry } = useModals();
  const effectiveLevel = levelNumber ?? levelFilter;
  const showLevelFilter = levelNumber === undefined;

  const items = useMemo(() => filterAtlas(category, query, effectiveLevel), [category, query, effectiveLevel]);

  return (
    <section className="section techniques-section" id={sectionId}>
      <SectionHeading number={heading.number} title={heading.title} subtitle={heading.subtitle} />
      <TechniquesToolbar
        category={category}
        onCategoryChange={setCategory}
        query={query}
        onQueryChange={setQuery}
        levelFilter={levelFilter}
        onLevelFilterChange={setLevelFilter}
        showLevelFilter={showLevelFilter}
      />
      <div className="tech-grid">
        {items.map((item, index) => {
          if (item.kind === "technique") {
            return <TechniqueCard key={item.technique.id} technique={item.technique} index={index} />;
          }
          const lookup = getGlossaryEntry(item.entry.id);
          return (
            <GlossaryCard
              key={item.entry.id}
              entry={item.entry}
              category={lookup?.category ?? item.category}
              static={false}
              onClick={() => openGlossaryEntry(item.entry, lookup?.category ?? item.category)}
            />
          );
        })}
        {items.length === 0 && (
          <EmptyState>Nie znaleziono techniki. Spróbuj innej nazwy, kategorii lub stopnia.</EmptyState>
        )}
      </div>
    </section>
  );
};

export default TechniquesSection;