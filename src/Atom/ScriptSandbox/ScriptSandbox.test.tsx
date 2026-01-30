import React from "react";
import { render } from "@testing-library/react";

import ScriptSandbox from "./ScriptSandbox";
import { ScriptSandboxProps } from "./ScriptSandbox.types";

describe("Test Component", () => {
  let props: ScriptSandboxProps;

  beforeEach(() => {
    props = {
      foo: "bar"
    };
  });

  const renderComponent = () => render(<ScriptSandbox {...props} />);

  it("should render foo text correctly", () => {
    props.foo = "custom foo prop";
    const { getByTestId } = renderComponent();

    const component = getByTestId("ScriptSandbox");

    expect(component).toHaveTextContent("custom foo prop");
  });
});
