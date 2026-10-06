import { useEffect, useMemo, useState } from "react";
import Icon from "../components/Icon";
import { useModals } from "../components/ModalProvider";
import { glossary } from "../data";

const GlossaryPage = () => {
  const [activeId, setActiveId] = useState(glossary[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const { openGlossaryEntry } = useModals();

  useEffect(() => {
    document.title = "Słownik karate | Kihon";
  }, []);

  const activeCategory = glossary.find((category) => category.id === activeId) ?? glossary[0];

  const filteredEntries = useMemo(() => {
    if (!activeCategory) return [];
    const needle = query.trim().toLowerCase();
    if (!needle) return activeCategory.entries;
    return activeCategory.entries.filter((entry) =>
      `${entry.term} ${entry.japanese} ${entry.reading} ${entry.description}`.toLowerCase().includes(needle),
    );
  }, [activeCategory, query]);

  if (!activeCategory) return null;

  return (
    <section className="section glossary-section" id="slownik">
      <div className="section-heading">
        <div><span className="section-number">01</span><h2>Słownik karate</h2></div>
        <p>Strefy, części ciała i ustawienia stóp — kliknij hasło, aby zobaczyć pełny opis i techniki powiązane.</p>
      </div>

      <div className="tech-toolbar">
        <div className="category-tabs">
          {glossary.map((category) => (
            <button className={category.id === activeCategory.id ? "active" : ""} key={category.id} onClick={() => setActiveId(category.id)}>
              {category.name} <i>{category.entries.length}</i>
            </button>
          ))}
        </div>
        <div className="tech-filters">
          <label className="search-box"><Icon name="search" size={18} /><input aria-label="Szukaj w słowniku" onChange={(event) => setQuery(event.target.value)} placeholder="Szukaj hasła..." value={query} /></label>
        </div>
      </div>

      <p className="glossary-description">{activeCategory.description}</p>

      <div className="glossary-grid">
        {filteredEntries.map((entry) => (
          <button
            className="glossary-card"
            key={entry.id}
            onClick={() => openGlossaryEntry(entry, activeCategory)}
            aria-label={`Otwórz hasło ${entry.term}`}
          >
            {entry.image && (
              <span className="glossary-image"><img src={entry.image} alt="" /></span>
            )}
            <span className="glossary-japanese">{entry.japanese}</span>
            <span className="glossary-reading">Wymowa: <strong>{entry.reading}</strong></span>
            <strong className="glossary-term">{entry.term}</strong>
            <span className="glossary-summary">{entry.description}</span>
            <span className="glossary-hint">Zobacz hasło <Icon name="arrow" size={14} /></span>
          </button>
        ))}
        {filteredEntries.length === 0 && <div className="empty-state">Brak haseł pasujących do „{query}”. Spróbuj innego słowa.</div>}
      </div>
    </section>
  );
};

export default GlossaryPage;
