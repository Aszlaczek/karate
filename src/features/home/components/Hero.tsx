import { Link } from "react-router";
import { CATEGORIES, levels, techniques } from "@/data";
import Icon from "@/components/ui/Icon";

const Hero = () => (
  <section className="hero" id="start">
    <div className="hero-copy">
      <div className="eyebrow"><span /> KYOKUSHIN EXAM GUIDE</div>
      <h1>Każdy pas.<br /><em>Jeden kierunek.</em></h1>
      <p>Przejrzysty przewodnik po wymaganiach egzaminacyjnych, technikach i japońskim słownictwie karate Kyokushin.</p>
      <div className="hero-actions">
        <Link className="primary-button" to="/#stopnie">Wybierz swój pas <Icon name="arrow" size={18} /></Link>
        <Link className="text-link" to="/techniki"><Icon name="book" size={18} /> Otwórz bazę technik</Link>
      </div>
      <div className="hero-stats">
        <div><strong>{levels.length}</strong><span>poziomów drogi</span></div>
        <div><strong>{CATEGORIES.length - 1}</strong><span>grup technik</span></div>
        <div><strong>{techniques.length}</strong><span>technik w atlasie</span></div>
      </div>
    </div>
    <div className="hero-visual">
      <img src="https://images.unsplash.com/photo-1656653121475-e33829581294?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=90&w=1400" alt="Karateka zawiązujący czarny pas na białym dogi" />
      <div className="photo-wash" />
      <div className="hero-kanji">押忍</div>
      <div className="image-caption"><span>01</span><p><strong>OSU NO SEISHIN</strong>Duch wytrwałości</p></div>
    </div>
  </section>
);

export default Hero;
