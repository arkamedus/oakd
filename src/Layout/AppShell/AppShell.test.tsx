import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AppShell from "./AppShell";
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
