import React from "react";
import { render } from "@testing-library/react";

import Dropdown from "./Dropdown";
import { DropdownProps } from "./Dropdown.types";

describe("Test Component", () => {
  let props: DropdownProps;

  beforeEach(() => {
    props = {

    };
  });

  const renderComponent = () => render(<Dropdown {...props} />);

  it("should render foo text correctly", () => {
    props.children = "custom foo prop";
    const { getByTestId } = renderComponent();

    const component = getByTestId("Dropdown");

    expect(component).toHaveTextContent("custom foo prop");
  });
});
