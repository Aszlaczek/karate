import { useMemo } from "react";
import { glossary } from "@/data";
import GlossaryCard from "./GlossaryCard";
import { useModals } from "@/store/modalStore";
import EmptyState from "@/components/ui/EmptyState";

interface GlossaryGridProps {
  activeCategoryId: string;
  query: string;
}

export default function GlossaryGrid({ activeCategoryId, query }: GlossaryGridProps) {
  const { openGlossaryEntry } = useModals();

  const activeCategory = useMemo(() => glossary.find((c) => c.id === activeCategoryId) ?? glossary[0], [activeCategoryId]);
  const isStatic = activeCategory.id === "czesci-ciala";

  const filteredEntries = useMemo(() => {
    if (!activeCategory) return [];
    const needle = query.trim().toLowerCase();
    if (!needle) return activeCategory.entries;
    return activeCategory.entries.filter((entry) =>
      `${entry.term} ${entry.japanese} ${entry.reading} ${entry.description}`.toLowerCase().includes(needle),
    );
  }, [activeCategory, query]);

  return (
    <div className="glossary-grid">
      {filteredEntries.map((entry) => (
        <GlossaryCard
          key={entry.id}
          entry={entry}
          category={activeCategory}
          static={isStatic}
          onClick={isStatic ? undefined : () => openGlossaryEntry(entry, activeCategory)}
        />
      ))}
      {filteredEntries.length === 0 && (
        <EmptyState>Brak haseł pasujących do „{query}”. Spróbuj innego słowa.</EmptyState>
      )}
    </div>
  );
}