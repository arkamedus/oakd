import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RangeInput from "./RangeInput";
it("reports numeric values and optionally renders output", () => {
	const change = jest.fn();
	render(
		<RangeInput
			aria-label="Range"
			defaultValue={4}
			onChange={change}
			showValue
		/>,
	);
	fireEvent.change(screen.getByRole("slider"), { target: { value: "7" } });
	expect(change.mock.calls[0][0]).toBe(7);
	expect(screen.getByText("7")).toBeInTheDocument();
});
