import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
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
    within(screen.getByLabelText("Axis options")).getAllByRole("button")[0],
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
    within(screen.getByLabelText("Axis options")).getAllByRole("button")[0],
  );
  fireEvent.click(screen.getByRole("button", { name: "Reset X" }));
  expect(
    screen.getByLabelText("X value").closest(".content.pad"),
  ).not.toBeNull();
  expect(reset).toHaveBeenCalledWith("x");
});
