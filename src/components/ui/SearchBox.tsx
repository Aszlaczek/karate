import Icon from "./Icon";

interface SearchBoxProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({ label, placeholder, value, onChange }: SearchBoxProps) {
  return (
    <label className="search-box">
      <Icon name="search" size={18} />
      <input
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}