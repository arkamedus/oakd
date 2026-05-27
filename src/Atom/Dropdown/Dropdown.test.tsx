import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Dropdown from "./Dropdown";

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
    expect(menu.style.getPropertyValue("--oakd-dropdown-fixed-top")).toBe("8px");
    expect(menu.style.getPropertyValue("--oakd-dropdown-fixed-left")).toBe("0px");
  });
});
