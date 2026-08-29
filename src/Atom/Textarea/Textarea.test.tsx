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
