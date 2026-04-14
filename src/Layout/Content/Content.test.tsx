import React from "react";
import { render, screen } from "@testing-library/react";
import Content, { ContentRow } from "./Content";
import EmbeddingHeatmap from "../../Atom/EmbeddingHeatmap/EmbeddingHeatmap";
import MultiLineChart from "../../Atom/MultiLineChart/MultiLineChart";

class ResizeObserverMock {
  observe() {}
  disconnect() {}
}

describe("Content Component", () => {
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

  it("supports a grow region hosting a fill-height embedding heatmap", () => {
    render(
      <Content grow pad>
        <div>Header</div>
        <Content grow>
          <EmbeddingHeatmap
            fill
            embedding={[
              [0.1, 0.2],
              [0.3, 0.4],
            ]}
          />
        </Content>
      </Content>,
    );

    const contents = screen.getAllByTestId("Content");
    expect(contents[1]).toHaveClass("grow");
    expect(screen.getByTestId("EmbeddingHeatmapGrid")).toHaveClass(
      "oakd-embedding-heatmap__grid--fill",
    );
  });

  it("supports a grow region hosting a fill-height multi-line chart", async () => {
    render(
      <Content grow pad>
        <div>Header</div>
        <Content grow>
          <MultiLineChart
            fill
            lines={[
              {
                label: "Visits",
                values: [
                  { x: "2026-04-01", y: 10 },
                  { x: "2026-04-02", y: 12 },
                ],
              },
            ]}
          />
        </Content>
      </Content>,
    );

    expect(screen.getAllByTestId("Content")[1]).toHaveClass("grow");
    expect(await screen.findByTestId("MultiLineChartSvg")).toBeInTheDocument();
    expect(screen.getByTestId("MultiLineChartRoot")).toHaveClass("oakd-multi-line-chart--fill");
    expect(screen.getByTestId("MultiLineChartFrame")).toHaveClass("oakd-multi-line-chart__frame-fill");
  });
});
