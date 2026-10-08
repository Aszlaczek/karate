import { Link } from "react-router";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const NotFoundPage = () => {
  useDocumentTitle("Nie znaleziono strony | Kihon");

  return (
    <section className="section not-found">
      <span className="section-number">404</span>
      <h1>Ta strona nie istnieje</h1>
      <p>Adres mógł się zmienić — wróć do przewodnika i wybierz swój stopień.</p>
      <div className="hero-actions">
        <Link className="primary-button" to="/">Strona główna</Link>
        <Link className="text-link" to="/#stopnie">Lista stopni</Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
