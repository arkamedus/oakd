import React from "react";
import { render } from "@testing-library/react";
import Divider from "./Divider";

describe("Divider Component", () => {
  const renderComponent = () => render(<Divider />);

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

});
