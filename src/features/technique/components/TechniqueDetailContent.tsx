import { useId } from "react";
import type { TechniqueDetail } from "@/data/types";

/** Wspólna treść szczegółów techniki i postawy; opisy pochodzą wyłącznie z JSON. */
const TechniqueDetailContent = ({ detail }: { detail: TechniqueDetail }) => {
  const headingId = useId();

  return (
    <div className="technique-detail-content">
      <section className="detail-section detail-name" aria-labelledby={headingId}>
        <h3 id={headingId}>Co oznacza nazwa?</h3>
        <p className="detail-translation">{detail.translation}</p>
        <dl className="detail-name-parts">
          {detail.nameParts.map((part, index) => (
            <div key={`${part.term}-${index}`}>
              <dt>{part.term}</dt>
              <dd>{part.polish}</dd>
            </div>
          ))}
        </dl>
        {detail.note && <p className="detail-note"><strong>Uwaga do nazwy</strong>{detail.note}</p>}
      </section>
      {detail.sections.map((section, index) => (
        <section className="detail-section" key={section.title}>
          <h3><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{section.title}</h3>
          <p>{section.body}</p>
        </section>
      ))}
    </div>
  );
};

export default TechniqueDetailContent;
