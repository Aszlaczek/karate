import { Link } from "react-router";
import DojoKun from "@/features/dojo/components/DojoKun";
import Hero from "@/features/home/components/Hero";
import BeltPath from "@/features/level/components/BeltPath";
import TechniquesSection from "@/features/technique/components/TechniquesSection";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { glossary } from "@/data";

const HomePage = () => {
  useDocumentTitle("Kihon — droga do egzaminu | Kyokushin Exam Guide");

  return (
    <>
      <Hero />
      <section className="section belts-section" id="stopnie">
        <div className="section-heading">
          <div><span className="section-number">01</span><h2>Twoja droga do czarnego pasa</h2></div>
          <p>Wybierz stopień, aby zobaczyć zakres egzaminu. Pas z belką oznacza drugi stopień w danym kolorze.</p>
        </div>
        <BeltPath />
      </section>
      <TechniquesSection />
      <section className="section glossary-teaser" id="slownik">
        <div className="section-heading">
          <div><span className="section-number">03</span><h2>Słownik karate</h2></div>
          <p>Strefy, części ciała i ustawienia stóp — słownictwo, bez którego nie zrozumiesz komend na egzaminie.</p>
        </div>
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
