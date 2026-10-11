import { Link } from "react-router";
import { karateFacts, karateHistory } from "@/data/learning";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import ContentSources from "@/features/learning/components/ContentSources";

export default function TriviaPage() {
  useDocumentTitle("Ciekawostki — historia karate i Kyokushin | Kihon");

  return (
    <div className="section learning-page">
      <header className="learning-heading">
        <p className="learning-eyebrow">Historia / kultura / Kyokushin</p>
        <h1>Za każdym ruchem<br /><em>jest historia.</em></h1>
        <p>Od Okinawy do dojo Masutatsu Ōyamy. Poznaj kilka wydarzeń i pojęć, które nadają treningowi szerszy kontekst.</p>
      </header>
      <section className="history-section" aria-labelledby="history-heading">
        <h2 id="history-heading">Krótka historia karate i Kyokushin</h2>
        <ol className="history-timeline">
          {karateHistory.map((entry) => (
            <li key={entry.id}>
              <span className="history-period">{entry.period}</span>
              <div><h3>{entry.title}</h3><p>{entry.body}</p><ContentSources sources={entry.sources} /></div>
            </li>
          ))}
        </ol>
      </section>
      <section aria-labelledby="facts-heading">
        <h2 className="learning-section-title" id="facts-heading">Warto wiedzieć</h2>
        <div className="facts-grid">
          {karateFacts.map((fact, index) => (
            <article className="fact-card" key={fact.id}>
              <span className="learning-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{fact.title}</h3><p>{fact.body}</p><ContentSources sources={fact.sources} />
            </article>
          ))}
        </div>
      </section>
      <aside className="learning-next"><p>Nazwy z dojo nabierają znaczenia, gdy znasz ich tłumaczenie.</p><Link to="/slownik?kategoria=dojo-etykieta">Poznaj słownik karate →</Link></aside>
    </div>
  );
}
