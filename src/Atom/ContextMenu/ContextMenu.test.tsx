import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ContextMenu from "./ContextMenu";

describe("ContextMenu Component", () => {
	it("prevents the native context menu and opens the custom menu", async () => {
		render(
			<ContextMenu content={<div>Delete</div>}>
				<div>Target</div>
			</ContextMenu>,
		);

		const target = screen.getByText("Target");
		fireEvent.contextMenu(target, { clientX: 120, clientY: 80 });

		expect(await screen.findByTestId("ContextMenu")).toBeInTheDocument();
		expect(screen.getByText("Delete")).toBeInTheDocument();
	});

	it("closes on outside click", async () => {
		render(
			<ContextMenu content={<div>Rename</div>}>
				<div>Target</div>
			</ContextMenu>,
		);

		fireEvent.contextMenu(screen.getByText("Target"), { clientX: 100, clientY: 80 });
		expect(await screen.findByTestId("ContextMenu")).toBeInTheDocument();

		fireEvent.mouseDown(document.body);
		await waitFor(() => {
			expect(screen.queryByTestId("ContextMenu")).toBeNull();
		});
	});

	it("closes when the trigger area is left-clicked while open", async () => {
		render(
			<ContextMenu content={<div>Rename</div>}>
				<div>Target</div>
			</ContextMenu>,
		);

		fireEvent.contextMenu(screen.getByText("Target"), { clientX: 100, clientY: 80 });
		expect(await screen.findByTestId("ContextMenu")).toBeInTheDocument();

		fireEvent.mouseDown(screen.getByText("Target"), { button: 0 });
		await waitFor(() => {
			expect(screen.queryByTestId("ContextMenu")).toBeNull();
		});
	});

	it("closes on escape", async () => {
		render(
			<ContextMenu content={<div>Duplicate</div>}>
				<div>Target</div>
			</ContextMenu>,
		);

		fireEvent.contextMenu(screen.getByText("Target"), { clientX: 100, clientY: 80 });
		expect(await screen.findByTestId("ContextMenu")).toBeInTheDocument();

		fireEvent.keyDown(document, { key: "Escape" });
		await waitFor(() => {
			expect(screen.queryByTestId("ContextMenu")).toBeNull();
		});
	});

	it("clamps position near the viewport edge", async () => {
		const innerWidth = window.innerWidth;
		const innerHeight = window.innerHeight;
		Object.defineProperty(window, "innerWidth", { configurable: true, value: 320 });
		Object.defineProperty(window, "innerHeight", { configurable: true, value: 240 });

		const original = HTMLElement.prototype.getBoundingClientRect;
		HTMLElement.prototype.getBoundingClientRect = function () {
			if ((this as HTMLElement).dataset.testid === "ContextMenu") {
				return {
					x: 0,
					y: 0,
					top: 0,
					left: 0,
					right: 200,
					bottom: 160,
					width: 200,
					height: 160,
					toJSON: () => ({}),
				} as DOMRect;
			}
			return original.call(this);
		};

		render(
			<ContextMenu content={<div>Archive</div>}>
				<div>Target</div>
			</ContextMenu>,
		);

		fireEvent.contextMenu(screen.getByText("Target"), { clientX: 300, clientY: 220 });
		const menu = await screen.findByTestId("ContextMenu");
		await waitFor(() => {
			expect(parseFloat(menu.style.left)).toBeLessThan(300);
			expect(parseFloat(menu.style.top)).toBeLessThan(220);
		});

		HTMLElement.prototype.getBoundingClientRect = original;
		Object.defineProperty(window, "innerWidth", { configurable: true, value: innerWidth });
		Object.defineProperty(window, "innerHeight", { configurable: true, value: innerHeight });
	});
});
