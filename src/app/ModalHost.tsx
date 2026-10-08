import { useEffect } from "react";
import { getGlossaryEntry, getTechniqueById } from "@/data";
import GlossaryEntryModal from "@/features/glossary/components/GlossaryEntryModal";
import TechniqueModal from "@/features/technique/components/TechniqueModal";
import { useModalStore } from "@/store/modalStore";

// Renderuje aktywny modal; przy pierwszym renderze otwiera go z deep-linka
// (#technika-<id> / #haslo-<id>).
const ModalHost = () => {
  const active = useModalStore((state) => state.active);
  const close = useModalStore((state) => state.close);

  useEffect(() => {
    const techniqueMatch = /^#technika-(.+)$/.exec(window.location.hash);
    if (techniqueMatch) {
      const technique = getTechniqueById(techniqueMatch[1]);
      if (technique) {
        useModalStore.setState({ active: { kind: "technique", technique } });
        return;
      }
    }
    const glossaryMatch = /^#haslo-(.+)$/.exec(window.location.hash);
    if (glossaryMatch) {
      const lookup = getGlossaryEntry(glossaryMatch[1]);
      if (lookup) {
        useModalStore.setState({ active: { kind: "glossary", ...lookup } });
      }
    }
  }, []);

  if (active?.kind === "technique") {
    return <TechniqueModal technique={active.technique} onClose={close} />;
  }
  if (active?.kind === "glossary") {
    return (
      <GlossaryEntryModal
        entry={active.entry}
        category={active.category}
        onClose={close}
      />
    );
  }
  return null;
};

export default ModalHost;
