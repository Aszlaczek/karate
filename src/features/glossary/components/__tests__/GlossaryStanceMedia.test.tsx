import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { glossary } from "@/data";
import GlossaryCard from "../GlossaryCard";
import GlossaryEntryModal from "../GlossaryEntryModal";

const category = glossary.find((item) => item.id === "pozycje")!;
const noImageCategory = glossary.find((item) => item.id === "trening-komendy")!;
const entry = (id: string) => category.entries.find((item) => item.id === id)!;

describe("zdjęcie hasła słownika", () => {
  it("zostaje na kafelku jako miniatura z opisem hasła", () => {
    const expected = [
      ["fudo", "/images/glossary/stances/Fudo-Dachi.png"],
      ["seiza", "/images/glossary/stances/Seiza.jpg"],
    ];

    for (const [id, src] of expected) {
      const { container, unmount } = render(
        <GlossaryCard entry={entry(id)} category={category} static />,
      );
      const img = container.querySelector(".glossary-image img");

      expect(img).not.toBeNull();
      expect(img?.getAttribute("alt")).toBe(entry(id).term);
      expect(img?.getAttribute("src")).toContain(src);
      unmount();
    }
  });

  it("pojawia się w modalu jako jedyne zdjęcie, bez galerii", async () => {
    const { container } = render(
      <GlossaryEntryModal entry={entry("fudo")} category={category} onClose={vi.fn()} />,
    );

    expect(await screen.findByRole("img", { name: "Fudo dachi" })).toBeInTheDocument();
    expect(container.querySelector("img.glossary-photo")).not.toBeNull();
    expect(screen.queryByText(/1 \/ 1/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Nagranie z dojo/)).not.toBeInTheDocument();
  });

  it("dla hasła bez zdjęcia pokazuje placeholder", async () => {
    const { container } = render(
      <GlossaryEntryModal
        entry={noImageCategory.entries.find((item) => item.id === "kihon")!}
        category={noImageCategory}
        onClose={vi.fn()}
      />,
    );

    expect(await screen.findByText(/Wymowa:/)).toBeInTheDocument();
    expect(container.querySelector("img.glossary-photo")).toBeNull();
    expect(container.querySelector(".glossary-visual-placeholder")).not.toBeNull();
  });
});
