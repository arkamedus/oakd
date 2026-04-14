import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Space from "./Space";

describe("Space Component", () => {
  it("applies spacing and alignment classes to its wrapper", () => {
    render(
      <Space
        gap
        direction="vertical"
        align="center"
        justify="between"
        wide
        fill
        grow
      >
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
    expect(space).toHaveClass("fill");
    expect(space).toHaveClass("grow");
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

  it("renders as a block layout container so block children remain valid DOM", () => {
    render(
      <Space direction="vertical">
        <p>Paragraph child</p>
        <div>Block child</div>
      </Space>,
    );

    const space = screen.getByTestId("Space");
    expect(space.tagName).toBe("DIV");
    expect(space).toContainElement(screen.getByText("Paragraph child"));
    expect(space).toContainElement(screen.getByText("Block child"));
  });

  it("supports the current vertical fill plus child grow composition", () => {
    render(
      <Space direction="vertical" wide fill>
        <div>Header</div>
        <div className="oakd grow">Body</div>
      </Space>,
    );

    const space = screen.getByTestId("Space");
    expect(space).toHaveClass("direction-vertical");
    expect(space).toHaveClass("wide");
    expect(space).toHaveClass("fill");
    expect(screen.getByText("Body")).toHaveClass("grow");
  });

  it("defaults vertical spaces to nowrap so filled layouts do not wrap into a second column", () => {
    render(
      <Space direction="vertical" fill wide>
        <div>Header</div>
        <div>Body</div>
      </Space>,
    );

    expect(screen.getByTestId("Space")).toHaveClass("nowrap");
  });

  it("still allows horizontal spaces to opt into nowrap explicitly", () => {
    render(
      <Space noWrap>
        <div>One</div>
        <div>Two</div>
      </Space>,
    );

    expect(screen.getByTestId("Space")).toHaveClass("nowrap");
  });
});
