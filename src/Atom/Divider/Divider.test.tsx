import React from "react";
import { render } from "@testing-library/react";
import Divider from "./Divider";

describe("Divider Component", () => {
  const renderComponent = (props = {}) => render(<Divider {...props} />);

  it("should render without errors", () => {
    const { getByTestId } = renderComponent();
    const component = getByTestId("Divider");
    expect(component).toBeInTheDocument();
  });

  it("should not have any default text content", () => {
    const { getByTestId } = renderComponent();
    const component = getByTestId("Divider");
    expect(component).toBeEmptyDOMElement();
  });

  it("should apply the correct orientation class", () => {
    const { getByTestId } = renderComponent({ orientation: "vertical" });
    const component = getByTestId("Divider");
    expect(component).toHaveClass("vertical");
  });

  it("should handle custom class names", () => {
    const { getByTestId } = renderComponent({ className: "custom-class" });
    const component = getByTestId("Divider");
    expect(component).toHaveClass("custom-class");
  });
});
