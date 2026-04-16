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

  it("supports nested grow composition for leftover-height layouts", () => {
    render(
      <Content grow pad>
        <div>Header</div>
        <Content grow>Body</Content>
      </Content>,
    );

    const contents = screen.getAllByTestId("Content");
    expect(contents[0]).toHaveClass("grow");
    expect(contents[1]).toHaveClass("grow");
    expect(contents[1]).toHaveTextContent("Body");
  });

  it("supports a grow region hosting a direct fill child", () => {
    render(
      <Content grow pad>
        <div>Header</div>
        <Content grow fill>
          <div data-testid="FillChild" className="fill">
            Body
          </div>
        </Content>
      </Content>,
    );

    const contents = screen.getAllByTestId("Content");
    expect(contents[1]).toHaveClass("grow");
    expect(contents[1]).toHaveClass("fill");
    expect(screen.getByTestId("FillChild")).toHaveTextContent("Body");
  });

  it("supports a grow region hosting an inner scroll region", () => {
    render(
      <Content grow pad>
        <div>Header</div>
        <Content grow fill style={{ minHeight: 0, overflow: "hidden" }}>
          <Content grow fill style={{ minHeight: 0, overflowY: "auto" }}>
            Scroll body
          </Content>
        </Content>
      </Content>,
    );

    expect(screen.getAllByTestId("Content")[1]).toHaveClass("grow");
    expect(screen.getAllByTestId("Content")[1]).toHaveClass("fill");
    expect(screen.getByText("Scroll body").closest("[data-testid='Content']")).toHaveStyle({
      overflowY: "auto",
    });
  });
});
