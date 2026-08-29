import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ContentRail from "./ContentRail";
it("applies width and gutter contracts", () => {
	render(
		<ContentRail size="xl" gutter={false}>
			Rail
		</ContentRail>,
	);
	expect(screen.getByText("Rail")).toHaveClass("oakd-content-rail--xl");
	expect(screen.getByText("Rail")).not.toHaveClass("oakd-content-rail--gutter");
});
