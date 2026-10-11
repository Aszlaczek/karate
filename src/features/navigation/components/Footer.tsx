import { Link } from "react-router";

const Footer = () => (
  <footer>
    <div className="brand inverse"><span className="brand-mark">極</span><span><strong>KIHON</strong><small>droga do egzaminu</small></span></div>
    <p>Ucz się świadomie. Trenuj wytrwale. <strong>Osu.</strong></p>
    <div className="footer-links"><Link to="/kontakt">Zgłoś pomysł lub poprawkę</Link><Link to="/">Wróć na górę ↑</Link></div>
  </footer>
);

export default Footer;
