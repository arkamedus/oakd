import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Announcement from "./Announcement";

describe("Announcement Component", () => {
	it("renders content and optional icon", () => {
		render(
			<Announcement icon="Bell">
				<div>Maintenance starts at 10pm.</div>
			</Announcement>,
		);

		expect(screen.getByTestId("Announcement")).toHaveTextContent(
			"Maintenance starts at 10pm.",
		);
		expect(
			screen.getByTestId("Announcement").querySelector(".announcement__icon"),
		).toBeTruthy();
	});

	it("renders a close button only when closable", () => {
		const { rerender } = render(<Announcement>Passive notice</Announcement>);
		expect(screen.queryByRole("button", { name: "Close announcement" })).toBeNull();

		rerender(<Announcement closable>Dismissable notice</Announcement>);
		expect(screen.getByRole("button", { name: "Close announcement" })).toBeInTheDocument();
	});

	it("calls onClose when the close button is pressed", () => {
		const onClose = jest.fn();
		render(
			<Announcement closable onClose={onClose}>
				Close me
			</Announcement>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Close announcement" }));
		expect(onClose).toHaveBeenCalled();
	});

	it("applies the variant class", () => {
		render(<Announcement variant="primary">Important</Announcement>);
		expect(screen.getByTestId("Announcement")).toHaveClass("type-primary");
	});
});
