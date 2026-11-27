import { glossary } from "@/data";
import FilterToolbar from "@/features/shared/components/FilterToolbar";

interface GlossaryToolbarProps {
  activeCategoryId: string;
  onCategoryChange: (id: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
}

export default function GlossaryToolbar({ activeCategoryId, onCategoryChange, query, onQueryChange }: GlossaryToolbarProps) {
  return (
    <FilterToolbar
      categories={glossary.map((category) => ({
        value: category.id,
        label: category.name,
        count: category.entries.length,
      }))}
      active={activeCategoryId}
      onCategoryChange={onCategoryChange}
      searchLabel="Szukaj w słowniku"
      searchPlaceholder="Szukaj hasła..."
      query={query}
      onQueryChange={onQueryChange}
    />
  );
}
