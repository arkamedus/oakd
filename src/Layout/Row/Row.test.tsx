import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Row from "./Row";
import Column from "../Column/Column";
import Content from "../Content/Content";
import Space from "../../Atom/Space/Space";
import Card from "../../Atom/Card/Card";
import Paragraph from "../../Atom/Paragraph/Paragraph";
import MultiLineChart from "../../Atom/MultiLineChart/MultiLineChart";
import EmbeddingHeatmap from "../../Atom/EmbeddingHeatmap/EmbeddingHeatmap";

class ResizeObserverMock {
  observe() {}
  disconnect() {}
}

describe("Row Component", () => {
  beforeEach(() => {
    (global as any).ResizeObserver = ResizeObserverMock;
    Object.defineProperty(HTMLDivElement.prototype, "clientWidth", {
      configurable: true,
      get() {
        const className = this.className?.toString?.() || "";
        if (className.includes("oakd-multi-line-chart__frame")) return 480;
        if (className.includes("oakd-multi-line-chart")) return 480;
        return 0;
      },
    });
    Object.defineProperty(HTMLDivElement.prototype, "clientHeight", {
      configurable: true,
      get() {
        const className = this.className?.toString?.() || "";
        if (className.includes("oakd-multi-line-chart__frame")) return 280;
        if (className.includes("oakd-multi-line-chart")) return 320;
        return 40;
      },
    });
  });

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

  it("supports a primary chart slice when the chart is hosted in a bounded fill chain", async () => {
    render(
      <div style={{ width: 1200, height: 500 }}>
        <Card pad wide fill>
          <Content grow fill>
            <Row gap>
              <Column xs={24} md={14}>
                <Content grow fill>
                  <Space direction="vertical" gap wide fill>
                    <Paragraph>Primary panel</Paragraph>
                    <Paragraph>Summary</Paragraph>
                    <Card pad wide fill>
                      <MultiLineChart
                        fill
                        lines={[
                          {
                            label: "Signups",
                            values: [
                              { x: "2026-04-01", y: 18 },
                              { x: "2026-04-02", y: 24 },
                            ],
                          },
                          {
                            label: "Activations",
                            values: [
                              { x: "2026-04-01", y: 12 },
                              { x: "2026-04-02", y: 16 },
                            ],
                          },
                        ]}
                      />
                    </Card>
                  </Space>
                </Content>
              </Column>
              <Column xs={24} md={10}>
                <Card pad wide>
                  <Paragraph>Support panel</Paragraph>
                </Card>
              </Column>
            </Row>
          </Content>
        </Card>
      </div>,
    );

    expect(await screen.findByText("Signups")).toBeInTheDocument();
    expect(screen.getByText("Activations")).toBeInTheDocument();
    expect(screen.getByTestId("MultiLineChartRoot")).toHaveClass("oakd-multi-line-chart--fill");
  });

  it("supports a growing support rail card hosting an embedding heatmap without a wrapping content", () => {
    render(
      <div style={{ width: 1200, height: 500 }}>
        <Card pad wide fill>
          <Row gap>
            <Column xs={24} md={14}>
              <Card pad wide>
                <Paragraph>Primary panel</Paragraph>
              </Card>
            </Column>
            <Column xs={24} md={10}>
              <Content grow fill>
                <Space direction="vertical" gap wide fill>
                  <Paragraph>Support rail</Paragraph>
                  <Paragraph>Embedding grows here.</Paragraph>
                  <Card pad wide grow fill aria-label="Embedding grow card">
                    <EmbeddingHeatmap
                      fill
                      embedding={[
                        [0.1, 0.2, 0.3],
                        [0.4, 0.5, 0.6],
                        [0.7, 0.8, 0.9],
                      ]}
                    />
                  </Card>
                </Space>
              </Content>
            </Column>
          </Row>
        </Card>
      </div>,
    );

    expect(screen.getByRole("region", { name: "Embedding grow card" })).toHaveClass("grow");
    expect(screen.getByRole("region", { name: "Embedding grow card" })).toHaveClass("fill");
    expect(screen.getByTestId("EmbeddingHeatmapGrid")).toHaveClass(
      "oakd-embedding-heatmap__grid--fill",
    );
  });
});
