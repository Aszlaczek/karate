import { useEffect } from "react";
import TechniquesSection from "../components/TechniquesSection";

const TechniquesPage = () => {
  useEffect(() => {
    document.title = "Atlas technik | Kihon";
  }, []);

  return <TechniquesSection />;
};

export default TechniquesPage;
