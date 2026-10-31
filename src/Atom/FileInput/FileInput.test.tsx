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


it("forwards native identity, description and ref to the input", () => {
  const ref = React.createRef<HTMLInputElement>();
  render(<FileInput ref={ref} id="native-control" name="field" aria-label="Native field" aria-describedby="field-help" />);
  const control = screen.getByLabelText("Native field");
  expect(control.tagName).toBe("INPUT");
  expect(ref.current).toBe(control);
  expect(control).toHaveAttribute("id", "native-control");
  expect(control).toHaveAttribute("name", "field");
  expect(control).toHaveAttribute("aria-describedby", "field-help");
});
