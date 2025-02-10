import React from "react";
import { render } from "@testing-library/react";
import Aspect from "./Aspect";

describe("Aspect Component", () => {
  it("renders correctly with default props", () => {
    const { getByTestId } = render(<Aspect />);
    const component = getByTestId("Aspect");

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass("aspect-16x9"); // Default aspect ratio
  });

  it("applies the correct aspect ratio class", () => {
    const { getByTestId } = render(<Aspect ratio="4x3" />);
    const component = getByTestId("Aspect");

    expect(component).toHaveClass("aspect-4x3");
  });

  it("renders children correctly", () => {
    const { getByTestId, getByText } = render(
      <Aspect>
        <div>Test Content</div>
      </Aspect>,
    );

    expect(getByTestId("Aspect")).toBeInTheDocument();
    expect(getByText("Test Content")).toBeInTheDocument();
  });

  it("allows custom class names", () => {
    const { getByTestId } = render(<Aspect className="custom-class" />);
    const component = getByTestId("Aspect");

    expect(component).toHaveClass("custom-class");
  });
});
