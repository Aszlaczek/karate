import {
  getStanceEntries,
  getTechniqueById,
} from "@/data";
import Icon from "@/components/ui/Icon";
import { useModals } from "@/store/modalStore";

interface TechniqueLinkProps {
  id: string;
  variant?: "inline" | "chip";
}

const TechniqueLink = ({ id, variant = "inline" }: TechniqueLinkProps) => {
  const { openTechnique } = useModals();
  const technique = getTechniqueById(id);
  const stance = getStanceEntries().find((entry) => entry.id === id);

  if (!technique) return <span className="technique-ref-missing">{id}</span>;

  return (
    <button
      className={`technique-ref${variant === "chip" ? " chip" : ""}`}
      type="button"
      onClick={() =>
        technique.category === "pozycje" ? (
          <>{stance}</>
        ) : (
          openTechnique(technique)
        )
      }
    >
      {technique.name}
      <Icon name="arrow" size={variant === "chip" ? 13 : 12} />
    </button>
  );
};

export default TechniqueLink;
