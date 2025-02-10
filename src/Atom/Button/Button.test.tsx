import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Button from "./Button";
import { ButtonProps } from "./Button.types";
import Icon from "../../Icon/Icon";

describe("Button Component", () => {
  let props: ButtonProps;

  beforeEach(() => {
    props = {
      size: "default",
      type: "default",
      buttonType: "button",
      className: "custom-button",
      style: { backgroundColor: "blue" },
      label: "Click Label",
      disabled: false,
    };
  });

  const renderComponent = () => render(<Button {...props}>Click Me</Button>);

  it("should render the Button component", () => {
    const { getByTestId } = renderComponent();
    const component = getByTestId("Button");
    expect(component).toBeInTheDocument();
  });

  it("should render children correctly", () => {
    const { getByTestId } = renderComponent();
    const component = getByTestId("Button");
    expect(component).toHaveTextContent("Click Me");
  });

  it("should render label when provided", () => {
    const { getByTestId } = renderComponent();
    const component = getByTestId("Button");
    expect(component).toHaveTextContent("Click Label");
  });

  it("should apply the correct button type class", () => {
    props.type = "primary";
    const { getByTestId } = renderComponent();
    const component = getByTestId("Button");
    expect(component).toHaveClass("type-primary");
  });

  it("should apply the correct disabled class", () => {
    props.disabled =true;
    const { getByTestId } = renderComponent();
    const component = getByTestId("Button");
    expect(component).toHaveClass("disabled");
  });

  it("should apply the correct size class", () => {
    props.size = "large";
    const { getByTestId } = renderComponent();
    const component = getByTestId("Button");
    expect(component).toHaveClass("size-large");
  });

  it("should apply custom class names", () => {
    const { getByTestId } = renderComponent();
    const component = getByTestId("Button");
    expect(component).toHaveClass("custom-button");
  });

  it("should apply inline styles correctly", () => {
    const { getByTestId } = renderComponent();
    const component = getByTestId("Button");
    expect(component).toHaveStyle("background-color: blue");
  });

  it("should handle click events", () => {
    const onClickMock = jest.fn();
    props.onClick = onClickMock;
    const { getByTestId } = renderComponent();
    const component = getByTestId("Button");

    fireEvent.click(component);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when `disabled` prop is true", () => {
    props.disabled = true;
    const { getByTestId } = renderComponent();
    const component = getByTestId("Button");
    expect(component).toBeDisabled();
    expect(component).toHaveClass("disabled");
  });

  it("should be disabled when `type` is 'disabled'", () => {
    props.type = "disabled";
    const { getByTestId } = renderComponent();
    const component = getByTestId("Button");
    expect(component).toBeDisabled();
    expect(component).toHaveClass("disabled");
  });

  it("should not trigger onClick when disabled", () => {
    const onClickMock = jest.fn();
    props.onClick = onClickMock;
    props.disabled = true;
    const { getByTestId } = renderComponent();
    const component = getByTestId("Button");

    fireEvent.click(component);
    expect(onClickMock).not.toHaveBeenCalled();
  });

  it("should render an icon when `icon` prop is provided as a string", () => {
    props.icon = "Plus";
    const { getByTestId } = renderComponent();
    expect(getByTestId("Button").querySelector(".icon")).toBeInTheDocument();
  });

  it("should render an icon when `icon` prop is a React component", () => {
    props.icon = <Icon name="Check" />;
    const { getByTestId } = renderComponent();
    expect(getByTestId("Button").querySelector(".icon")).toBeInTheDocument();
  });

  it("should have a default role of `button`", () => {
    const { getByTestId } = renderComponent();
    const component = getByTestId("Button");
    expect(component).toHaveAttribute("role", "button");
  });

  it("should support a custom role", () => {
    props.role = "menuitem";
    const { getByTestId } = renderComponent();
    const component = getByTestId("Button");
    expect(component).toHaveAttribute("role", "menuitem");
  });
});
