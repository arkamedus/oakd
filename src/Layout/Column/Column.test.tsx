import React from "react";
import { render } from "@testing-library/react";

import Column from "./Column";
import { ColumnProps } from "./Column.types";

describe("Test Component", () => {
  let props: ColumnProps;

  beforeEach(() => {
    props = {
      foo: "bar"
    };
  });

  const renderComponent = () => render(<Column {...props} />);

  it("should render foo text correctly", () => {
    props.foo = "harvey was here";
    const { getByTestId } = renderComponent();

    const component = getByTestId("Column");

    expect(component).toHaveTextContent("harvey was here");
  });
});
