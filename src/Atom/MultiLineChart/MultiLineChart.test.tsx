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
    Object.defineProperty(SVGSVGElement.prototype, "getBoundingClientRect", {
      configurable: true,
      value: () => ({ left: 0, top: 0, width: 480, height: 280 }),
    });
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

  it("plots the first and last points at the chart edges when labels are disabled", async () => {
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
      const path = container.querySelector("path");
      expect(path).toBeInTheDocument();
      expect(path?.getAttribute("d")).toContain("M 0 ");
      expect(path?.getAttribute("d")).toContain("L 480 ");
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
      const hoverRects = screen.getAllByTestId(/MultiLineChartHover-/);
      expect(hoverRects.length).toBeGreaterThan(0);
      fireEvent.mouseEnter(hoverRects[0], { clientX: 80 });
      fireEvent.mouseMove(hoverRects[0], { clientX: 80 });
    });

    expect(screen.getAllByText("Visits").length).toBeGreaterThan(0);
    expect(screen.getByText(/events/i)).toBeInTheDocument();
    expect(screen.getByTestId("MultiLineChartTooltip")).toHaveStyle({ left: "96px" });
  });

  it("moves the tooltip away from points on the right side of the chart", async () => {
    render(
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
      const hoverRect = screen.getByTestId("MultiLineChartHover-1");
      fireEvent.mouseEnter(hoverRect, { clientX: 420 });
      fireEvent.mouseMove(hoverRect, { clientX: 420 });
    });

    expect(screen.getByTestId("MultiLineChartTooltip")).toHaveStyle({ left: "204px" });
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

  it("renders optional axis labels and horizontal guide lines", async () => {
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
        showHorizontalTicks
        showXAxisLabels
        showYAxisLabels
        xLabels={["Apr 1", "Apr 2", "Apr 3"]}
        yLabels={[
          { value: 14, label: "14" },
          { value: 7, label: "7" },
          { value: 0, label: "0" },
        ]}
      />,
    );

    await waitFor(() => {
      expect(container.querySelectorAll('line[stroke="rgba(0, 0, 0, 0.08)"]').length).toBeGreaterThanOrEqual(3);
      expect(screen.getByText("Apr 1")).toBeInTheDocument();
      expect(screen.getByText("14")).toBeInTheDocument();
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
