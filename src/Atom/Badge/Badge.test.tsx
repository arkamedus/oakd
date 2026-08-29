import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "../Button/Button";
import Paragraph from "../Paragraph/Paragraph";
import Badge from "./Badge";
it("wraps content with an accessible notification dot", () => {
	const { rerender } = render(
		<Badge variant="success" label="Ready notification">
			<Button>
				<Paragraph>Ready</Paragraph>
			</Button>
		</Badge>,
	);
	expect(screen.getByRole("status", { name: "Ready notification" })).toBeVisible();
	expect(screen.getByText("Ready").closest(".oakd-badge")).toHaveClass(
		"type-success",
	);
	rerender(
		<Badge hidden label="Offline notification">
			<Button>
				<Paragraph>Offline</Paragraph>
			</Button>
		</Badge>,
	);
	expect(screen.queryByRole("status")).not.toBeInTheDocument();
});
