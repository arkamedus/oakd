import React from "react";
import { render } from "@testing-library/react";
import Paragraph from "./Paragraph";
import { ParagraphProps } from "./Paragraph.types";

describe("Test Component", () => {
  let props: ParagraphProps;

  beforeEach(() => {
    props = {
    };
  });

  const renderComponent = () => render(<Paragraph {...props} />);

  it("should render foo text correctly", () => {
    props.children = "harvey was here";
    const { getByTestId } = renderComponent();

    const component = getByTestId("Paragraph");

    expect(component).toHaveTextContent("harvey was here");
  });
});
