import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import GlossaryPage from "@/pages/GlossaryPage";
import { useModalStore } from "@/store/modalStore";

describe("GlossaryPage", () => {
  beforeEach(() => {
    useModalStore.setState({ active: null });
  });

  it("pokazuje nowe kategorie dłoni i stóp jako klikalne", () => {
    render(
      <MemoryRouter initialEntries={["/slownik?kategoria=ustawienia-dloni"]}>
        <GlossaryPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: /Ustawienia dłoni/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ustawienia stóp/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Otwórz hasło Pięść" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Ustawienia stóp/ }));

    expect(screen.getByRole("button", { name: "Otwórz hasło Krawędź stopy" })).toBeInTheDocument();
  });
});
