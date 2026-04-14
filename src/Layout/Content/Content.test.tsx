import React from "react";
import { render, screen } from "@testing-library/react";
import Content, { ContentRow } from "./Content";

describe("Content Component", () => {
  it("renders padded content with layout modifiers", () => {
    render(
      <Content pad="horizontal" grow wide>
        Section body
      </Content>,
    );

    const content = screen.getByTestId("Content");
    expect(content).toHaveTextContent("Section body");
    expect(content).toHaveClass("pad-horizontal");
    expect(content).toHaveClass("grow");
    expect(content).toHaveClass("wide");
  });

  it("renders ContentRow as a row-oriented content wrapper", () => {
    render(<ContentRow pad>Row item</ContentRow>);
    const row = screen.getByTestId("ContentRow");

    expect(row).toHaveTextContent("Row item");
    expect(row).toHaveClass("content-row");
    expect(row).toHaveClass("pad");
  });
});
