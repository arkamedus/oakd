import React from "react";
import { render } from "@testing-library/react";

import CodeArea from "./CodeArea";
import { CodeAreaProps } from "./CodeArea.types";

describe("Test Component", () => {
  let props: CodeAreaProps;

  beforeEach(() => {
    props = {
      foo: "bar"
    };
  });

  const renderComponent = () => render(<CodeArea {...props} />);

  it("should render foo text correctly", () => {
    props.foo = "custom foo prop";
    const { getByTestId } = renderComponent();

    const component = getByTestId("CodeArea");

    expect(component).toHaveTextContent("custom foo prop");
  });
});
