import { useEffect } from "react";
import { useLocation } from "react-router";

// Zmiana trasy → początek strony; link z hashem → przewinięcie do kotwicy.
export const useScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Deep-linki modali obsługuje ModalHost, nie przewijanie strony.
      if (hash.startsWith("#technika-") || hash.startsWith("#haslo-")) return;
      let observer: MutationObserver | undefined;
      const scrollToTarget = () => {
        const target = document.getElementById(hash.slice(1));
        if (!target) return false;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        observer?.disconnect();
        return true;
      };
      const timer = window.setTimeout(() => {
        if (scrollToTarget()) return;
        // Strona lazy może pojawić się dopiero po pobraniu swojego modułu.
        observer = new MutationObserver(scrollToTarget);
        observer.observe(document.body, { childList: true, subtree: true });
      }, 80);
      return () => {
        window.clearTimeout(timer);
        observer?.disconnect();
      };
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
};
