import React from "react";
import { render } from "@testing-library/react";

import DebugLayer from "./DebugLayer";
import { DebugLayerProps } from "./DebugLayer.types";

describe("Test Component", () => {
  let props: DebugLayerProps;

  beforeEach(() => {
    props = {
      label: "empty"
    };
  });

  const renderComponent = () => render(<DebugLayer {...props} />);

  it("should render foo text correctly", () => {
    props.label = "Label";
    const { getByTestId } = renderComponent();

    const component = getByTestId("DebugLayer");

    expect(component).toHaveTextContent("Label");
  });
});
