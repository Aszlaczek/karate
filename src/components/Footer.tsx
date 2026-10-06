import { Link } from "react-router";

const Footer = () => (
  <footer>
    <div className="brand inverse"><span className="brand-mark">極</span><span><strong>KIHON</strong><small>droga do egzaminu</small></span></div>
    <p>Ucz się świadomie. Trenuj wytrwale. <strong>Osu.</strong></p>
    <Link to="/">Wróć na górę ↑</Link>
  </footer>
);

export default Footer;
