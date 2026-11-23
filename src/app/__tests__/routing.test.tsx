import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import AppRoutes from "@/app/router";
import { useModalStore } from "@/store/modalStore";

describe("routing", () => {
  it("renderuje wymagania dla trasy /kyu/9", async () => {
    useModalStore.setState({ active: null });

    render(
      <MemoryRouter initialEntries={["/kyu/9"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getAllByText(/9 kyu/).length).toBeGreaterThan(0);
    await waitFor(() => {
      expect(document.title).toContain("Wymagania 9 kyu");
    });
  });
});
