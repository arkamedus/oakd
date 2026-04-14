import React from "react";
import { render, screen } from "@testing-library/react";
import EmbeddingHeatmap from "./EmbeddingHeatmap";

describe("EmbeddingHeatmap Component", () => {
  it("renders a 1d embedding", () => {
    const { container } = render(<EmbeddingHeatmap embedding={[0.1, 0.2, 0.3]} />);
    expect(container.querySelectorAll("div[title]").length).toBe(3);
  });

  it("renders a 2d embedding matrix", () => {
    const { container } = render(
      <EmbeddingHeatmap embedding={[[0.1, 0.2], [0.3, 0.4]]} />,
    );
    expect(container.querySelectorAll("div[title]").length).toBe(4);
  });

  it("renders an empty state", () => {
    render(<EmbeddingHeatmap embedding={[]} />);
    expect(screen.getByText("No embedding data.")).toBeInTheDocument();
  });

  it("supports explicit fill-height mode for matrix layouts", () => {
    render(
      <div style={{ height: 320 }}>
        <EmbeddingHeatmap
          fillHeight
          embedding={[
            [0.1, 0.2],
            [0.3, 0.4],
          ]}
        />
      </div>,
    );

    const grid = screen.getByTestId("EmbeddingHeatmapGrid");
    expect(grid).toHaveClass("oakd-embedding-heatmap__grid--fill");
    expect(grid).toHaveStyle({ height: "100%" });
  });
});
