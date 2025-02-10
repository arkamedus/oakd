import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Input from "./Input";
import { InputProps } from "./Input.types";

describe("Input Component", () => {
  let props: InputProps;

  beforeEach(() => {
    props = {
      type: "text",
      placeholder: "Enter text...",
      size: "default",
      className: "custom-input",
      style: { backgroundColor: "white" },
      disabled: false,
      error: false,
      inputType: "default"
    };
  });

  const renderComponent = () => render(<Input {...props} />);

  it("should render the Input component", () => {
    const { getByPlaceholderText } = renderComponent();
    expect(getByPlaceholderText("Enter text...")).toBeInTheDocument();
  });

  it("should update value on change", () => {
    const { getByPlaceholderText } = renderComponent();
    const input = getByPlaceholderText("Enter text...") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(input.value).toBe("Hello");
  });

  it("should reset error state when value changes", () => {
    props.error = true;
    const { getByPlaceholderText, rerender, getByTestId } = renderComponent();
    const input = getByPlaceholderText("Enter text...");

    expect(getByTestId("InputContainer")).toHaveClass("input-error");
    expect(getByTestId("InputError")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "Fixed!" } });

    rerender(<Input {...props} value="Fixed!" error={false} />);

    expect(getByTestId("InputContainer")).not.toHaveClass("input-error");
  });

  it("should disable input when `disabled` is true", () => {
    props.disabled = true;
    const { getByPlaceholderText } = renderComponent();
    const input = getByPlaceholderText("Enter text...");
    expect(input).toBeDisabled();
  });

  it("should render an icon if provided", () => {
    props.icon = "Magnify";
    const { container } = renderComponent();
    expect(container.querySelector(".icon")).toBeInTheDocument();
  });

  it("should show an error icon when `error` is true", () => {
    props.error = true;
    const { getByPlaceholderText, getByTestId } = renderComponent();
    const input = getByPlaceholderText("Enter text...");

    expect(input.parentElement.parentElement).toHaveClass("input-error");
    expect(getByTestId("InputError")).toBeInTheDocument();
  });

  it("should apply size-related classes correctly", () => {
    props.size = "large";
    const { getByPlaceholderText } = renderComponent();
    const input = getByPlaceholderText("Enter text...");
    expect(input).toHaveClass("size-large");
  });

  it("should respect `inputType` styles", () => {
    props.inputType = "primary";
    const { getByPlaceholderText } = renderComponent();
    const input = getByPlaceholderText("Enter text...");
    expect(input).toHaveClass("type-primary");
  });
});
