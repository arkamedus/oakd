import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Dropdown from "./Dropdown";
import ActionList, { ActionListItem } from "../ActionList/ActionList";
import Paragraph from "../Paragraph/Paragraph";

describe("Dropdown Component", () => {
	it("opens and closes the menu from the trigger button", () => {
		render(
			<Dropdown label="Actions">
				<div>Archive item</div>
			</Dropdown>,
		);

		const trigger = screen.getByRole("button", { name: "Actions" });
		fireEvent.click(trigger);

		expect(trigger).toHaveAttribute("aria-expanded", "true");
		expect(screen.getByText("Archive item").parentElement).toHaveClass(
			"active",
		);

		fireEvent.click(trigger);
		expect(trigger).toHaveAttribute("aria-expanded", "false");
	});

	it("closes when escape is pressed", () => {
		render(
			<Dropdown label="More">
				<div>Duplicate</div>
			</Dropdown>,
		);

		const trigger = screen.getByRole("button", { name: "More" });
		fireEvent.click(trigger);
		fireEvent.keyDown(trigger.closest(".oakd-dropdown-container")!, {
			key: "Escape",
		});

		expect(trigger).toHaveAttribute("aria-expanded", "false");
	});

	it("closes when clicking outside", () => {
		render(
			<Dropdown label="Quick actions">
				<div>Rename</div>
			</Dropdown>,
		);

		const trigger = screen.getByRole("button", { name: "Quick actions" });
		fireEvent.click(trigger);
		fireEvent.mouseDown(document);

		expect(trigger).toHaveAttribute("aria-expanded", "false");
	});

	it("renders fixed menus in a portal with adaptive placement variables", () => {
		render(
			<Dropdown fixed label="Portal menu">
				<div>Export</div>
			</Dropdown>,
		);

		const trigger = screen.getByRole("button", { name: "Portal menu" });
		fireEvent.click(trigger);
		const menu = screen.getByText("Export").parentElement as HTMLElement;

		expect(menu).toHaveClass("fixed");
		expect(menu.parentElement).toBe(document.body);
		expect(menu.style.getPropertyValue("--oakd-dropdown-fixed-top")).toBe(
			"8px",
		);
		expect(menu.style.getPropertyValue("--oakd-dropdown-fixed-left")).toBe(
			"8px",
		);
	});

	it("preserves ActionList menu items without wrapping them in buttons", () => {
		render(
			<Dropdown label="Actions">
				<ActionList role="menu" divided={false}>
					<ActionListItem
						role="menuitem"
						title={<Paragraph>Rename</Paragraph>}
						onClick={() => undefined}
					/>
				</ActionList>
			</Dropdown>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Actions" }));
		const item = screen.getByRole("menuitem", { name: "Rename" });
		expect(item).toHaveClass("oakd-action-list__item");
		expect(item).not.toHaveClass("button");
		expect(item.closest(".oakd-dropdown-content")).toHaveClass("card");
	});
});

it.each(["small", "default", "large"] as const)("forwards %s size to its Button trigger", size => {
  render(<Dropdown size={size} label="Actions"><Paragraph>Menu</Paragraph></Dropdown>);
  expect(screen.getByRole("button", { name: "Actions" })).toHaveClass(`size-${size}`);
});

it("forwards native trigger props and ref, composes handlers, and links its popup", () => {
  const ref = React.createRef<HTMLButtonElement>();
  const click = jest.fn();
  const slotClick = jest.fn();
  render(<><label htmlFor="actions">Document actions</label><Dropdown id="actions" name="actions" aria-describedby="help" onClick={click} triggerProps={{ ref, onClick: slotClick, title: "Actions" }}><Paragraph>Menu</Paragraph></Dropdown></>);
  const trigger = screen.getByLabelText("Document actions");
  expect(trigger.tagName).toBe("BUTTON");
  expect(ref.current).toBe(trigger);
  expect(trigger).toHaveAttribute("name", "actions");
  expect(trigger).toHaveAttribute("aria-describedby", "help");
  expect(trigger.parentElement).not.toHaveAttribute("id");
  fireEvent.click(trigger);
  expect(click).toHaveBeenCalledTimes(1);
  expect(slotClick).toHaveBeenCalledTimes(1);
  expect(document.getElementById(trigger.getAttribute("aria-controls")!)).toBeInTheDocument();
  expect(trigger).toHaveAttribute("aria-expanded", "true");
});
it("lets native click handlers cancel opening", () => {
  render(<Dropdown aria-label="Actions" onClick={event => event.preventDefault()} />);
  const trigger = screen.getByRole("button", { name: "Actions" });
  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded", "false");
});
