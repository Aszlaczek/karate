import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { MediaItem, MediaKind, MediaZone } from "@/data/types";
import Icon from "@/components/ui/Icon";
import MediaFrame from "./MediaFrame";
import { resolveMediaSrc } from "./media";

type MediaFilter = "all" | MediaKind;
type ZoneId = MediaZone | "other";

const FILTERS: { value: MediaFilter; label: string }[] = [
  { value: "all", label: "Wszystkie" },
  { value: "video", label: "Filmy" },
  { value: "image", label: "Zdjęcia" },
];

const ZONES: { id: ZoneId; label: string }[] = [
  { id: "jodan", label: "Jōdan — strefa górna" },
  { id: "chudan", label: "Chūdan — strefa środkowa" },
  { id: "gedan", label: "Gedan — strefa dolna" },
  { id: "other", label: "Bez strefy" },
];

interface MediaGalleryProps {
  items: MediaItem[];
  title: string;
  className?: string;
}

/** Galeria ujęć techniki, postawy lub hasła, pogrupowanych według stref. */
const MediaGallery = ({ items, title, className = "" }: MediaGalleryProps) => {
  const [filter, setFilter] = useState<MediaFilter>("all");
  const [activeSrc, setActiveSrc] = useState(items[0]?.src ?? "");
  const thumbsRef = useRef(new Map<number, HTMLButtonElement>());

  const availableFilters = useMemo(() => {
    const kinds = new Set(items.map((item) => item.type));
    return FILTERS.filter(({ value }) => value === "all" || kinds.has(value));
  }, [items]);

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((item) => item.type === filter)),
    [items, filter],
  );

  const groups = useMemo(
    () => ZONES
      .map((zone) => ({
        ...zone,
        entries: visible
          .map((item, index) => ({ item, index }))
          .filter(({ item }) => (item.zone ?? "other") === zone.id),
      }))
      .filter((group) => group.entries.length > 0),
    [visible],
  );

  const activeIndex = Math.max(0, visible.findIndex((item) => item.src === activeSrc));
  const active = visible[activeIndex] ?? items[0];

  const changeFilter = (next: MediaFilter) => {
    setFilter(next);
    const nextVisible = next === "all" ? items : items.filter((item) => item.type === next);
    setActiveSrc(nextVisible[0]?.src ?? "");
  };

  const selectThumb = (index: number) => {
    const item = visible[index];
    if (!item) return;
    setActiveSrc(item.src);
    thumbsRef.current.get(index)?.focus();
  };

  const onThumbsKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    selectThumb((activeIndex + step + visible.length) % visible.length);
  };

  if (!active) return null;

  return (
    <div className={`media-gallery ${className}`.trim()}>
      <div className="media-gallery-stage">
        <MediaFrame item={active} title={title} frameClassName="media-gallery-frame" />
        <span className="media-gallery-counter">
          {activeIndex + 1} / {visible.length}
        </span>
        {active.caption && <p className="media-gallery-caption">{active.caption}</p>}
      </div>
      <div className="media-gallery-controls">
        {availableFilters.length > 1 && (
          <div className="media-gallery-filters" role="group" aria-label="Rodzaj materiału">
            {availableFilters.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className="media-gallery-filter"
                aria-pressed={filter === value}
                onClick={() => changeFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <div className="media-gallery-groups">
          {groups.map((group) => (
            <div className="media-gallery-group" key={group.id}>
              {groups.length > 1 && <h4 className="media-gallery-group-title">{group.label}</h4>}
              <div
                className="media-gallery-thumbs"
                role="group"
                aria-label={`Wybierz ujęcie — ${group.label}`}
                onKeyDown={onThumbsKeyDown}
              >
                {group.entries.map(({ item, index }) => {
                  const thumb = item.type === "image" ? item.src : item.poster;
                  return (
                    <button
                      key={item.src}
                      type="button"
                      ref={(element) => {
                        if (element) thumbsRef.current.set(index, element);
                        else thumbsRef.current.delete(index);
                      }}
                      className={`media-gallery-thumb${index === activeIndex ? " is-active" : ""}`}
                      aria-pressed={index === activeIndex}
                      aria-label={`${item.label} — ${item.type === "video" ? "film" : "zdjęcie"}`}
                      onClick={() => setActiveSrc(item.src)}
                    >
                      <span className="media-gallery-thumb-media">
                        {thumb ? (
                          <img src={resolveMediaSrc(thumb)} alt="" loading="lazy" decoding="async" />
                        ) : (
                          <Icon name={item.type === "video" ? "play" : "image"} size={20} />
                        )}
                        <span className={`media-gallery-type-badge is-${item.type}`}>
                          {item.type === "video" ? "▶ Film" : "▣ Zdjęcie"}
                        </span>
                      </span>
                      <span className="media-gallery-thumb-label">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaGallery;
