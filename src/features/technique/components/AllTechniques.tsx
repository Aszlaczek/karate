import { useMemo } from "react";
import { filterAtlas, getGlossaryEntry } from "@/data";
import TechniqueCard from "./TechniqueCard";
import GlossaryCard from "@/features/glossary/components/GlossaryCard";
import { useModals } from "@/store/modalStore";
import EmptyState from "@/components/ui/EmptyState";

interface AllTechniquesProps {
  category: string;
  query: string;
  levelNumber: number | null;
}

export default function AllTechniques({ category, query, levelNumber }: AllTechniquesProps) {
  const { openGlossaryEntry } = useModals();

  const items = useMemo(() => filterAtlas(category, query, levelNumber), [category, query, levelNumber]);

  return (
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
      {items.length === 0 && <EmptyState>Nie znaleziono techniki. Spróbuj innej nazwy, kategorii lub stopnia.</EmptyState>}
    </div>
  );
}