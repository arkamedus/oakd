import React from "react";
import { render } from "@testing-library/react";
import DebugLayer from "./DebugLayer";
import { DebugLayerProps } from "./DebugLayer.types";

describe("DebugLayer Component", () => {
  let props: DebugLayerProps;

  beforeEach(() => {
    props = {
      label: "Test Label"
    };
  });

  it("renders label correctly", () => {
    const { getByTestId } = render(<DebugLayer {...props} />);
    const element = getByTestId("DebugLayer");
    expect(element).toHaveTextContent("Test Label");
  });

  it("renders children correctly", () => {
    props.children = <div data-testid="child">Child Content</div>;
    const { getByTestId } = render(<DebugLayer {...props} />);
    expect(getByTestId("child")).toHaveTextContent("Child Content");
  });
});
