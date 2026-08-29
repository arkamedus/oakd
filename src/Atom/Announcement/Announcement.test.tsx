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
			screen
				.getByTestId("Announcement")
				.querySelector(".oakd-announcement__leading"),
		).toBeTruthy();
		expect(
			screen
				.getByTestId("Announcement")
				.querySelector(".oakd-announcement__leading .icon-small"),
		).toBeTruthy();
	});

	it("renders a close icon only when closable", () => {
		const { rerender } = render(<Announcement>Passive notice</Announcement>);
		expect(screen.queryByLabelText("Close announcement")).toBeNull();

		rerender(<Announcement closable>Dismissable notice</Announcement>);
		expect(screen.getByLabelText("Close announcement")).toBeInTheDocument();
		expect(
			screen
				.getByLabelText("Close announcement")
				.querySelector(".icon-small"),
		).toBeTruthy();
		expect(
			screen.queryByRole("button", { name: "Close announcement" }),
		).toBeNull();
	});

	it("calls onClose when the close icon is pressed", () => {
		const onClose = jest.fn();
		render(
			<Announcement closable onClose={onClose}>
				Close me
			</Announcement>,
		);

		fireEvent.click(screen.getByLabelText("Close announcement"));
		expect(onClose).toHaveBeenCalled();
	});

	it("applies the variant class", () => {
		render(<Announcement variant="primary">Important</Announcement>);
		expect(screen.getByTestId("Announcement")).toHaveClass("type-primary");
	});
});
