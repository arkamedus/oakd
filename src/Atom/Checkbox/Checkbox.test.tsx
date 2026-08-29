import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Paragraph from "../Paragraph/Paragraph";
import Checkbox from "./Checkbox";

jest.mock("../../Icon/Icon", () => ({
	__esModule: true,
	default: ({
		name,
		size,
		className,
	}: {
		name: string;
		size: string;
		className?: string;
	}) => (
		<span
			data-testid={`icon-${name}`}
			data-size={size}
			className={className}
		/>
	),
	IconStack: ({
		children,
		className,
	}: {
		children: React.ReactNode;
		className?: string;
	}) => <span className={className}>{children}</span>,
}));

it("uses native checkbox behavior", () => {
	render(<Checkbox label={<Paragraph>Updates</Paragraph>} />);
	const checkbox = screen.getByRole("checkbox", { name: "Updates" });
	fireEvent.click(checkbox);
	expect(checkbox).toBeChecked();
});

it("supports a custom checked icon and OakD control size", () => {
	render(
		<Checkbox
			label={<Paragraph>Rejected</Paragraph>}
			icon="X"
			size="small"
			defaultChecked
		/>,
	);

	expect(screen.getByTestId("icon-Square")).toHaveAttribute(
		"data-size",
		"small",
	);
	expect(screen.getByTestId("icon-X")).toHaveAttribute("data-size", "small");
	expect(screen.getByRole("checkbox", { name: "Rejected" })).toBeChecked();
});

it("applies custom color styling to the Checkbox surface", () => {
	render(
		<Checkbox
			label={<Paragraph>Approved</Paragraph>}
			defaultChecked
			style={{ color: "var(--oakd-success-border)" }}
		/>,
	);

	expect(screen.getByText("Approved").closest("label")).toHaveStyle({
		color: "var(--oakd-success-border)",
	});
});
