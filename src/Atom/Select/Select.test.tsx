import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Select from "./Select";
import { SelectProps } from "./Select.types";
import Paragraph from "../Paragraph/Paragraph";

describe("Select Component", () => {
	let props: SelectProps<string>;

	beforeEach(() => {
		props = {
			options: [
				{ value: "1", element: <Paragraph>Option 1</Paragraph> },
				{ value: "2", element: <Paragraph>Option 2</Paragraph> },
			],
			onSelected: jest.fn(),
			fixed: false
		};
	});

	const renderComponent = (p?) => render(<Select {...props} {...p} />);

	it("should open dropdown menu when button is clicked", () => {
		renderComponent();
		const button = screen.getByRole("button");
		fireEvent.click(button);
		const dropdown = screen.getByRole("listbox");
		expect(dropdown).toHaveClass("active");
	});

	it("should allow selection of an option via click", () => {
		renderComponent();
		const button = screen.getByRole("button");
		fireEvent.click(button);
		const option = screen.getByText("Option 1");
		fireEvent.click(option);
		expect(props.onSelected).toHaveBeenCalledWith("1");
	});

	it("should allow selection of an option via keyboard (Enter key)", () => {
		renderComponent();
		const button = screen.getByRole("button");
		fireEvent.keyDown(button, { key: "Enter" });
		const option = screen.getByText("Option 2");
		fireEvent.keyDown(option, { key: "Enter" });
		expect(props.onSelected).toHaveBeenCalledWith("2");
	});

	it("should close the dropdown when clicking outside", () => {
		renderComponent();
		const button = screen.getByRole("button");
		fireEvent.click(button);
		const dropdown = screen.getByRole("listbox");
		expect(dropdown).toHaveClass("active");
		fireEvent.mouseDown(document);
		expect(dropdown).not.toHaveClass("active");
	});

	it("should render with the correct size prop", () => {
		props.size = "small";
		renderComponent();
		const button = screen.getByRole("button");
		expect(button.className).toMatch(/small/);
	});

	it("should position dropdown correctly in fixed mode", () => {
		// Render in fixed mode (default fixed: true)
		renderComponent({ fixed: true });
		const container = screen.getByTestId("Select");
		const button = screen.getByRole("button");
		fireEvent.click(button);
		const dropdown = screen.getByRole("listbox");

		// In fixed mode, the inline style is computed from the container's bounding rect
		const { bottom, left } = container.getBoundingClientRect();
		expect(dropdown).toHaveStyle(`top: ${bottom}px`);
		expect(dropdown).toHaveStyle(`left: ${left}px`);
	});

	it("should position dropdown correctly in absolute mode", () => {
		// Render in absolute mode by setting fixed: false
		renderComponent({ fixed: false });
		const button = screen.getByRole("button");
		fireEvent.click(button);
		const dropdown = screen.getByRole("listbox");

		// In absolute mode, the dropdown is positioned via CSS (top: 100%; left: 0;)
		// so no inline styles should be present, and the absolute positioning class is applied.
		expect(dropdown).toHaveClass("oakd-select__dropdown--absolute");
		expect(dropdown.style.top).toBe("");
		expect(dropdown.style.left).toBe("");
	});
});