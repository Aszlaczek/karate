import { useMemo, useState, type ElementType } from "react";
import { glossary } from "@/data";
import ZoneIllustration, { zoneForEntry } from "@/features/glossary/components/ZoneIllustration";
import { resolveMediaSrc } from "@/features/technique/components/TechniqueIllustration";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useModals } from "@/store/modalStore";
import Icon from "@/components/ui/Icon";

const GlossaryPage = () => {
  const [activeId, setActiveId] = useState(glossary[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const { openGlossaryEntry } = useModals();

  useDocumentTitle("Słownik karate | Kihon");

  const activeCategory =
    glossary.find((category) => category.id === activeId) ?? glossary[0];

  const filteredEntries = useMemo(() => {
    if (!activeCategory) return [];
    const needle = query.trim().toLowerCase();
    if (!needle) return activeCategory.entries;
    return activeCategory.entries.filter((entry) =>
      `${entry.term} ${entry.japanese} ${entry.reading} ${entry.description}`
        .toLowerCase()
        .includes(needle),
    );
  }, [activeCategory, query]);

  if (!activeCategory) return null;
  const isStatic = activeCategory.id === "czesci-ciala";
  const Card: ElementType = isStatic ? "article" : "button";

  return (
    <section className="section glossary-section" id="slownik">
      <div className="section-heading">
        <div>
          <span className="section-number">01</span>
          <h2>Słownik karate</h2>
        </div>
        <p>
          Strefy, części ciała i ustawienia stóp — części ciała opisane są na
          kartach; strefy i ustawienia stóp kliknij, aby zobaczyć wizualizację
          i powiązane techniki.
        </p>
      </div>

      <div className="tech-toolbar">
        <div className="category-tabs">
          {glossary.map((category) => (
            <button
              className={category.id === activeCategory.id ? "active" : ""}
              key={category.id}
              onClick={() => setActiveId(category.id)}
            >
              {category.name} <i>{category.entries.length}</i>
            </button>
          ))}
        </div>
        <div className="tech-filters">
          <label className="search-box">
            <Icon name="search" size={18} />
            <input
              aria-label="Szukaj w słowniku"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Szukaj hasła..."
              value={query}
            />
          </label>
        </div>
      </div>

      <p className="glossary-description">{activeCategory.description}</p>

      <div className="glossary-grid">
        {filteredEntries.map((entry) => {
          const zone = zoneForEntry(entry.id);
          return (
            <Card
              className={`glossary-card${isStatic ? " static" : ""}`}
              key={entry.id}
              onClick={isStatic ? undefined : () => openGlossaryEntry(entry, activeCategory)}
              aria-label={isStatic ? undefined : `Otwórz hasło ${entry.term}`}
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
        })}
        {filteredEntries.length === 0 && (
          <div className="empty-state">
            Brak haseł pasujących do „{query}”. Spróbuj innego słowa.
          </div>
        )}
      </div>
    </section>
  );
};

export default GlossaryPage;
