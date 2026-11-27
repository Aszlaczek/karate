import { useModals } from "@/store/modalStore";
import { getLevelsForTechnique, getTechniqueCardMedia } from "@/data";
import { prefetchTechnique } from "@/data/onDemand";
import TechniqueIllustration from "./TechniqueIllustration";
import CardThumbnail from "@/features/shared/components/CardThumbnail";
import Icon from "@/components/ui/Icon";

interface TechniqueCardProps {
  technique: import("@/data/types").Technique;
  index: number;
}

export default function TechniqueCard({ technique, index }: TechniqueCardProps) {
  const { openTechnique } = useModals();
  const { thumbnail, firstIsVideo } = getTechniqueCardMedia(technique.id);

  return (
    <article
      className="tech-card"
      onClick={() => openTechnique(technique)}
      onMouseEnter={() => prefetchTechnique(technique.id)}
      onFocus={() => prefetchTechnique(technique.id)}
    >
      <button
        className="tech-image"
        type="button"
        aria-label={`Otwórz szczegóły techniki ${technique.name}`}
      >
        {thumbnail ? (
          <CardThumbnail
            src={thumbnail}
            alt=""
            className="technique-media-frame technique-photo-frame media-card-thumb"
            imageClassName="technique-media"
            firstIsVideo={firstIsVideo}
          />
        ) : (
          <TechniqueIllustration technique={technique} />
        )}
        <span>{technique.category}</span>
        <small>{String(index + 1).padStart(2, "0")}</small>
        <b>
          Poznaj technikę <Icon name="arrow" size={16} />
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
