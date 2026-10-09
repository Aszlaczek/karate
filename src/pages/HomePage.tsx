import { Link } from "react-router";
import DojoKun from "@/features/dojo/components/DojoKun";
import Hero from "@/features/home/components/Hero";
import BeltPath from "@/features/level/components/BeltPath";
import TechniquesSection from "@/features/technique/components/TechniquesSection";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { glossary } from "@/data";
import SectionHeading from "@/components/ui/SectionHeading";

const HomePage = () => {
  useDocumentTitle("Kihon — droga do egzaminu | Kyokushin Exam Guide");

  return (
    <>
      <Hero />
      <section className="section belts-section" id="stopnie">
        <SectionHeading number="01" title="Twoja droga do czarnego pasa" subtitle="Wybierz stopień, aby zobaczyć zakres egzaminu. Pas z belką oznacza drugi stopień w danym kolorze." />
        <BeltPath />
      </section>
      <TechniquesSection />
      <section className="section glossary-teaser" id="slownik">
        <SectionHeading number="03" title="Słownik karate" subtitle="Strefy, części ciała i ustawienia stóp — słownictwo, bez którego nie zrozumiesz komend na egzaminie." />
        <div className="teaser-grid">
          {glossary.map((category) => (
            <Link className="teaser-card" key={category.id} to="/slownik">
              <span className="teaser-count">{String(category.entries.length).padStart(2, "0")}</span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <span className="teaser-link">Otwórz słownik →</span>
            </Link>
          ))}
        </div>
      </section>
      <DojoKun />
    </>
  );
};

export default HomePage;