import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getTechniqueById } from "@/data";
import TechniqueModal from "../TechniqueModal";

const technique = getTechniqueById("seiken-morote-tsuki")!;

describe("TechniqueModal", () => {
  it("otwiera galerię i zamyka się klawiszem Escape", () => {
    const onClose = vi.fn();
    render(<TechniqueModal technique={technique} onClose={onClose} />);

    expect(screen.getByRole("dialog", { name: /Szczegóły techniki/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Wszystkie" })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
