import React from "react";
import { render, screen } from "@testing-library/react";
import HorizontalScroll from "./HorizontalScroll";

describe("HorizontalScroll Component", () => {
	it("renders a horizontal overflow container", () => {
		const { container } = render(
			<HorizontalScroll>
				<div>One</div>
				<div>Two</div>
			</HorizontalScroll>,
		);

		expect(screen.getByTestId("HorizontalScroll")).toBeInTheDocument();
		expect(container.querySelector(".horizontal-scroll__track")).toBeInTheDocument();
		expect(screen.getByText("One")).toBeInTheDocument();
		expect(screen.getByText("Two")).toBeInTheDocument();
	});

	it("wraps children in non-collapsing item hosts", () => {
		const { container } = render(
			<HorizontalScroll itemWidth={160}>
				<div>One</div>
				<div>Two</div>
			</HorizontalScroll>,
		);

		expect(container.querySelectorAll(".horizontal-scroll__item")).toHaveLength(2);
		expect(container.querySelector(".horizontal-scroll__item")).toHaveStyle({
			width: "160px",
		});
	});

	it("renders mixed children in order", () => {
		render(
			<HorizontalScroll>
				<div>Alpha</div>
				<button>Beta</button>
				<span>Gamma</span>
			</HorizontalScroll>,
		);

		expect(screen.getByText("Alpha")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Beta" })).toBeInTheDocument();
		expect(screen.getByText("Gamma")).toBeInTheDocument();
	});
});
