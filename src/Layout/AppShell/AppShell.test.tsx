import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AppShell from "./AppShell";
import Paragraph from "../../Atom/Paragraph/Paragraph";
it("renders shell slots and sidebar modes", () => {
	const { rerender } = render(
		<AppShell
			header="Header"
			sidebar="Sidebar"
			footer="Footer"
			sidebarMode="collapsed"
		>
			Main
		</AppShell>,
	);
	expect(
		screen.getByText("Sidebar").closest(".oakd-app-shell__sidebar"),
	).toHaveAttribute("data-sidebar-mode", "collapsed");
	rerender(
		<AppShell sidebar="Sidebar" sidebarMode="hidden">
			Main
		</AppShell>,
	);
	expect(screen.queryByText("Sidebar")).not.toBeInTheDocument();
});

it("keeps padding on the shell and applies one optional gap between regions", () => {
	const { container, rerender } = render(
		<AppShell pad gap sidebar={<Paragraph>Navigation</Paragraph>}>
			<Paragraph>Main</Paragraph>
		</AppShell>,
	);
	const shell = container.querySelector(".oakd-app-shell");
	expect(shell).toHaveClass("pad", "oakd-app-shell--gap");
	expect(container.querySelector(".oakd-app-shell__workspace")).toHaveClass("gap");
	expect(container.querySelector(".oakd-app-shell__sidebar")).not.toHaveClass("pad");
	expect(container.querySelector(".oakd-app-shell__main")).not.toHaveClass("pad");
	rerender(<AppShell><Paragraph>Main</Paragraph></AppShell>);
	expect(shell).not.toHaveClass("pad", "oakd-app-shell--gap");
	expect(container.querySelector(".oakd-app-shell__workspace")).not.toHaveClass("gap");
});
