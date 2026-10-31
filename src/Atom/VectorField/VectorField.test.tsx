import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import VectorField from "./VectorField";
it.each(["grid", "toolbar"] as const)(
  "supports a fourth axis in %s",
  (layout) => {
    const change = jest.fn();
    render(
      <VectorField
        value={{ x: 1, y: 2, z: 3, w: 4 }}
        onChange={change}
        layout={layout}
      />,
    );
    expect(screen.getAllByLabelText(/^[XYZW]$/)).toHaveLength(4);
    fireEvent.change(screen.getByLabelText("W"), { target: { value: "5" } });
    expect(change).toHaveBeenCalledWith({ x: 1, y: 2, z: 3, w: 5 }, "w");
  },
);

it("resets the fourth axis using its configured value", () => {
  const change = jest.fn();
  render(
    <VectorField
      value={{ x: 1, y: 2, z: 3, w: 4 }}
      dimensions={4}
      onChange={change}
      layout="toolbar"
      axisOptions={{ w: { resetValue: 1 } }}
    />,
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Axis options" }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Reset W" }));
  expect(change).toHaveBeenCalledWith({ x: 1, y: 2, z: 3, w: 1 }, "w");
});
it("reports axis-specific numeric changes and actions", () => {
  const change = jest.fn();
  const reset = jest.fn();
  render(
    <VectorField
      value={{ x: 1, y: 2 }}
      onChange={change}
      dimensions={2}
      layout="toolbar"
      onResetAxis={reset}
    />,
  );
  fireEvent.change(screen.getByLabelText("X"), { target: { value: "3" } });
  expect(change).toHaveBeenCalledWith({ x: 3, y: 2 }, "x");
  fireEvent.click(
    screen.getByRole("button", { name: "Axis options" }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Reset X" }));
  expect(
    screen.getByLabelText("X value").closest(".content.pad"),
  ).not.toBeNull();
  expect(reset).toHaveBeenCalledWith("x");
});

it.each(["grid", "toolbar"] as const)("allows clearing zero and entering a replacement in %s", (layout) => {
  const change = jest.fn();
  const { rerender } = render(<VectorField value={{ x: 0, y: 2 }} onChange={change} layout={layout} />);
  const input = screen.getByLabelText("X") as HTMLInputElement;
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: "" } });
  expect(input.value).toBe("");
  expect(change).not.toHaveBeenCalled();
  fireEvent.change(input, { target: { value: "42" } });
  expect(change).toHaveBeenCalledWith({ x: 42, y: 2 }, "x");
  rerender(<VectorField value={{ x: 42, y: 2 }} onChange={change} layout={layout} />);
  expect(input.value).toBe("42");
  fireEvent.change(input, { target: { value: "" } });
  fireEvent.blur(input);
  expect(input.value).toBe("42");
});

it.each(["small", "default", "large"] as const)("sizes base controls as %s while preserving dropdown sizes", size => {
  const props = { value: { x: 1, y: 2 }, onChange: jest.fn(), size };
  const { rerender } = render(<VectorField {...props} layout="grid" onReset={jest.fn()} onRandomize={jest.fn()} onApply={jest.fn()} />);
  expect(screen.getByLabelText("X")).toHaveClass(`size-${size}`);
  for (const name of ["Random", "Reset", "Apply"]) {
    expect(screen.getByRole("button", { name })).toHaveClass(`size-${size}`);
  }

  rerender(<VectorField {...props} layout="toolbar" />);
  expect(screen.getByLabelText("X")).toHaveClass(`size-${size}`);
  const trigger = screen.getByRole("button", { name: "Axis options" });
  expect(trigger).toHaveClass(`size-${size}`);
  fireEvent.click(trigger);
  expect(screen.getByLabelText("X value")).toHaveClass("size-default");
  expect(screen.getByRole("button", { name: "Decrease X" })).toHaveClass("size-default");
  expect(screen.getByRole("button", { name: "Reset axes" })).toHaveClass("size-small");
});

it.each(["grid", "toolbar"] as const)("forwards per-axis native props in %s layout", layout => {
  const ref = React.createRef<HTMLInputElement>();
  const change = jest.fn();
  const axisChange = jest.fn();
  render(<VectorField layout={layout} value={{ x: 1, y: 2 }} onChange={change} axisOptions={{ x: { inputProps: { ref, id: "position-x", name: "x", "aria-label": "Horizontal position", required: true, onChange: axisChange } } }} />);
  const input = screen.getByRole("spinbutton", { name: "Horizontal position" });
  expect(ref.current).toBe(input);
  expect(input).toHaveAttribute("name", "x");
  expect(input).toHaveAttribute("id", "position-x");
  expect(input).toBeRequired();
  fireEvent.change(input, { target: { value: "3" } });
  expect(axisChange).toHaveBeenCalledTimes(1);
  expect(change).toHaveBeenCalledWith({ x: 3, y: 2 }, "x");
});
