import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Row from "./Row";

describe("Row Component", () => {
  it("renders children in a row container with optional gap styling", () => {
    render(
      <Row gap>
        <div>Left</div>
        <div>Right</div>
      </Row>,
    );

    const row = screen.getByTestId("Row");
    expect(row).toHaveClass("row");
    expect(row).toHaveClass("gap");
    expect(row).toHaveTextContent("Left");
    expect(row).toHaveTextContent("Right");
  });

  it("forwards normal DOM interaction props", () => {
    const handleMouseEnter = jest.fn();
    render(
      <Row
        onMouseEnter={handleMouseEnter}
        role="group"
        aria-label="Toolbar row"
      />,
    );

    const row = screen.getByRole("group", { name: "Toolbar row" });
    fireEvent.mouseEnter(row);

    expect(handleMouseEnter).toHaveBeenCalled();
  });
});
