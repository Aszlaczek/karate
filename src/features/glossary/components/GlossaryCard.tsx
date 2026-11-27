import { getGlossaryCardMedia, STANCE_CATEGORY_ID } from "@/data";
import { prefetchGlossary } from "@/data/onDemand";
import CardThumbnail from "@/features/shared/components/CardThumbnail";
import ZoneIllustration, { zoneForEntry } from "./ZoneIllustration";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";

interface GlossaryCardProps {
  entry: import("@/data/types").GlossaryEntry;
  category: import("@/data/types").GlossaryCategory;
  static?: boolean;
  onClick?: () => void;
}

export default function GlossaryCard({
  entry,
  category,
  static: isStatic = false,
  onClick,
}: GlossaryCardProps) {
  const zone = zoneForEntry(entry.id);
  const isInteractive = !isStatic && typeof onClick === "function";
  const { thumbnail: mediaThumbnail, firstIsVideo } = getGlossaryCardMedia(entry.id);
  const isStance = category.id === STANCE_CATEGORY_ID;
  const thumbnail = isStance && entry.image ? entry.image : mediaThumbnail;

  return (
    <Card
      as={isInteractive ? "button" : "article"}
      className={`glossary-card${isStatic ? " static" : ""}`}
      onClick={onClick}
      onMouseEnter={() => prefetchGlossary(entry.id)}
      onFocus={() => prefetchGlossary(entry.id)}
      aria-label={isInteractive ? `Otwórz hasło ${entry.term}` : undefined}
    >
      {thumbnail ? (
        <CardThumbnail
          src={thumbnail}
          alt={entry.term}
          className="glossary-image media-card-thumb"
          firstIsVideo={!isStance && firstIsVideo}
        />
      ) : entry.image ? (
        <CardThumbnail
          src={entry.image}
          alt={entry.term}
          className="glossary-image"
        />
      ) : zone ? (
        <span className="glossary-image diagram">
          <ZoneIllustration zone={zone} />
        </span>
      ) : null}
      <span className="glossary-japanese">{entry.japanese}</span>
      <span className="glossary-reading">
        Wymowa: <strong>{entry.reading}</strong>
      </span>
      <strong className="glossary-term">{entry.term}</strong>
      <span className="glossary-summary">{entry.description}</span>
      {!isStatic && (
        <span className="glossary-hint">
          Zobacz hasło <Icon name="arrow" size={14} />
        </span>
      )}
    </Card>
  );
}
