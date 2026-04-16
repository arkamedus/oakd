import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Space from "./Space";
import Row from "../../Layout/Row/Row";
import Column from "../../Layout/Column/Column";
import Card from "../Card/Card";
import Paragraph from "../Paragraph/Paragraph";
import Content from "../../Layout/Content/Content";

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

  it("supports stretch as an align mode and center/between as justify modes", () => {
    render(
      <>
        <Space align="stretch" justify="center">
          <div>Centered main axis</div>
        </Space>
        <Space justify="between">
          <div>Left</div>
          <div>Right</div>
        </Space>
      </>,
    );

    const [centeredSpace, betweenSpace] = screen.getAllByTestId("Space");
    expect(centeredSpace).toHaveClass("align-stretch");
    expect(centeredSpace).toHaveClass("justify-center");
    expect(betweenSpace).toHaveClass("justify-between");
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

  it("supports the vertical natural heights pattern without forcing grow or fill on the second items", () => {
    render(
      <Row gap>
        <Column xs={24} md={12}>
          <Space direction="vertical" gap wide>
            <Paragraph>Shared first item</Paragraph>
            <Card pad wide>
              <Paragraph>Short second item</Paragraph>
            </Card>
          </Space>
        </Column>
        <Column xs={24} md={12}>
          <Space direction="vertical" gap wide>
            <Paragraph>Shared first item</Paragraph>
            <Card pad wide style={{ minHeight: 180 }}>
              <Paragraph>Taller second item</Paragraph>
            </Card>
          </Space>
        </Column>
      </Row>,
    );

    const shortCard = screen.getByText("Short second item").closest("[data-testid='Card']");
    const tallCard = screen.getByText("Taller second item").closest("[data-testid='Card']");

    expect(shortCard).not.toHaveClass("grow");
    expect(shortCard).not.toHaveClass("fill");
    expect(tallCard).not.toHaveClass("grow");
    expect(tallCard).not.toHaveClass("fill");
    expect(tallCard).toHaveStyle({ minHeight: "180px" });
  });

  it("supports the vertical grow on second child pattern by keeping the left item natural and the right item as the grow host", () => {
    render(
      <Card pad wide fill>
        <Content grow fill>
          <Row gap fill>
            <Column xs={24} md={12}>
              <Card pad wide fill>
                <Space direction="vertical" gap wide fill align="stretch">
                  <Paragraph>Natural second item in a full-height stack</Paragraph>
                  <Card pad wide style={{ minHeight: 120 }}>
                    <Paragraph>
                      The stack fills the panel, but this item keeps its natural height and leaves the remaining space below it.
                    </Paragraph>
                  </Card>
                </Space>
              </Card>
            </Column>
            <Column xs={24} md={12}>
              <Card pad wide fill>
                <Space direction="vertical" gap wide fill align="stretch">
                  <Paragraph>Grow on second item in a full-height stack</Paragraph>
                  <Content grow fill wide>
                    <Card pad wide grow fill>
                      <Paragraph>
                        The stack fills the panel, and this card grows to consume the remaining height.
                      </Paragraph>
                    </Card>
                  </Content>
                </Space>
              </Card>
            </Column>
          </Row>
        </Content>
      </Card>,
    );

    const naturalCard = screen
      .getByText(
        "The stack fills the panel, but this item keeps its natural height and leaves the remaining space below it.",
      )
      .closest("[data-testid='Card']");
    const growCard = screen
      .getByText("The stack fills the panel, and this card grows to consume the remaining height.")
      .closest("[data-testid='Card']");
    const growHost = growCard?.parentElement;

    expect(naturalCard).not.toHaveClass("fill");
    expect(naturalCard).not.toHaveClass("grow");
    expect(growHost).toHaveClass("grow");
    expect(growHost).toHaveClass("fill");
    expect(growCard).toHaveClass("fill");
    expect(growCard).toHaveClass("grow");
  });
});
