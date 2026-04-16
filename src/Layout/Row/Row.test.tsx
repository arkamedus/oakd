import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Row from "./Row";
import Column from "../Column/Column";
import Content from "../Content/Content";
import Space from "../../Atom/Space/Space";
import Card from "../../Atom/Card/Card";
import Paragraph from "../../Atom/Paragraph/Paragraph";

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

  it("applies fill and grow layout modifiers", () => {
    render(
      <Row gap fill grow wide>
        <div>Panel</div>
      </Row>,
    );

    const row = screen.getByTestId("Row");
    expect(row).toHaveClass("gap");
    expect(row).toHaveClass("fill");
    expect(row).toHaveClass("grow");
    expect(row).toHaveClass("wide");
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

  it("supports equal-height column shells with a primary and support slice", () => {
    render(
      <div style={{ width: 1200, height: 500 }}>
        <Card pad wide fill>
          <Content grow fill>
            <Row gap fill>
              <Column xs={24} md={14}>
                <Content grow fill>
                  <Space direction="vertical" gap wide fill>
                    <Paragraph>Primary panel</Paragraph>
                    <Paragraph>Summary</Paragraph>
                    <Card pad wide grow fill aria-label="Primary body">
                      <Paragraph>Primary body</Paragraph>
                    </Card>
                  </Space>
                </Content>
              </Column>
              <Column xs={24} md={10}>
                <Content grow fill>
                  <Space direction="vertical" gap wide fill>
                    <Paragraph>Support panel</Paragraph>
                    <Card pad wide grow fill aria-label="Support body">
                      <Paragraph>Support body</Paragraph>
                    </Card>
                  </Space>
                </Content>
              </Column>
            </Row>
          </Content>
        </Card>
      </div>,
    );

    expect(screen.getByTestId("Row")).toHaveClass("fill");
    expect(screen.getByRole("region", { name: "Primary body" })).toHaveClass("grow");
    expect(screen.getByRole("region", { name: "Primary body" })).toHaveClass("fill");
    expect(screen.getByRole("region", { name: "Support body" })).toHaveClass("grow");
    expect(screen.getByRole("region", { name: "Support body" })).toHaveClass("fill");
  });

  it("supports a growing support rail card without requiring another wrapper inside the rail", () => {
    render(
      <div style={{ width: 1200, height: 500 }}>
        <Card pad wide fill>
          <Row gap fill>
            <Column xs={24} md={14}>
              <Card pad wide fill>
                <Paragraph>Primary panel</Paragraph>
              </Card>
            </Column>
            <Column xs={24} md={10}>
              <Content grow fill>
                <Space direction="vertical" gap wide fill>
                  <Paragraph>Support rail</Paragraph>
                  <Paragraph>Body grows here.</Paragraph>
                  <Card pad wide grow fill aria-label="Growing support body">
                    <Paragraph>Growing support body</Paragraph>
                  </Card>
                </Space>
              </Content>
            </Column>
          </Row>
        </Card>
      </div>,
    );

    expect(screen.getByTestId("Row")).toHaveClass("fill");
    expect(screen.getByRole("region", { name: "Growing support body" })).toHaveClass("grow");
    expect(screen.getByRole("region", { name: "Growing support body" })).toHaveClass("fill");
  });
});
