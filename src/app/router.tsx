import { Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
import { useScrollManager } from "@/hooks/useScrollManager";
import GlossaryPage from "@/pages/GlossaryPage";
import HomePage from "@/pages/HomePage";
import LevelPage from "@/pages/LevelPage";
import NotFoundPage from "@/pages/NotFoundPage";
import TechniquesPage from "@/pages/TechniquesPage";
const GuidesPage = lazy(() => import("@/pages/GuidesPage"));
const TriviaPage = lazy(() => import("@/pages/TriviaPage"));
const FeedbackPage = lazy(() => import("@/pages/FeedbackPage"));

const AppRoutes = () => {
  useScrollManager();

  return (
    <Suspense fallback={<p className="section" role="status">Wczytywanie strony…</p>}>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/kyu/:kyuId" element={<LevelPage />} />
      <Route path="/techniki" element={<TechniquesPage />} />
      <Route path="/slownik" element={<GlossaryPage />} />
      <Route path="/poradnik" element={<GuidesPage />} />
      <Route path="/ciekawostki" element={<TriviaPage />} />
      <Route path="/kontakt" element={<FeedbackPage />} />
      <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
