import React from "react";
import { render, screen } from "@testing-library/react";
import Paragraph from "./Paragraph";
import Space from "../Space/Space";

describe("Paragraph Component", () => {
  it("renders paragraph content with semantic markup", () => {
    render(<Paragraph>Helpful supporting copy.</Paragraph>);
    const paragraph = screen.getByText("Helpful supporting copy.");

    expect(paragraph.tagName).toBe("P");
    expect(paragraph).toHaveClass("paragraph");
  });

  it("forwards presentation props to the paragraph element", () => {
    render(
      <Paragraph className="muted" style={{ maxWidth: 420 }} aria-live="polite">
        Status message
      </Paragraph>,
    );

    const paragraph = screen.getByText("Status message");
    expect(paragraph).toHaveClass("muted");
    expect(paragraph).toHaveStyle("max-width: 420px");
    expect(paragraph).toHaveAttribute("aria-live", "polite");
  });

  it("does not shrink below its content when used inside a vertical space", () => {
    render(
      <div style={{ width: 320, height: 160 }}>
        <Space direction="vertical" fill>
          <Paragraph>
            This paragraph wraps to multiple lines inside a constrained vertical
            layout.
          </Paragraph>
        </Space>
      </div>,
    );

    const paragraph = screen.getByTestId("Paragraph");
    expect(paragraph).toHaveStyle("flex-shrink: 0");
    expect(paragraph).toHaveStyle("min-width: 0");
  });
});
