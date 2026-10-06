import { Link, useLocation } from "react-router";
import Icon from "./Icon";

const Header = () => {
  const location = useLocation();

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Kihon — strona główna">
        <span className="brand-mark">極</span>
        <span><strong>KIHON</strong><small>droga do egzaminu</small></span>
      </Link>
      <nav aria-label="Główna nawigacja">
        <Link to="/#stopnie">Stopnie</Link>
        <Link className={location.pathname === "/techniki" ? "active" : ""} to="/techniki">Techniki</Link>
        <Link className={location.pathname === "/slownik" ? "active" : ""} to="/slownik">Słownik</Link>
        <Link to="/#dojo-kun">Dojo-kun</Link>
      </nav>
      <Link className="header-cta" to="/#stopnie">Sprawdź wymagania <Icon name="arrow" size={17} /></Link>
    </header>
  );
};

export default Header;
