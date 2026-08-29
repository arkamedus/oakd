import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ActionList, { ActionListItem } from "./ActionList";
it("supports interactive and disabled list items", () => {
	const activate = jest.fn();
	render(
		<ActionList divided={false}>
			<ActionListItem title="Open" description="Details" onClick={activate} />
			<ActionListItem title="Disabled" disabled onClick={activate} />
		</ActionList>,
	);
	fireEvent.keyDown(screen.getByRole("button", { name: /Open/ }), {
		key: "Enter",
	});
	fireEvent.click(screen.getByText("Disabled"));
	expect(activate).toHaveBeenCalledTimes(1);
});

it("preserves explicit menu item semantics for context menus", () => {
	const activate = jest.fn();
	render(
		<ActionList role="presentation" divided={false}>
			<ActionListItem role="menuitem" title="Open" onClick={activate} />
		</ActionList>,
	);

	const item = screen.getByRole("menuitem", { name: "Open" });
	fireEvent.keyDown(item, { key: "Enter" });
	expect(activate).toHaveBeenCalledTimes(1);
	expect(screen.queryByRole("button", { name: "Open" })).toBeNull();
});
