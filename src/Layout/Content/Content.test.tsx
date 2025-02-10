import React from "react";
import { render } from "@testing-library/react";

import Content from "./Content";
import { ContentProps } from "./Content.types";

describe("Test Component", () => {
  let props: ContentProps;

  beforeEach(() => {
    props = {};
  });

  const renderComponent = () => render(<Content {...props} />);

  it("should render foo text correctly", () => {
    props.children = "custom foo prop";
    const { getByTestId } = renderComponent();

    const component = getByTestId("Content");

    expect(component).toHaveTextContent("custom foo prop");
  });
});
