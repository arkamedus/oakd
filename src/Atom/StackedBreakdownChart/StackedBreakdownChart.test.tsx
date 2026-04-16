import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import StackedBreakdownChart from "./StackedBreakdownChart";

describe("StackedBreakdownChart Component", () => {
  it("renders label legends and row labels", () => {
    const { container } = render(
      <StackedBreakdownChart
        title="Breakdown"
        labels={["Helpful", "Neutral"]}
        rows={[{ key: "w1", labelWeights: { Helpful: 0.5, Neutral: 0.5 } }]}
      />,
    );

    expect(screen.getByText("Helpful")).toBeInTheDocument();
    expect(screen.getByText("Neutral")).toBeInTheDocument();
    expect(screen.getByText("w1")).toBeInTheDocument();
    expect(container.querySelector(".oakd-stacked-breakdown-chart")).not.toBeNull();
    expect(container.querySelector(".oakd-stacked-breakdown-chart__body")).not.toBeNull();
    expect(screen.getByTestId("StackedBreakdownColumn-w1")).toHaveClass("wide");
    expect(screen.getByTestId("StackedBreakdownColumn-w1")).toHaveClass(
      "oakd-stacked-breakdown-chart__column",
    );
    expect(screen.getByTestId("StackedBreakdownRow-w1")).toHaveClass(
      "oakd-stacked-breakdown-chart__stack",
    );
  });

  it("renders an empty state", () => {
    render(<StackedBreakdownChart title="Breakdown" labels={[]} rows={[]} />);
    expect(screen.getByText("No data.")).toBeInTheDocument();
  });

  it("can hide x-axis labels", () => {
    render(
      <StackedBreakdownChart
        labels={["Helpful"]}
        rows={[{ key: "w1", labelWeights: { Helpful: 1 } }]}
        xLabels={[<span key="w1">Week 1</span>]}
        showXAxisLabels={false}
      />,
    );

    expect(screen.queryByText("Week 1")).not.toBeInTheDocument();
  });

  it("shows a hovered row tooltip with percentage breakdowns", async () => {
    render(
      <StackedBreakdownChart
        labels={["Helpful", "Neutral"]}
        rows={[{ key: "w1", labelWeights: { Helpful: 0.6, Neutral: 0.4 } }]}
        xLabels={[<span key="w1">Week 1</span>]}
      />,
    );

    fireEvent.mouseEnter(screen.getByTestId("StackedBreakdownRow-w1"));

    const tooltip = await screen.findByTestId("StackedBreakdownTooltip");
    expect(tooltip).toBeInTheDocument();
    expect(within(tooltip).getByText("Week 1")).toBeInTheDocument();
    expect(within(tooltip).getByText("60.0%")).toBeInTheDocument();
    expect(within(tooltip).getByText("40.0%")).toBeInTheDocument();
  });

  it("can disable hover tooltips", () => {
    render(
      <StackedBreakdownChart
        labels={["Helpful"]}
        rows={[{ key: "w1", labelWeights: { Helpful: 1 } }]}
        showHover={false}
      />,
    );

    fireEvent.mouseEnter(screen.getByTestId("StackedBreakdownRow-w1"));

    expect(screen.queryByTestId("StackedBreakdownTooltip")).toBeNull();
  });

  it("stretches the plot to fill the extra space when x-axis labels are disabled", () => {
    const { container } = render(
      <StackedBreakdownChart
        labels={["Helpful"]}
        rows={[{ key: "w1", labelWeights: { Helpful: 1 } }]}
        showXAxisLabels={false}
      />,
    );

    expect(
      container.querySelector(".oakd-stacked-breakdown-chart__body"),
    ).toHaveClass("oakd-stacked-breakdown-chart__body--fill");
    expect(screen.getByTestId("StackedBreakdownColumn-w1")).toHaveClass(
      "oakd-stacked-breakdown-chart__column-fill",
    );
    expect(screen.getByTestId("StackedBreakdownRow-w1")).toHaveClass(
      "oakd-stacked-breakdown-chart__stack--fill",
    );
  });

  it("uses a custom height when provided", () => {
    render(
      <StackedBreakdownChart
        labels={["Helpful"]}
        rows={[{ key: "w1", labelWeights: { Helpful: 1 } }]}
        height={320}
      />,
    );

    expect(screen.getByTestId("StackedBreakdownRow-w1")).toHaveStyle({ height: "280px" });
  });
});
