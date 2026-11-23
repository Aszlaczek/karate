import type { MediaItem } from "@/data/types";
import { isImageSrc, resolveMediaSrc, youtubeId } from "./media";

interface MediaFrameProps {
  item: MediaItem;
  title: string;
  controls?: boolean;
  frameClassName?: string;
}

/** Wspólny renderer jednego materiału: YouTube, plik wideo albo zdjęcie. */
const MediaFrame = ({ item, title, controls = true, frameClassName = "" }: MediaFrameProps) => {
  const frame = `technique-media-frame ${frameClassName}`.trim();
  const youtube = item.type === "video" ? youtubeId(item.src) : null;

  if (youtube) {
    return (
      <div className={frame}>
        <iframe
          className="technique-media"
          src={`https://www.youtube.com/embed/${youtube}`}
          title={item.alt ?? item.caption ?? `Wideo: ${title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (item.type === "image" || isImageSrc(item.src)) {
    return (
      <div className={frame}>
        <img
          className="technique-media"
          src={resolveMediaSrc(item.src)}
          alt={item.alt ?? item.caption ?? title}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div className={frame}>
      <video
        className="technique-media"
        src={resolveMediaSrc(item.src)}
        poster={item.poster ? resolveMediaSrc(item.poster) : undefined}
        controls={controls}
        preload="metadata"
        playsInline
        aria-label={item.alt ?? item.caption ?? `Wideo: ${title}`}
      />
    </div>
  );
};

export default MediaFrame;
