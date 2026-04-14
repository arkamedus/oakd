import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Input from "./Input";
import { InputProps } from "./Input.types";

describe("Input Component", () => {
  let props: InputProps;

  beforeEach(() => {
    props = {
      type: "text",
      placeholder: "Search knowledge base",
      size: "default",
      className: "custom-input",
      style: { backgroundColor: "white" },
      disabled: false,
      error: false,
      variant: "default",
    };
  });

  const renderComponent = () => render(<Input {...props} />);

  it("supports uncontrolled typing and preserves native attributes", () => {
    props.name = "query";
    props.autoComplete = "off";
    renderComponent();

    const input = screen.getByPlaceholderText(
      "Search knowledge base",
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "billing export" } });

    expect(input.value).toBe("billing export");
    expect(input).toHaveAttribute("name", "query");
    expect(input).toHaveAttribute("autocomplete", "off");
  });

  it("forwards input, focus, blur, and keyboard events", () => {
    props.onChange = jest.fn();
    props.onFocus = jest.fn();
    props.onBlur = jest.fn();
    props.onKeyDown = jest.fn();
    props.onKeyUp = jest.fn();
    props.onKeyPress = jest.fn();
    renderComponent();

    const input = screen.getByPlaceholderText("Search knowledge base");
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.keyPress(input, { key: "Enter", charCode: 13 });
    fireEvent.change(input, { target: { value: "renewal" } });
    fireEvent.keyUp(input, { key: "Enter" });
    fireEvent.blur(input);

    expect(props.onFocus).toHaveBeenCalled();
    expect(props.onKeyDown).toHaveBeenCalled();
    expect(props.onKeyPress).toHaveBeenCalled();
    expect(props.onChange).toHaveBeenCalled();
    expect(props.onKeyUp).toHaveBeenCalled();
    expect(props.onBlur).toHaveBeenCalled();
  });

  it("shows error state and clears it after the user edits the field", () => {
    props.error = true;
    renderComponent();

    const input = screen.getByPlaceholderText("Search knowledge base");
    expect(screen.getByTestId("InputContainer")).toHaveClass("input-error");
    expect(screen.getByTestId("InputError")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "fixed value" } });

    expect(screen.getByTestId("InputContainer")).not.toHaveClass("input-error");
    expect(screen.queryByTestId("InputError")).not.toBeInTheDocument();
  });

  it("disables editing when disabled", () => {
    props.disabled = true;
    renderComponent();

    expect(screen.getByPlaceholderText("Search knowledge base")).toBeDisabled();
  });
});
