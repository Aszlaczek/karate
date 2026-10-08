import { Route, Routes } from "react-router";
import { useScrollManager } from "@/hooks/useScrollManager";
import GlossaryPage from "@/pages/GlossaryPage";
import HomePage from "@/pages/HomePage";
import LevelPage from "@/pages/LevelPage";
import NotFoundPage from "@/pages/NotFoundPage";
import TechniquesPage from "@/pages/TechniquesPage";

const AppRoutes = () => {
  useScrollManager();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/kyu/:kyuId" element={<LevelPage />} />
      <Route path="/techniki" element={<TechniquesPage />} />
      <Route path="/slownik" element={<GlossaryPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
