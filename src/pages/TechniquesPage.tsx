import TechniquesSection from "@/features/technique/components/TechniquesSection";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const TechniquesPage = () => {
  useDocumentTitle("Atlas technik | Kihon");

  return <TechniquesSection />;
};

export default TechniquesPage;
