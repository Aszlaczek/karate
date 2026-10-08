import { create } from "zustand";
import type { GlossaryCategory, GlossaryEntry, Technique } from "@/data/types";

type ModalState =
  | { kind: "technique"; technique: Technique }
  | { kind: "glossary"; entry: GlossaryEntry; category: GlossaryCategory };

interface ModalStore {
  active: ModalState | null;
  openTechnique: (technique: Technique) => void;
  openGlossaryEntry: (entry: GlossaryEntry, category: GlossaryCategory) => void;
  close: () => void;
}

const setHash = (hash: string) =>
  window.history.replaceState(null, "", `${window.location.pathname}${hash}`);

export const useModalStore = create<ModalStore>((set) => ({
  active: null,
  openTechnique: (technique) => {
    set({ active: { kind: "technique", technique } });
    setHash(`#technika-${technique.id}`);
  },
  openGlossaryEntry: (entry, category) => {
    set({ active: { kind: "glossary", entry, category } });
    setHash(`#haslo-${entry.id}`);
  },
  close: () => {
    set({ active: null });
    setHash("");
  },
}));

export const useModals = () => {
  const openTechnique = useModalStore((state) => state.openTechnique);
  const openGlossaryEntry = useModalStore((state) => state.openGlossaryEntry);
  return { openTechnique, openGlossaryEntry };
};
