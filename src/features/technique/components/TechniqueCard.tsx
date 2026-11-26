import { useModals } from "@/store/modalStore";
import { getLevelsForTechnique, getTechniqueCardMedia } from "@/data";
import { prefetchTechnique } from "@/data/onDemand";
import TechniqueIllustration from "./TechniqueIllustration";
import { resolveMediaSrc } from "./media";
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
          <span className="technique-media-frame technique-photo-frame media-card-thumb">
            <img
              className="technique-media"
              src={resolveMediaSrc(thumbnail)}
              alt=""
              loading="lazy"
              decoding="async"
            />
            {firstIsVideo && (
              <span className="media-card-play" aria-hidden="true">
                <Icon name="play" size={18} />
              </span>
            )}
          </span>
        ) : (
          <TechniqueIllustration technique={technique} controls={false} />
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
