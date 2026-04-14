import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Space from "./Space";

describe("Space Component", () => {
  it("applies spacing and alignment classes to its wrapper", () => {
    render(
      <Space gap direction="vertical" align="center" justify="between" wide>
        <div>One</div>
        <div>Two</div>
      </Space>,
    );

    const space = screen.getByTestId("Space");
    expect(space).toHaveClass("gap");
    expect(space).toHaveClass("direction-vertical");
    expect(space).toHaveClass("align-center");
    expect(space).toHaveClass("justify-between");
    expect(space).toHaveClass("wide");
  });

  it("forwards click handlers to the wrapper element", () => {
    const handleClick = jest.fn();
    render(
      <Space onClick={handleClick}>
        <button type="button">Press</button>
      </Space>,
    );

    fireEvent.click(screen.getByTestId("Space"));
    expect(handleClick).toHaveBeenCalled();
  });
});
