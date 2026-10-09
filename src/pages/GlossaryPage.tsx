import { useState } from "react";
import { glossary } from "@/data";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import SectionHeading from "@/components/ui/SectionHeading";
import GlossaryToolbar from "@/features/glossary/components/GlossaryToolbar";
import GlossaryGrid from "@/features/glossary/components/GlossaryGrid";

const GlossaryPage = () => {
  const [activeId, setActiveId] = useState(glossary[0]?.id ?? "");
  const [query, setQuery] = useState("");

  useDocumentTitle("Słownik karate | Kihon");

  return (
    <section className="section glossary-section" id="slownik">
      <SectionHeading number="01" title="Słownik karate" subtitle="Strefy, części ciała i ustawienia stóp — części ciała opisane są na kartach; strefy i ustawienia stóp kliknij, aby zobaczyć wizualizację i powiązane techniki." />
      <GlossaryToolbar activeCategoryId={activeId} onCategoryChange={setActiveId} query={query} onQueryChange={setQuery} />
      <p className="glossary-description">{glossary.find((c) => c.id === activeId)?.description ?? ""}</p>
      <GlossaryGrid activeCategoryId={activeId} query={query} />
    </section>
  );
};

export default GlossaryPage;