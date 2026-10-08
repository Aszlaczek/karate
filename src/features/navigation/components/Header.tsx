import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import Icon from "@/components/ui/Icon";
import { useUiStore } from "@/store/uiStore";

const Header = () => {
  const location = useLocation();
  const open = useUiStore((state) => state.mobileMenuOpen);
  const toggleMenu = useUiStore((state) => state.toggleMobileMenu);
  const closeMenu = useUiStore((state) => state.closeMobileMenu);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => closeMenu(), [location, closeMenu]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, closeMenu]);

  return (
    <header className="site-header" ref={headerRef}>
      <Link className="brand" to="/" aria-label="Kihon — strona główna">
        <span className="brand-mark">極</span>
        <span><strong>KIHON</strong><small>droga do egzaminu</small></span>
      </Link>
      <nav id="site-menu" className={open ? "open" : undefined} aria-label="Główna nawigacja">
        <Link to="/#stopnie">Stopnie</Link>
        <Link className={location.pathname === "/techniki" ? "active" : ""} to="/techniki">Techniki</Link>
        <Link className={location.pathname === "/slownik" ? "active" : ""} to="/slownik">Słownik</Link>
        <Link to="/#dojo-kun">Dojo-kun</Link>
        <Link className="nav-cta" to="/#stopnie">Sprawdź wymagania <Icon name="arrow" size={17} /></Link>
      </nav>
      <Link className="header-cta" to="/#stopnie">Sprawdź wymagania <Icon name="arrow" size={17} /></Link>
      <button
        type="button"
        className="menu-toggle"
        aria-label={open ? "Zamknij menu" : "Otwórz menu"}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={toggleMenu}
      >
        <Icon name={open ? "close" : "menu"} size={20} />
      </button>
    </header>
  );
};

export default Header;
