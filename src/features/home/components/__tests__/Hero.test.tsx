import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import Hero from "../Hero";

describe("Hero", () => {
  it("używa lokalnego zdjęcia zamiast Unsplash", () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    );

    const img = screen.getByRole("img", {
      name: "Karateka zawiązujący czarny pas na białym dogi",
    });

    expect(img.getAttribute("src")).toContain("images/hero/osu-no-seishin.jpg");
    expect(img.getAttribute("src")).not.toContain("unsplash");
  });
});
