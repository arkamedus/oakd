import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Textarea from "./Textarea";
it("supports layout, errors and native state", () => {
	render(<Textarea aria-label="Notes" wide grow error disabled />);
	expect(screen.getByLabelText("Notes")).toHaveClass(
		"wide",
		"grow",
		"oakd-textarea--error",
	);
	expect(screen.getByLabelText("Notes")).toBeDisabled();
});


it("forwards native identity, description and ref to the textarea", () => {
  const ref = React.createRef<HTMLTextAreaElement>();
  render(<Textarea ref={ref} id="native-control" name="field" aria-label="Native field" aria-describedby="field-help" />);
  const control = screen.getByLabelText("Native field");
  expect(control.tagName).toBe("TEXTAREA");
  expect(ref.current).toBe(control);
  expect(control).toHaveAttribute("id", "native-control");
  expect(control).toHaveAttribute("name", "field");
  expect(control).toHaveAttribute("aria-describedby", "field-help");
});
