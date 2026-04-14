import React from "react";
import { render, screen } from "@testing-library/react";
import Title from "./Title";

describe("Title Component", () => {
  it("renders heading content as an h1", () => {
    render(<Title>Project Overview</Title>);
    const heading = screen.getByRole("heading", { name: "Project Overview" });

    expect(heading.tagName).toBe("H1");
    expect(heading).toHaveClass("title-default");
  });

  it("applies size classes and forwards DOM attributes", () => {
    render(
      <Title size="large" id="project-title" aria-live="polite">
        Build Status
      </Title>,
    );

    const heading = screen.getByRole("heading", { name: "Build Status" });
    expect(heading).toHaveClass("title-large");
    expect(heading).toHaveAttribute("id", "project-title");
    expect(heading).toHaveAttribute("aria-live", "polite");
  });
});
