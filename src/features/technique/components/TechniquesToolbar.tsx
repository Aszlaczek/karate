import { useMemo } from "react";
import { BELT_NAMES, CATEGORIES, levels } from "@/data";
import CategoryTabs from "@/components/ui/CategoryTabs";
import SearchBox from "@/components/ui/SearchBox";

interface TechniquesToolbarProps {
  category: string;
  onCategoryChange: (value: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
  levelFilter: number | null;
  onLevelFilterChange: (value: number | null) => void;
  showLevelFilter: boolean;
}

export default function TechniquesToolbar({
  category,
  onCategoryChange,
  query,
  onQueryChange,
  levelFilter,
  onLevelFilterChange,
  showLevelFilter,
}: TechniquesToolbarProps) {
  const categoryItems = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        value: c,
        label: c,
      })),
    [],
  );

  return (
    <div className="tech-toolbar">
      <CategoryTabs items={categoryItems} active={category} onChange={onCategoryChange} />
      <div className="tech-filters">
        {showLevelFilter && (
          <label className="level-select">
            <span>Stopień</span>
            <select
              aria-label="Filtruj po stopniu"
              onChange={(event) =>
                onLevelFilterChange(event.target.value ? Number(event.target.value) : null)
              }
              value={levelFilter ?? ""}
            >
              <option value="">Wszystkie stopnie</option>
              {levels.map((level) => (
                <option key={level.id} value={level.number}>
                  {level.kyu} — {BELT_NAMES[level.belt].toLowerCase()}
                </option>
              ))}
            </select>
          </label>
        )}
        <SearchBox
          label="Szukaj techniki"
          placeholder="Szukaj techniki..."
          value={query}
          onChange={onQueryChange}
        />
      </div>
    </div>
  );
}