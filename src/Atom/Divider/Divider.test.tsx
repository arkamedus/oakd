import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Divider from "./Divider";

describe("Divider Component", () => {
  it("renders a semantic separator with orientation metadata", () => {
    render(<Divider orientation="vertical" />);
    const divider = screen.getByRole("separator");

    expect(divider).toHaveClass("vertical");
    expect(divider).toHaveAttribute("aria-orientation", "vertical");
  });

  it("forwards standard DOM props to the separator element", () => {
    const handleMouseEnter = jest.fn();
    render(
      <Divider
        className="subtle"
        aria-label="Section divider"
        onMouseEnter={handleMouseEnter}
      />,
    );

    const divider = screen.getByRole("separator", { name: "Section divider" });
    fireEvent.mouseEnter(divider);

    expect(handleMouseEnter).toHaveBeenCalled();
    expect(divider).toHaveClass("subtle");
  });
});
