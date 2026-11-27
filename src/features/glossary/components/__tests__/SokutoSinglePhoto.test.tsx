import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { glossary } from "@/data";
import GlossaryCard from "../GlossaryCard";
import GlossaryEntryModal from "../GlossaryEntryModal";

const category = glossary.find((item) => item.id === "ustawienia-stopy")!;
const sokuto = category.entries.find((item) => item.id === "sokuto")!;

describe("sokuto w ustawieniach stopy", () => {
  it("na kafelku pokazuje jedno zdjęcie z atrybutami hasła", () => {
    const { container } = render(<GlossaryCard entry={sokuto} category={category} static />);
    const images = container.querySelectorAll(".glossary-image img");

    expect(images).toHaveLength(1);
    expect(images[0].getAttribute("src")).toContain("/images/glossary/human-parts/sokuto.svg");
    expect(images[0].getAttribute("alt")).toBe(sokuto.term);
  });

  it("w modalu pokazuje pojedyncze zdjęcie zamiast galerii", async () => {
    const { container } = render(
      <GlossaryEntryModal entry={sokuto} category={category} onClose={vi.fn()} />,
    );

    const photo = await screen.findByRole("img", { name: sokuto.term });
    expect(photo).toHaveClass("glossary-photo");
    expect(photo.getAttribute("src")).toContain("/images/glossary/human-parts/sokuto.svg");
    expect(container.querySelector(".media-gallery")).toBeNull();
    expect(container.querySelector(".media-gallery-counter")).toBeNull();
  });
});
