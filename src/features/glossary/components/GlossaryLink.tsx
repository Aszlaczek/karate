import { getGlossaryEntry } from "@/data";
import { useModals } from "@/store/modalStore";
import Icon from "@/components/ui/Icon";

interface GlossaryLinkProps {
  id: string;
}

export default function GlossaryLink({ id }: GlossaryLinkProps) {
  const { openGlossaryEntry } = useModals();
  const lookup = getGlossaryEntry(id);

  if (!lookup) return <span className="technique-ref-missing">{id}</span>;

  return (
    <button
      className="technique-ref"
      type="button"
      onClick={() => openGlossaryEntry(lookup.entry, lookup.category)}
    >
      {lookup.entry.term}
      <Icon name="arrow" size={12} />
    </button>
  );
}