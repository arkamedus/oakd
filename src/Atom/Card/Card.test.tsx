import React from "react";
import { render } from "@testing-library/react";
import Card from "./Card";
import { CardProps } from "./Card.types";

describe("Card Component", () => {
  let props: CardProps;

  beforeEach(() => {
    props = {
      children: "Test Card Content",
      className: "custom-class",
      style: { backgroundColor: "red" },
      pad: true
    };
  });

  const renderComponent = () => render(<Card {...props} />);

  it("should render the Card component", () => {
    const { getByTestId } = renderComponent();
    const component = getByTestId("Card");
    expect(component).toBeInTheDocument();
  });

  it("should render children correctly", () => {
    const { getByTestId } = renderComponent();
    const component = getByTestId("Card");
    expect(component).toHaveTextContent("Test Card Content");
  });

  it("should apply custom class names", () => {
    const { getByTestId } = renderComponent();
    const component = getByTestId("Card");
    expect(component).toHaveClass("custom-class");
  });

  it("should apply the pad class when pad is true", () => {
    const { getByTestId } = renderComponent();
    const component = getByTestId("Card");
    expect(component).toHaveClass("pad");
  });

  it("should apply inline styles correctly", () => {
    const { getByTestId } = renderComponent();
    const component = getByTestId("Card");
    expect(component).toHaveStyle("background-color: red");
  });

  it("should not have the pad class when pad is false", () => {
    props.pad = false;
    const { getByTestId } = renderComponent();
    const component = getByTestId("Card");
    expect(component).not.toHaveClass("pad");
  });

  it("should render without a className if not provided", () => {
    props.className = undefined;
    const { getByTestId } = renderComponent();
    const component = getByTestId("Card");
    expect(component.className).toBe("oakd card pad");
  });

  it("should render without style if not provided", () => {
    props.style = undefined;
    const { getByTestId } = renderComponent();
    const component = getByTestId("Card");
    expect(component.getAttribute("style")).toBe(null);
  });
});
