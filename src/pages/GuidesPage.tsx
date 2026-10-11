import { Link } from "react-router";
import { guides } from "@/data/learning";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import ContentSources from "@/features/learning/components/ContentSources";

export default function GuidesPage() {
  useDocumentTitle("Poradnik — przygotowanie do treningu | Kihon");

  return (
    <div className="section learning-page">
      <header className="learning-heading">
        <p className="learning-eyebrow">Poza techniką / codzienność w dojo</p>
        <h1>Dobrze przygotowany.<br /><em>Gotowy na trening.</em></h1>
        <p>Pas, strój i bandaże — proste instrukcje, do których możesz wrócić przed wyjściem do dojo.</p>
      </header>
      <nav className="guide-index" aria-label="Wybierz poradnik">
        {guides.map((guide, index) => (
          <Link key={guide.id} to={`#${guide.id}`}>
            <span className="learning-number">{String(index + 1).padStart(2, "0")}</span>
            <strong>{guide.title}</strong><small>{guide.steps.length} {new Intl.PluralRules("pl").select(guide.steps.length) === "few" ? "kroki" : "kroków"} <span aria-hidden="true">↗</span></small>
          </Link>
        ))}
      </nav>
      <div className="guide-articles">
        {guides.map((guide, index) => (
          <article className="guide-article" id={guide.id} key={guide.id} aria-labelledby={`${guide.id}-title`}>
            <header>
              <span className="learning-number">{String(index + 1).padStart(2, "0")}</span>
              <p className="learning-eyebrow">{guide.tag}</p>
              <h2 id={`${guide.id}-title`}>{guide.title}</h2>
              <p>{guide.intro}</p>
              <div className="guide-equipment"><strong>Przygotuj</strong><p>{guide.equipment}</p></div>
            </header>
            <div>
              <ol className="guide-steps">
                {guide.steps.map((step, stepIndex) => (
                  <li key={step.title}>
                    <span aria-hidden="true">{String(stepIndex + 1).padStart(2, "0")}</span>
                    <div><h3>{step.title}</h3><p>{step.body}</p></div>
                  </li>
                ))}
              </ol>
              <p className="learning-note">{guide.note}</p>
              <ContentSources sources={guide.sources} />
            </div>
          </article>
        ))}
      </div>
      <aside className="learning-next"><p>Brakuje instrukcji, która przydałaby Ci się przed treningiem?</p><Link to="/kontakt">Zaproponuj kolejny poradnik →</Link></aside>
    </div>
  );
}
