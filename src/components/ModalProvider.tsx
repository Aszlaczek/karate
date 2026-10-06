import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getGlossaryEntry, getTechniqueById } from "../data";
import type { GlossaryCategory, GlossaryEntry, Technique } from "../data/types";
import GlossaryEntryModal from "./GlossaryEntryModal";
import TechniqueModal from "./TechniqueModal";

type ModalState =
  | { kind: "technique"; technique: Technique }
  | { kind: "glossary"; entry: GlossaryEntry; category: GlossaryCategory };

interface ModalsApi {
  openTechnique: (technique: Technique) => void;
  openGlossaryEntry: (entry: GlossaryEntry, category: GlossaryCategory) => void;
}

const ModalContext = createContext<ModalsApi>({
  openTechnique: () => {},
  openGlossaryEntry: () => {},
});

export const useModals = () => useContext(ModalContext);

const setHash = (hash: string) =>
  window.history.replaceState(null, "", `${window.location.pathname}${hash}`);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [active, setActive] = useState<ModalState | null>(null);

  useEffect(() => {
    const techniqueMatch = /^#technika-(.+)$/.exec(window.location.hash);
    if (techniqueMatch) {
      const technique = getTechniqueById(techniqueMatch[1]);
      if (technique) {
        setActive({ kind: "technique", technique });
        return;
      }
    }
    const glossaryMatch = /^#haslo-(.+)$/.exec(window.location.hash);
    if (glossaryMatch) {
      const lookup = getGlossaryEntry(glossaryMatch[1]);
      if (lookup) setActive({ kind: "glossary", ...lookup });
    }
  }, []);

  const api: ModalsApi = {
    openTechnique: (technique) => {
      setActive({ kind: "technique", technique });
      setHash(`#technika-${technique.id}`);
    },
    openGlossaryEntry: (entry, category) => {
      setActive({ kind: "glossary", entry, category });
      setHash(`#haslo-${entry.id}`);
    },
  };

  const close = () => {
    setActive(null);
    setHash("");
  };

  return (
    <ModalContext.Provider value={api}>
      {children}
      {active?.kind === "technique" && (
        <TechniqueModal technique={active.technique} onClose={close} />
      )}
      {active?.kind === "glossary" && (
        <GlossaryEntryModal
          entry={active.entry}
          category={active.category}
          onClose={close}
          onSelectTechnique={(technique) => api.openTechnique(technique)}
        />
      )}
    </ModalContext.Provider>
  );
};
