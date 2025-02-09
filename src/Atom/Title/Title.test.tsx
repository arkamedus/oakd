import React from "react";
import { render } from "@testing-library/react";

import Title from "./Title";
import { TitleProps } from "./Title.types";

describe("Test Component", () => {
  let props: TitleProps;

  beforeEach(() => {
    props = {
      foo: "bar"
    };
  });

  const renderComponent = () => render(<Title {...props} />);

  it("should render foo text correctly", () => {
    props.foo = "custom foo prop";
    const { getByTestId } = renderComponent();

    const component = getByTestId("Title");

    expect(component).toHaveTextContent("custom foo prop");
  });
});
