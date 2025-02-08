import React from "react";
import { render } from "@testing-library/react";

import DebugLayer from "./DebugLayer";
import { DebugLayerProps } from "./DebugLayer.types";

describe("Test Component", () => {
  let props: DebugLayerProps;

  beforeEach(() => {
    props = {
      foo: "bar"
    };
  });

  const renderComponent = () => render(<DebugLayer {...props} />);

  it("should render foo text correctly", () => {
    props.foo = "harvey was here";
    const { getByTestId } = renderComponent();

    const component = getByTestId("DebugLayer");

    expect(component).toHaveTextContent("harvey was here");
  });
});
