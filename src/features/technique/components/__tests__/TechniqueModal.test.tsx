import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getTechniqueById } from "@/data";
import TechniqueModal from "../TechniqueModal";

const technique = getTechniqueById("seiken-morote-tsuki")!;

describe("TechniqueModal", () => {
  it("ładuje galerię techniki i zamyka się klawiszem Escape", async () => {
    const onClose = vi.fn();
    render(<TechniqueModal technique={technique} onClose={onClose} />);

    expect(screen.getByRole("dialog", { name: /Szczegóły techniki/ })).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: "Wszystkie" })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
