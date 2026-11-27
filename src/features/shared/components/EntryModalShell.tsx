import type { ReactNode } from "react";
import Icon from "@/components/ui/Icon";
import type { TechniqueKnowledge } from "@/data/types";
import TechniqueKnowledgeContent from "@/features/technique/components/TechniqueKnowledgeContent";
import { useModalBase } from "@/hooks/useModalBase";

interface EntryModalShellProps {
  ariaLabel: string;
  closeLabel: string;
  onClose: () => void;
  className?: string;
  panelClassName?: string;
  visualClassName?: string;
  copyClassName?: string;
  category: string;
  overline: string;
  kanji: string;
  eyebrow: string;
  title: string;
  reading: string;
  visual: ReactNode;
  knowledge: TechniqueKnowledge | null;
  description: string;
  beforeDetail?: ReactNode;
  afterDetail?: ReactNode;
  safetyNote: string;
}

const join = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(" ");

/** Wspólny szkielet okna szczegółów: technika i hasło słownika mają identyczną strukturę. */
export default function EntryModalShell({
  ariaLabel,
  closeLabel,
  onClose,
  className,
  panelClassName,
  visualClassName,
  copyClassName,
  category,
  overline,
  kanji,
  eyebrow,
  title,
  reading,
  visual,
  knowledge,
  description,
  beforeDetail,
  afterDetail,
  safetyNote,
}: EntryModalShellProps) {
  const { onBackdropMouseDown } = useModalBase(onClose);

  return (
    <div
      className={join("tech-modal", className)}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onMouseDown={onBackdropMouseDown}
    >
      <div className={join("tech-modal-panel", panelClassName)}>
        <button className="modal-close" aria-label={closeLabel} onClick={onClose}>
          <Icon name="close" />
        </button>
        <div className={join("visualization-stage", visualClassName)}>
          <div className="visualization-topline">
            <span>{category}</span>
            <small>{overline}</small>
          </div>
          {visual}
        </div>
        <div className={join("visualization-copy", copyClassName)}>
          <span className="modal-kanji" lang="ja" aria-hidden="true">{kanji}</span>
          <p className="modal-eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p className="modal-reading">Wymowa: <strong>{reading}</strong></p>
          {beforeDetail}
          {knowledge ? (
            <TechniqueKnowledgeContent knowledge={knowledge} />
          ) : (
            <p className="modal-description">{description}</p>
          )}
          {afterDetail}
          <p className="safety-note">{safetyNote}</p>
        </div>
      </div>
    </div>
  );
}
