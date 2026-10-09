import { resolveMediaSrc } from "@/features/technique/components/TechniqueIllustration";
import ZoneIllustration, { zoneForEntry } from "./ZoneIllustration";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";

interface GlossaryCardProps {
  entry: import("@/data/types").GlossaryEntry;
  category: import("@/data/types").GlossaryCategory;
  static?: boolean;
  onClick?: () => void;
}

export default function GlossaryCard({ entry, static: isStatic = false, onClick }: GlossaryCardProps) {
  const zone = zoneForEntry(entry.id);
  const isInteractive = !isStatic && typeof onClick === "function";

  return (
    <Card
      as={isInteractive ? "button" : "article"}
      className={`glossary-card${isStatic ? " static" : ""}`}
      onClick={onClick}
      aria-label={isInteractive ? `Otwórz hasło ${entry.term}` : undefined}
    >
      {entry.image ? (
        <span className="glossary-image">
          <img
            src={resolveMediaSrc(entry.image)}
            alt={entry.term}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 600px) 100vw, 50vw"
          />
        </span>
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