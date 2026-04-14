import React from "react";
import { render, screen } from "@testing-library/react";
import LabelBars from "./LabelBars";
import { getChartColor } from "../Chart/Chart.shared";

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

  it("uses the shared chart palette by default", () => {
    render(
      <LabelBars
        labels={[
          { label: "Support", prob: 0.84 },
          { label: "Billing", prob: 0.56 },
        ]}
      />,
    );

    expect(screen.getByTestId("LabelBarFill-Support")).toHaveStyle({
      background: getChartColor(0),
    });
    expect(screen.getByTestId("LabelBarFill-Billing")).toHaveStyle({
      background: getChartColor(1),
    });
  });

  it("can use scalar probability coloring explicitly", () => {
    render(
      <LabelBars labels={[{ label: "Support", prob: 0.84 }]} colorMode="scale" />,
    );

    expect(screen.getByTestId("LabelBarFill-Support")).toHaveStyle({
      background: "rgb(190, 230, 178)",
    });
  });

  it("anchors the scalar low end to the requested pastel red", () => {
    render(
      <LabelBars labels={[{ label: "Risk", prob: 0 }]} colorMode="scale" />,
    );

    expect(screen.getByTestId("LabelBarFill-Risk")).toHaveStyle({
      background: "rgb(255, 143, 163)",
    });
  });
});
