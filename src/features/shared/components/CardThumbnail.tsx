import Icon from "@/components/ui/Icon";
import { resolveMediaSrc } from "@/features/technique/components/media";

interface CardThumbnailProps {
  src: string;
  alt: string;
  className: string;
  imageClassName?: string;
  firstIsVideo?: boolean;
}

/** Statyczna miniatura kafelka: obraz z katalogu mediów i opcjonalna oznaka filmu. */
export default function CardThumbnail({
  src,
  alt,
  className,
  imageClassName = "",
  firstIsVideo = false,
}: CardThumbnailProps) {
  return (
    <span className={className}>
      <img
        className={imageClassName}
        src={resolveMediaSrc(src)}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
      {firstIsVideo && (
        <span className="media-card-play" aria-hidden="true">
          <Icon name="play" size={18} />
        </span>
      )}
    </span>
  );
}
