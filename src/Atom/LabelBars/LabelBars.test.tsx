import React from "react";
import { render, screen } from "@testing-library/react";
import LabelBars from "./LabelBars";

describe("LabelBars Component", () => {
  it("renders labels and probabilities", () => {
    render(
      <LabelBars labels={[{ label: "Support", prob: 0.84 }]} />,
    );

    expect(screen.getByText("Support")).toBeInTheDocument();
    expect(screen.getByText("84.0%")).toBeInTheDocument();
  });

  it("renders an empty state when there are no labels", () => {
    render(<LabelBars labels={[]} />);
    expect(screen.getByText("No label guesses.")).toBeInTheDocument();
  });
});
