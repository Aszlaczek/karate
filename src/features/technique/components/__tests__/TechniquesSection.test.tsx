import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useModalStore } from "@/store/modalStore";
import TechniquesSection from "../TechniquesSection";

describe("TechniquesSection", () => {
  beforeEach(() => {
    useModalStore.setState({ active: null });
  });

  it("filtruje atlas po wpisanej frazie", () => {
    render(<TechniquesSection />);

    fireEvent.change(screen.getByLabelText("Szukaj techniki"), {
      target: { value: "morote" },
    });

    expect(
      screen.getByRole("button", { name: "Otwórz szczegóły techniki Seiken morote-tsuki" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Otwórz szczegóły techniki Saiha" }),
    ).not.toBeInTheDocument();
  });

  it("filtruje atlas po kategorii", () => {
    render(<TechniquesSection />);

    fireEvent.click(screen.getByRole("button", { name: "Kata" }));

    expect(
      screen.getByRole("button", { name: "Otwórz szczegóły techniki Saiha" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Otwórz szczegóły techniki Seiken morote-tsuki" }),
    ).not.toBeInTheDocument();
  });
});
