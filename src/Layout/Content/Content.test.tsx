import React from "react";
import { render } from "@testing-library/react";
import Content from "./Content";
import { ContentProps } from "./Content.types";

describe("Content Component", () => {
  let props: ContentProps;

  beforeEach(() => {
    props = {};
  });

  const renderComponent = () => render(<Content {...props} />);

  it("should render children correctly", () => {
    props.children = "custom foo prop";
    const { getByTestId } = renderComponent();
    const component = getByTestId("Content");
    expect(component).toHaveTextContent("custom foo prop");
  });

  it("should apply padding class when pad prop is true", () => {
    props.pad = true;
    const { getByTestId } = renderComponent();
    const component = getByTestId("Content");
    expect(component).toHaveClass("pad");
  });

  it("should apply grow class when grow prop is true", () => {
    props.grow = true;
    const { getByTestId } = renderComponent();
    const component = getByTestId("Content");
    expect(component).toHaveClass("grow");
  });
});