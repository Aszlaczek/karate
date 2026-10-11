import { useState } from "react";
import { useSearchParams } from "react-router";
import { glossary } from "@/data";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import SectionHeading from "@/components/ui/SectionHeading";
import GlossaryToolbar from "@/features/glossary/components/GlossaryToolbar";
import GlossaryGrid from "@/features/glossary/components/GlossaryGrid";
import ContentSources from "@/features/learning/components/ContentSources";

const GlossaryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeId =
    glossary.find((category) => category.id === searchParams.get("kategoria"))
      ?.id ?? glossary[0].id;
  const setActiveId = (id: string) => {
    setSearchParams(
      (previous) => {
        previous.set("kategoria", id);
        return previous;
      },
      { replace: true },
    );
    setQuery("");
  };
  const [query, setQuery] = useState("");
  const activeCategory = glossary.find((category) => category.id === activeId);

  useDocumentTitle("Słownik karate | Kihon");

  return (
    <section className="section glossary-section" id="slownik">
      <SectionHeading
        number="01"
        title="Słownik karate"
        subtitle="Od nazw technik po komendy i strój. Wybierz kategorię i wyszukaj hasło; kliknij kartę, aby przeczytać opis."
      />
      <GlossaryToolbar
        activeCategoryId={activeId}
        onCategoryChange={setActiveId}
        query={query}
        onQueryChange={setQuery}
      />
      <p className="glossary-description">
        {glossary.find((c) => c.id === activeId)?.description ?? ""}
      </p>
      <GlossaryGrid activeCategoryId={activeId} query={query} />
      {activeCategory?.sources && (
        <ContentSources sources={activeCategory.sources} />
      )}
    </section>
  );
};

export default GlossaryPage;
