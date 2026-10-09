interface CategoryTabItem {
  value: string;
  label?: string;
  count?: number;
}

interface CategoryTabsProps {
  items: CategoryTabItem[];
  active: string;
  onChange: (value: string) => void;
}

export default function CategoryTabs({ items, active, onChange }: CategoryTabsProps) {
  return (
    <div className="category-tabs">
      {items.map((item) => (
        <button
          key={item.value}
          className={item.value === active ? "active" : ""}
          onClick={() => onChange(item.value)}
        >
          {item.label ?? item.value}
          {item.count !== undefined && <i>{String(item.count).padStart(2, "0")}</i>}
        </button>
      ))}
    </div>
  );
}