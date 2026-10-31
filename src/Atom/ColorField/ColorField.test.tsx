import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ColorField, { colorToHex, normalizeColorValue } from "./ColorField";

it("updates the open preview color without repositioning the dropdown", () => {
	const change = jest.fn();
	const { rerender } = render(
		<ColorField value={{ r: 1, g: 0, b: 0 }} onChange={change} defaultOpen />,
	);
	const preview = screen.getByRole("img", { name: "Selected color #FF0000" });
	const menu = preview.closest(".oakd-dropdown-content") as HTMLElement;
	expect(menu.style.getPropertyValue("--oakd-color-field-color")).toBe("#FF0000");

	rerender(<ColorField value={{ r: 0, g: 1, b: 0 }} onChange={change} defaultOpen />);
	expect(preview).toHaveAttribute("aria-label", "Selected color #00FF00");
	expect(menu.style.getPropertyValue("--oakd-color-field-color")).toBe("#00FF00");
	const trigger = screen.getByRole("button", { name: "#00FF00" });
	expect((trigger.parentElement as HTMLElement).style.getPropertyValue("--oakd-color-field-color")).toBe("#00FF00");
});

it("opens a complete RGB editor and emits normalized values", () => {
	const change = jest.fn();
	render(
		<ColorField
			value={{ r: 10 / 255, g: 20 / 255, b: 30 / 255 }}
			onChange={change}
		/>,
	);
	fireEvent.click(screen.getByRole("button", { name: /#0A141E/i }));
	expect(
		screen.getByRole("img", { name: "Selected color #0A141E" }),
	).toBeInTheDocument();
	expect(
		screen.getByLabelText("Red number").closest(".content.pad"),
	).not.toBeNull();
	fireEvent.change(screen.getByLabelText("Red number"), {
		target: { value: "42" },
	});
	expect(change).toHaveBeenCalledWith({
		r: 42 / 255,
		g: 20 / 255,
		b: 30 / 255,
		a: undefined,
	});
});

it("synchronizes hex, HSV, alpha, and mode changes", () => {
	const change = jest.fn();
	const modeChange = jest.fn();
	render(
		<ColorField
			value={{ r: 1, g: 0, b: 0, a: 0.5 }}
			onChange={change}
			onModeChange={modeChange}
			alpha
			defaultOpen
		/>,
	);
	fireEvent.click(screen.getByRole("button", { name: "HSV" }));
	expect(modeChange).toHaveBeenCalledWith("hsv");
	expect(screen.getByLabelText("Hue number")).toBeInTheDocument();
	expect(screen.getByLabelText("Alpha number")).toHaveValue(0.5);
	fireEvent.change(screen.getByLabelText("Hex color"), {
		target: { value: "336699" },
	});
	fireEvent.blur(screen.getByLabelText("Hex color"));
	expect(change).toHaveBeenLastCalledWith({
		r: 0.2,
		g: 0.4,
		b: 0.6,
		a: 0.5,
	});
});

it("normalizes legacy byte values at the boundary", () => {
	expect(normalizeColorValue({ r: 255, g: 128, b: 0 })).toEqual({
		r: 1,
		g: 128 / 255,
		b: 0,
		a: undefined,
	});
	expect(colorToHex({ r: 1, g: 128 / 255, b: 0 })).toBe("#ff8000");
});

it("shows the trigger hex by default and supports toggling it without changing the editor", () => {
  const props = { value: { r: 1, g: 0, b: 0 }, onChange: jest.fn() };
  const { rerender } = render(<ColorField {...props} />);
  const trigger = screen.getByRole("button", { name: "#FF0000" });
  expect(trigger).toHaveTextContent("#FF0000");

  rerender(<ColorField {...props} showHex={false} />);
  expect(screen.getByRole("button", { name: "#FF0000" })).toBe(trigger);
  expect(trigger).not.toHaveTextContent("#FF0000");
  expect(trigger.querySelector(".icon")).toBeInTheDocument();
  fireEvent.click(trigger);
  expect(screen.getByLabelText("Hex color")).toHaveValue("FF0000");
  fireEvent.change(screen.getByLabelText("Hex color"), { target: { value: "00FF00" } });
  fireEvent.blur(screen.getByLabelText("Hex color"));
  expect(props.onChange).toHaveBeenCalledWith({ r: 0, g: 1, b: 0, a: undefined });

  rerender(<ColorField {...props} showHex />);
  expect(trigger).toHaveTextContent("#FF0000");
});

it.each(["small", "default", "large"] as const)("uses the %s Button trigger size without resizing the editor", size => {
  render(<ColorField value={{ r: 1, g: 0, b: 0 }} onChange={jest.fn()} size={size} />);
  const trigger = screen.getByRole("button", { name: "#FF0000" });
  expect(trigger).toHaveClass(`size-${size}`);
  fireEvent.click(trigger);
  expect(screen.getByLabelText("Hex color")).toHaveClass("size-default");
  expect(screen.getByLabelText("Red number")).toHaveClass("size-default");
});


it.each(["blur", "Enter"])("updates shorthand colors live without expanding the draft until %s", (commit) => {
  const change = jest.fn();
  const Harness = () => {
    const [value, setValue] = React.useState({ r: 1, g: 0, b: 0, a: 0.5 });
    return <ColorField value={value} onChange={next => { change(next); setValue({ ...next, a: next.a! }); }} alpha defaultOpen />;
  };
  render(<Harness />);
  const input = screen.getByLabelText("Hex color");
  act(() => input.focus());
  for (const draft of ["FF000", "FF00", "FF0", "FF", "F", "", "abc"]) {
    fireEvent.change(input, { target: { value: draft } });
    expect(input).toHaveValue(draft);
  }
  expect(change).toHaveBeenCalledTimes(2);
  expect(screen.getByRole("img", { name: "Selected color #AABBCC" })).toBeInTheDocument();
  if (commit === "Enter") fireEvent.keyDown(input, { key: "Enter" });
  else fireEvent.blur(input);
  expect(change).toHaveBeenCalledTimes(2);
  expect(change).toHaveBeenLastCalledWith({ r: 170 / 255, g: 187 / 255, b: 204 / 255, a: 0.5 });
  expect(input).toHaveValue("AABBCC");
});

it("preserves an active hex draft through external updates and reverts invalid drafts on blur", () => {
  const change = jest.fn();
  const { rerender } = render(<ColorField value={{ r: 1, g: 0, b: 0 }} onChange={change} defaultOpen />);
  const input = screen.getByLabelText("Hex color");
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: "invalid" } });
  rerender(<ColorField value={{ r: 0, g: 1, b: 0 }} onChange={change} defaultOpen />);
  expect(input).toHaveValue("invalid");
  fireEvent.blur(input);
  expect(input).toHaveValue("00FF00");
  expect(change).not.toHaveBeenCalled();
});

it("routes native attributes to the color trigger and hex input", () => {
  const ref = React.createRef<HTMLInputElement>();
  const change = jest.fn();
  render(<ColorField value={{ r: 1, g: 0, b: 0 }} onChange={jest.fn()} aria-label="Accent color" id="accent" defaultOpen hexInputProps={{ ref, id: "accent-hex", name: "hex", "aria-label": "Accent hex", onChange: change, required: true }} />);
  expect(screen.getByRole("button", { name: "Accent color" })).toHaveAttribute("id", "accent");
  const input = screen.getByRole("textbox", { name: "Accent hex" });
  expect(ref.current).toBe(input);
  expect(input).toHaveAttribute("name", "hex");
  expect(input).toBeRequired();
  fireEvent.change(input, { target: { value: "abc" } });
  expect(change).toHaveBeenCalledTimes(1);
});
