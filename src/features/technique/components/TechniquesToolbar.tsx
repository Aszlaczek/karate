import { BELT_NAMES, CATEGORIES, levels } from "@/data";
import FilterToolbar from "@/features/shared/components/FilterToolbar";

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
  return (
    <FilterToolbar
      categories={CATEGORIES.map((value) => ({ value }))}
      active={category}
      onCategoryChange={onCategoryChange}
      searchLabel="Szukaj techniki"
      searchPlaceholder="Szukaj techniki..."
      query={query}
      onQueryChange={onQueryChange}
      filters={
        showLevelFilter ? (
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
        ) : null
      }
    />
  );
}
