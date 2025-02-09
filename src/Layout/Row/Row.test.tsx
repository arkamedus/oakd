import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Row from "./Row";

describe("Row Component", () => {
  const renderComponent = (props = {}) =>
      render(
          <Row data-testid="Row" {...props}>
            <div>Item 1</div>
            <div>Item 2</div>
          </Row>
      );

  it("should render without errors", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId("Row")).toBeInTheDocument();
  });

  it("should apply default classes", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId("Row")).toHaveClass("row");
  });

  it("should render children correctly", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId("Row")).toHaveTextContent("Item 1");
    expect(getByTestId("Row")).toHaveTextContent("Item 2");
  });

  it("should apply gap class when gap prop is true", () => {
    const { getByTestId } = renderComponent({ gap: true });
    expect(getByTestId("Row")).toHaveClass("gap");
  });

  it("should match snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });
});
