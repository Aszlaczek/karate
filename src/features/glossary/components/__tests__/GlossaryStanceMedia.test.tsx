import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { glossary } from "@/data";
import GlossaryCard from "../GlossaryCard";
import GlossaryEntryModal from "../GlossaryEntryModal";

const category = glossary.find((item) => item.id === "pozycje")!;
const entry = (id: string) => category.entries.find((item) => item.id === id)!;

describe("zdjęcie postawy", () => {
  it("zostaje na kafelku jako dekoracyjna miniatura", () => {
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
      expect(img?.getAttribute("alt")).toBe("");
      expect(img?.getAttribute("src")).toContain(src);
      unmount();
    }
  });

  it("nie pojawia się w modalu postawy z filmami", () => {
    const { container } = render(
      <GlossaryEntryModal
        entry={entry("fudo")}
        category={category}
        onClose={vi.fn()}
      />,
    );

    expect(container.querySelector("img.glossary-photo")).toBeNull();
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Nagranie z dojo/i).length).toBeGreaterThan(0);
    expect(screen.queryByRole("img", { name: /zdjęcie postawy/i })).not.toBeInTheDocument();
  });

  it("dla postawy bez filmu pokazuje placeholder zamiast zdjęcia", () => {
    const { container } = render(
      <GlossaryEntryModal
        entry={entry("seiza")}
        category={category}
        onClose={vi.fn()}
      />,
    );

    expect(container.querySelector("img.glossary-photo")).toBeNull();
    expect(container.querySelector(".glossary-visual-placeholder")).not.toBeNull();
  });
});
