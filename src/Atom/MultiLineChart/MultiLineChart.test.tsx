import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import MultiLineChart from "./MultiLineChart";

class ResizeObserverMock {
  observe() {}
  disconnect() {}
}

describe("MultiLineChart Component", () => {
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

  it("renders legend labels and chart path", async () => {
    const { container } = render(
      <MultiLineChart
        lines={[
          {
            label: "Visits",
            values: [
              { x: "2026-04-01", y: 10 },
              { x: "2026-04-02", y: 12 },
            ],
          },
        ]}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Visits")).toBeInTheDocument();
      expect(container.querySelector("path")).toBeInTheDocument();
    });
  });

  it("shows tooltip details on hover", async () => {
    const { container } = render(
      <MultiLineChart
        lines={[
          {
            label: "Visits",
            values: [
              { x: "2026-04-01", y: 10 },
              { x: "2026-04-02", y: 12 },
            ],
          },
        ]}
        hoverLabel="events"
      />,
    );

    await waitFor(() => {
      const hoverRects = container.querySelectorAll("rect");
      expect(hoverRects.length).toBeGreaterThan(0);
      fireEvent.mouseEnter(hoverRects[0]);
    });

    expect(screen.getAllByText("Visits").length).toBeGreaterThan(0);
    expect(screen.getByText(/events/i)).toBeInTheDocument();
  });

  it("renders optional vertical guide lines behind the chart", async () => {
    const { container } = render(
      <MultiLineChart
        lines={[
          {
            label: "Visits",
            values: [
              { x: "2026-04-01", y: 10 },
              { x: "2026-04-02", y: 12 },
              { x: "2026-04-03", y: 14 },
            ],
          },
        ]}
        showVerticalTicks
      />,
    );

    await waitFor(() => {
      const guideLines = container.querySelectorAll('line[stroke="rgba(0, 0, 0, 0.08)"]');
      expect(guideLines).toHaveLength(3);
    });
  });

  it("uses the measured frame height when the container grows", async () => {
    render(
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
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("MultiLineChartSvg")).toHaveAttribute("height", "280");
    });
    expect(screen.getByTestId("MultiLineChartRoot")).toHaveClass("oakd-multi-line-chart--fill");
    expect(screen.getByTestId("MultiLineChartFrame")).toHaveClass("oakd-multi-line-chart__frame-fill");
  });

  it("keeps an explicit height instead of growing to the measured frame height", async () => {
    render(
      <MultiLineChart
        height={200}
        lines={[
          {
            label: "Visits",
            values: [
              { x: "2026-04-01", y: 10 },
              { x: "2026-04-02", y: 12 },
            ],
          },
        ]}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("MultiLineChartSvg")).toHaveAttribute("height", "200");
    });
  });

  it("does not keep increasing height in fill mode after measurement", async () => {
    render(
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
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("MultiLineChartSvg")).toHaveAttribute("height", "280");
    });

    expect(screen.getByTestId("MultiLineChartSvg")).toHaveAttribute("height", "280");
  });
});
