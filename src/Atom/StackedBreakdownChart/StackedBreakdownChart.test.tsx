import React from "react";
import { render, screen } from "@testing-library/react";
import StackedBreakdownChart from "./StackedBreakdownChart";

describe("StackedBreakdownChart Component", () => {
  it("renders label legends and row labels", () => {
    render(
      <StackedBreakdownChart
        title="Breakdown"
        labels={["Helpful", "Neutral"]}
        rows={[{ key: "w1", labelWeights: { Helpful: 0.5, Neutral: 0.5 } }]}
      />,
    );

    expect(screen.getByText("Helpful")).toBeInTheDocument();
    expect(screen.getByText("Neutral")).toBeInTheDocument();
    expect(screen.getByText("w1")).toBeInTheDocument();
  });

  it("renders an empty state", () => {
    render(<StackedBreakdownChart title="Breakdown" labels={[]} rows={[]} />);
    expect(screen.getByText("No data.")).toBeInTheDocument();
  });
});
