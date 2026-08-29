import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EmptyState from "./EmptyState";
it("renders optional icon, description and actions", () => {
	render(
		<EmptyState
			icon="Icon"
			title="Empty"
			description="Description"
			actions="Action"
		/>,
	);
	expect(screen.getByText("Empty")).toBeInTheDocument();
	expect(screen.getByText("Action")).toBeInTheDocument();
});
