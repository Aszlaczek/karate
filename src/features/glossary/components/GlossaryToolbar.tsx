import { useMemo } from "react";
import { glossary } from "@/data";
import CategoryTabs from "@/components/ui/CategoryTabs";
import SearchBox from "@/components/ui/SearchBox";

interface GlossaryToolbarProps {
  activeCategoryId: string;
  onCategoryChange: (id: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
}

export default function GlossaryToolbar({ activeCategoryId, onCategoryChange, query, onQueryChange }: GlossaryToolbarProps) {
  const items = useMemo(
    () =>
      glossary.map((c) => ({
        value: c.id,
        label: c.name,
        count: c.entries.length,
      })),
    [],
  );

  return (
    <div className="tech-toolbar">
      <CategoryTabs items={items} active={activeCategoryId} onChange={onCategoryChange} />
      <div className="tech-filters">
        <SearchBox
          label="Szukaj w słowniku"
          placeholder="Szukaj hasła..."
          value={query}
          onChange={onQueryChange}
        />
      </div>
    </div>
  );
}