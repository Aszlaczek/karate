import { useId } from "react";
import type { TechniqueKnowledge } from "@/data/types";

/** Wspólna treść szczegółów techniki i postawy; opisy pochodzą wyłącznie z JSON. */
const TechniqueKnowledgeContent = ({ knowledge }: { knowledge: TechniqueKnowledge }) => {
  const headingId = useId();

  return (
    <div className="technique-detail-content">
      <section className="detail-section detail-name" aria-labelledby={headingId}>
        <h3 id={headingId}>Co oznacza nazwa?</h3>
        <p className="detail-translation">{knowledge.translation}</p>
        <dl className="detail-name-parts">
          {knowledge.nameParts.map((part, index) => (
            <div key={`${part.term}-${index}`}>
              <dt>{part.term}</dt>
              <dd>{part.polish}</dd>
            </div>
          ))}
        </dl>
        {knowledge.note && <p className="detail-note"><strong>Uwaga do nazwy</strong>{knowledge.note}</p>}
      </section>
      {knowledge.sections.map((section, index) => (
        <section className="detail-section" key={section.title}>
          <h3><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{section.title}</h3>
          <p>{section.body}</p>
        </section>
      ))}
    </div>
  );
};

export default TechniqueKnowledgeContent;
