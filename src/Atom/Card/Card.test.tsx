import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Card from "./Card";

describe("Card Component", () => {
  it("renders content with the requested surface variant", () => {
    render(
      <Card type="primary" pad wide fill>
        Account summary
      </Card>,
    );

    const card = screen.getByRole("region");
    expect(card).toHaveTextContent("Account summary");
    expect(card).toHaveClass("type-primary");
    expect(card).toHaveClass("pad");
    expect(card).toHaveClass("wide");
    expect(card).toHaveClass("fill");
  });

  it("treats grow and fill as separate layout contracts", () => {
    render(
      <Card grow fill aria-label="Growing card">
        Flexible card
      </Card>,
    );

    const card = screen.getByRole("region", { name: "Growing card" });
    expect(card).toHaveClass("grow");
    expect(card).toHaveClass("fill");
  });

  it("forwards interactive props to the card container", () => {
    const handleClick = jest.fn();

    render(
      <Card
        onClick={handleClick}
        tabIndex={0}
        aria-label="Project card"
        className="interactive"
      >
        Quarterly roadmap
      </Card>,
    );

    const card = screen.getByRole("region", { name: "Project card" });
    fireEvent.click(card);

    expect(handleClick).toHaveBeenCalled();
    expect(card).toHaveAttribute("tabindex", "0");
    expect(card).toHaveClass("interactive");
  });
});
