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
    renderComponent();
    expect(screen.getByPlaceholderText("Enter text...")).toBeInTheDocument();
  });

  it("should update value on change", () => {
    renderComponent();
    const input = screen.getByPlaceholderText("Enter text...") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(input.value).toBe("Hello");
  });

  it("should reset error state when value changes", () => {
    props.error = true;
    const { rerender } = render(<Input {...props} />);
    const input = screen.getByPlaceholderText("Enter text...");
    expect(screen.getByTestId("InputContainer")).toHaveClass("input-error");
    expect(screen.getByTestId("InputError")).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "Fixed!" } });
    rerender(<Input {...props} value="Fixed!" error={false} />);
    expect(screen.getByTestId("InputContainer")).not.toHaveClass("input-error");
  });

  it("should disable input when disabled is true", () => {
    props.disabled = true;
    renderComponent();
    const input = screen.getByPlaceholderText("Enter text...");
    expect(input).toBeDisabled();
  });

  it("should render an icon if provided as string", () => {
    props.icon = "Magnify";
    renderComponent();
    expect(document.querySelector('.icon')).toBeInTheDocument();
  });

  it("should show an error icon when error is true", () => {
    props.error = true;
    renderComponent();
    expect(screen.getByTestId("InputError")).toBeInTheDocument();
  });

  it("should apply size-related classes correctly", () => {
    props.size = "large";
    renderComponent();
    const input = screen.getByPlaceholderText("Enter text...");
    expect(input).toHaveClass("size-large");
  });

  it("should respect inputType styles", () => {
    props.inputType = "primary";
    renderComponent();
    const input = screen.getByPlaceholderText("Enter text...");
    expect(input).toHaveClass("type-primary");
  });
});
