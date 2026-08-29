import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "../Button/Button";
import Tooltip from "./Tooltip";

it("keeps hover content open while the pointer moves into the popup", () => {
	render(
		<Tooltip content="Details">
			<Button>Inspect</Button>
		</Tooltip>,
	);
	const root = screen
		.getByRole("button", { name: "Inspect" })
		.closest(".tooltip");
	expect(root).not.toBeNull();
	fireEvent.mouseEnter(root);
	expect(screen.getByRole("tooltip")).toHaveTextContent("Details");
	expect(root?.querySelector(".tooltip__bridge.top-left")).toBeInTheDocument();
	fireEvent.mouseEnter(screen.getByRole("tooltip"));
	expect(screen.getByRole("tooltip")).toBeInTheDocument();
	fireEvent.mouseLeave(root);
	expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
});

it("supports controlled click confirmation content", () => {
	const change = jest.fn();
	const { rerender } = render(
		<Tooltip
			interaction="click"
			open={false}
			onOpenChange={change}
			content={<Button>Confirm delete</Button>}
		>
			<Button>Delete</Button>
		</Tooltip>,
	);
	fireEvent.click(screen.getByRole("button", { name: "Delete" }));
	expect(change).toHaveBeenCalledWith(true);
	rerender(
		<Tooltip
			interaction="click"
			open
			onOpenChange={change}
			content={<Button>Confirm delete</Button>}
		>
			<Button>Delete</Button>
		</Tooltip>,
	);
	expect(screen.getByRole("dialog")).toContainElement(
		screen.getByRole("button", { name: "Confirm delete" }),
	);
});

it.each(["top", "right", "bottom", "left"] as const)(
	"supports centered %s placement",
	(direction) => {
		render(
			<Tooltip direction={direction} defaultOpen content="Details">
				<Button>Inspect</Button>
			</Tooltip>,
		);
		expect(screen.getByRole("tooltip")).toHaveClass(direction);
		expect(
			screen
				.getByRole("button", { name: "Inspect" })
				.closest(".tooltip")
				?.querySelector(`.tooltip__bridge.${direction}`),
		).toBeInTheDocument();
	},
);

it("closes click content from outside interaction and Escape", () => {
	render(
		<Tooltip interaction="click" content="Actions">
			<Button>Open actions</Button>
		</Tooltip>,
	);
	fireEvent.click(screen.getByRole("button", { name: "Open actions" }));
	expect(screen.getByRole("dialog")).toBeInTheDocument();
	fireEvent.keyDown(document, { key: "Escape" });
	expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	fireEvent.click(screen.getByRole("button", { name: "Open actions" }));
	fireEvent.mouseDown(document.body);
	expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
