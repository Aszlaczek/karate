import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { ModalProvider } from "./components/ModalProvider";
import GlossaryPage from "./pages/GlossaryPage";
import HomePage from "./pages/HomePage";
import LevelPage from "./pages/LevelPage";
import NotFoundPage from "./pages/NotFoundPage";
import TechniquesPage from "./pages/TechniquesPage";

const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const timer = window.setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

const App = () => (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <ModalProvider>
      <ScrollManager />
      <div className="app-shell">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/kyu/:kyuId" element={<LevelPage />} />
            <Route path="/techniki" element={<TechniquesPage />} />
            <Route path="/slownik" element={<GlossaryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ModalProvider>
  </BrowserRouter>
);

export default App;
