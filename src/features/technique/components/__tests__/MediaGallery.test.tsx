import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { MediaItem } from "@/data/types";
import MediaGallery from "../MediaGallery";

const PLACEHOLDER_ALT = "Wideo — przykład do zastąpienia nagraniem z dojo";

const items: MediaItem[] = [
  {
    type: "video",
    src: "/videos/test.mp4",
    label: "Film poglądowy",
    poster: "/images/test-poster.jpg",
    alt: PLACEHOLDER_ALT,
  },
  {
    type: "image",
    src: "/images/test-front.jpg",
    label: "Widok z przodu",
    alt: "Zdjęcie ustawienia dłoni",
  },
];

describe("MediaGallery", () => {
  it("nie pokazuje informacji o placeholderze jako widocznego podpisu, tylko jako alt/aria-label", () => {
    render(<MediaGallery items={items} title="Seiken" />);

    expect(screen.queryByText(PLACEHOLDER_ALT)).not.toBeInTheDocument();
    expect(screen.getAllByLabelText(PLACEHOLDER_ALT).length).toBeGreaterThan(0);
  });

  it("oznacza każdą miniaturę jako film albo zdjęcie", () => {
    render(<MediaGallery items={items} title="Seiken" />);

    expect(screen.getAllByText("▶ Film")).toHaveLength(1);
    expect(screen.getAllByText("▣ Zdjęcie")).toHaveLength(1);
  });

  it("pozwala przełączyć się między filmami i zdjęciami", () => {
    render(<MediaGallery items={items} title="Seiken" />);

    fireEvent.click(screen.getByRole("button", { name: "Zdjęcia" }));
    expect(screen.getByRole("img", { name: "Zdjęcie ustawienia dłoni" })).toBeInTheDocument();
    expect(screen.queryByLabelText(PLACEHOLDER_ALT)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Filmy" }));
    expect(screen.getAllByLabelText(PLACEHOLDER_ALT).length).toBeGreaterThan(0);
    expect(screen.queryByRole("img", { name: "Zdjęcie ustawienia dłoni" })).not.toBeInTheDocument();
  });

  it("pokazuje podpis tylko wtedy, gdy został wyraźnie ustawiony", () => {
    const withCaption: MediaItem[] = [{ ...items[1], caption: "Poprawny podpis ujęcia" }];
    render(<MediaGallery items={withCaption} title="Seiken" />);

    expect(screen.getByText("Poprawny podpis ujęcia")).toBeInTheDocument();
  });
});
