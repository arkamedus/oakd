import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import VectorField from "./VectorField";
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
