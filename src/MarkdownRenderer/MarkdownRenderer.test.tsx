import React from "react";
import { render } from "@testing-library/react";

import MarkdownRenderer from "./MarkdownRenderer";
import { MarkdownRendererProps } from "./MarkdownRenderer.types";

describe("Test Component", () => {
  let props: MarkdownRendererProps;

  beforeEach(() => {
    props = {
      foo: "bar"
    };
  });

  const renderComponent = () => render(<MarkdownRenderer {...props} />);

  it("should render foo text correctly", () => {
    props.foo = "custom foo prop";
    const { getByTestId } = renderComponent();

    const component = getByTestId("MarkdownRenderer");

    expect(component).toHaveTextContent("custom foo prop");
  });
});
