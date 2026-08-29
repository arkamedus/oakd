import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FileInput from "./FileInput";
it("forwards file input constraints", () => {
	render(
		<FileInput
			aria-label="Assets"
			accept="image/png"
			multiple
			disabled
			buttonLabel="Choose assets"
		/>,
	);
	const input = screen.getByLabelText("Assets");
	expect(input).toHaveAttribute("type", "file");
	expect(input).toHaveAttribute("accept", "image/png");
	expect(input).toBeDisabled();
});
