import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ColorField, { colorToHex, normalizeColorValue } from "./ColorField";

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
