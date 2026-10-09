import { useModals } from "@/store/modalStore";
import { getLevelsForTechnique } from "@/data";
import TechniqueIllustration from "./TechniqueIllustration";
import Icon from "@/components/ui/Icon";

interface TechniqueCardProps {
  technique: import("@/data/types").Technique;
  index: number;
}

export default function TechniqueCard({ technique, index }: TechniqueCardProps) {
  const { openTechnique } = useModals();

  return (
    <article className="tech-card" onClick={() => openTechnique(technique)}>
      <button
        className="tech-image"
        type="button"
        aria-label={`Otwórz wizualizację techniki ${technique.name}`}
      >
        <TechniqueIllustration technique={technique} controls={false} />
        <span>{technique.category}</span>
        <small>{String(index + 1).padStart(2, "0")}</small>
        <b>
          Zobacz ruch <Icon name="arrow" size={16} />
        </b>
      </button>
      <div className="tech-body">
        <div className="japanese">{technique.japanese}</div>
        <h3>{technique.name}</h3>
        <div className="pronunciation">
          Wymowa: <strong>{technique.reading}</strong>
        </div>
        <p>{technique.description}</p>
        <div className="tech-focus">
          <Icon name="target" size={17} />
          <span>Klucz:</span>
          <strong>{technique.focus}</strong>
        </div>
        <div className="tech-levels">
          {getLevelsForTechnique(technique).map((level) => (
            <span key={level.id}>{level.kyu}</span>
          ))}
        </div>
        <div className="tech-tags">
          {technique.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}