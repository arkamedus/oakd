import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Button from "./Button";
import { ButtonProps } from "./Button.types";

describe("Button Component", () => {
  let props: ButtonProps;

  beforeEach(() => {
    props = {
      size: "default",
      type: "default",
    };
  });

  const renderComponent = () => render(<Button {...props}>Click Me</Button>);

  it("should render button text correctly", () => {
    const { getByTestId } = renderComponent();
    const component = getByTestId("Button");
    expect(component).toHaveTextContent("Click Me");
  });

  it("should apply the correct button type class", () => {
    props.type = "primary";
    const { getByTestId } = renderComponent();
    const component = getByTestId("Button");
    expect(component).toHaveClass("type-primary");
  });

  it("should handle click events", () => {
    const onClickMock = jest.fn();
    props.onClick = onClickMock;
    const { getByTestId } = renderComponent();
    const component = getByTestId("Button");

    fireEvent.click(component);
    expect(onClickMock).toHaveBeenCalled();
  });

  it("should be disabled when type is 'disabled'", () => {
    props.type = "disabled";
    const { getByTestId } = renderComponent();
    const component = getByTestId("Button");
    expect(component).toBeDisabled();
  });

  it("should be disabled when disabled prop is true", () => {
    props.disabled = true;
    const { getByTestId } = renderComponent();
    const component = getByTestId("Button");
    expect(component).toBeDisabled();
  });
});
