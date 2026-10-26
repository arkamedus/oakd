import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "../Atom/Button/Button";
import Input from "../Atom/Input/Input";
import FileInput from "../Atom/FileInput/FileInput";
import Select from "../Atom/Select/Select";
import { sizeMinusOne } from "./Core.utils";

it.each([Button, Input, FileInput])(
  "makes native disabled and the disabled variant equivalent for %p",
  (Component) => {
    const onClick = jest.fn();
    const onChange = jest.fn();
    const { container, rerender } = render(
      <Component disabled onClick={onClick} onChange={onChange} />,
    );
    const disabledMarkup = container.innerHTML;
    rerender(
      <Component variant="disabled" onClick={onClick} onChange={onChange} />,
    );
    expect(container.innerHTML).toBe(disabledMarkup);
    const native = container.querySelector("button, input")!;
    expect(native).toBeDisabled();
    fireEvent.click(native);
    expect(onClick).not.toHaveBeenCalled();
    rerender(
      <Component variant="primary" onClick={onClick} onChange={onChange} />,
    );
    expect(native).not.toBeDisabled();
  },
);

it.each([{ disabled: true }, { variant: "disabled" as const }])(
  "prevents Select opening and selecting when disabled: %p",
  (props) => {
    const onChange = jest.fn();
    const onOpenChange = jest.fn();
    render(
      <Select
        {...props}
        open
        options={[{ value: "one", element: "One" }]}
        onChange={onChange}
        onOpenChange={onOpenChange}
      />,
    );
    const trigger = screen.getByRole("button");
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.click(screen.getByRole("option", { hidden: true }));
    expect(onChange).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  },
);

it.each([
  ["small", "small"],
  ["default", "small"],
  ["large", "default"],
  ["huge", "large"],
] as const)("reduces %s to %s", (size, smaller) => {
  expect(sizeMinusOne(size)).toBe(smaller);
});
