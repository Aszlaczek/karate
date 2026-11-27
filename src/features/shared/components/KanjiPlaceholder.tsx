interface KanjiPlaceholderProps {
  kanji: string;
  reading: string;
  className?: string;
  decorative?: boolean;
}

/** Zastępstwo brakującego medium w karcie i w modalu — kanji + wymowa. */
export default function KanjiPlaceholder({
  kanji,
  reading,
  className = "",
  decorative = false,
}: KanjiPlaceholderProps) {
  return (
    <div className={className} aria-hidden={decorative || undefined}>
      <span>{kanji}</span>
      <small>{reading}</small>
    </div>
  );
}
