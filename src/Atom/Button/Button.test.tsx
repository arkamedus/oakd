import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "./Button";
import { ButtonProps } from "./Button.types";

describe("Button Component", () => {
  let props: ButtonProps;

  beforeEach(() => {
    props = {
      variant: "primary",
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
    const button = screen.getByTestId("Button");
    fireEvent.click(button);
    expect(props.onClick).toHaveBeenCalled();
  });

  it("should apply disabled styles and prevent click events when disabled", () => {
    props.disabled = true;
    const { container } = render(<Button {...props} />);
    const button = within(container).getByTestId("Button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled");
    fireEvent.click(button);
    expect(props.onClick).not.toHaveBeenCalled();
  });

  it("should pass through native button props", () => {
    render(<Button {...props} aria-expanded data-testid="native-button" />);
    expect(screen.getByTestId("native-button")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("renders the same disabled button for the variant and native prop", () => {
    const onClick = jest.fn();
    const { rerender } = render(
      <Button variant="disabled" icon="Star" onClick={onClick}>Disabled</Button>,
    );
    const variantButton = screen.getByRole("button");
    const markup = variantButton.outerHTML;
    expect(variantButton).toBeDisabled();
    fireEvent.click(variantButton);
    rerender(<Button disabled icon="Star" onClick={onClick}>Disabled</Button>);
    const propButton = screen.getByRole("button");
    expect(propButton.outerHTML).toBe(markup);
    expect(propButton).toBeDisabled();
    fireEvent.click(propButton);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("supports the active visual variant", () => {
    render(<Button variant="active">Selected</Button>);
    expect(screen.getByRole("button", { name: "Selected" })).toHaveClass(
      "type-active",
    );
  });
});

 it.each(["small", "default", "large"] as const)("keeps the icon at text line height for %s buttons", size => {
  render(<Button size={size} icon="Plus">Add</Button>);
  expect(screen.getByTestId("Icon")).toHaveClass("icon-small");
  expect(screen.getByRole("button", { name: "Add" })).toHaveClass(`size-${size}`);
});
