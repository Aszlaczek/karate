import type { ReactNode } from "react";
import CategoryTabs from "@/components/ui/CategoryTabs";
import SearchBox from "@/components/ui/SearchBox";

export interface ToolbarCategory {
  value: string;
  label?: string;
  count?: number;
}

interface FilterToolbarProps {
  categories: ToolbarCategory[];
  active: string;
  onCategoryChange: (value: string) => void;
  searchLabel: string;
  searchPlaceholder: string;
  query: string;
  onQueryChange: (value: string) => void;
  /** Opcjonalny filtr domenowy, np. wybór stopnia w atlasie. */
  filters?: ReactNode;
}

/** Wspólny pasek zakładek, wyszukiwania i dodatkowych filtrów. */
export default function FilterToolbar({
  categories,
  active,
  onCategoryChange,
  searchLabel,
  searchPlaceholder,
  query,
  onQueryChange,
  filters,
}: FilterToolbarProps) {
  return (
    <div className="tech-toolbar">
      <CategoryTabs items={categories} active={active} onChange={onCategoryChange} />
      <div className="tech-filters">
        {filters}
        <SearchBox
          label={searchLabel}
          placeholder={searchPlaceholder}
          value={query}
          onChange={onQueryChange}
        />
      </div>
    </div>
  );
}
