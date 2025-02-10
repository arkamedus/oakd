import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "./Button";
import { ButtonProps } from "./Button.types";

describe("Button Component", () => {
  let props: ButtonProps;

  beforeEach(() => {
    props = {
      type: "primary",
      disabled: false,
      onClick: jest.fn(),
      children: "Click Me",
    };
  });

  it("should render the Button component", () => {
    render(<Button {...props} />);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("should trigger onClick when clicked", () => {
    render(<Button {...props} />);
    const button = screen.getByText("Click Me");
    fireEvent.click(button);
    expect(props.onClick).toHaveBeenCalled();
  });

  it("should apply disabled styles when `disabled` is true", () => {
    props.disabled = true;
    const { container } = render(<Button {...props} />);

    // Use `within` to avoid multiple matches
    const button = within(container).getByTestId("Button");

    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled");
  });
});
