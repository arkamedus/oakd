import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchSelect from "./SearchSelect";
it("filters, skips disabled choices and preserves generic callbacks", () => {
  const change = jest.fn();
  render(
    <SearchSelect
      options={[
        { value: 1, label: "One" },
        { value: 2, label: "Two", disabled: true },
      ]}
      onChange={change}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Select an option" }));
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "One" } });
  fireEvent.click(screen.getByRole("option", { name: "One" }));
  expect(change.mock.calls[0][0]).toBe(1);
});

it("only marks the selected ActionList option as selected", () => {
  render(
    <SearchSelect
      options={[
        { value: 1, label: "One" },
        { value: 2, label: "Two" },
      ]}
      value={2}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Two" }));
  const options = screen.getAllByRole("option");
  expect(options[0]).toHaveClass("oakd-action-list__item");
  expect(options[0]).toHaveAttribute("aria-selected", "false");
  expect(options[1]).toHaveClass("oakd-action-list__item");
  expect(options[1]).toHaveAttribute("aria-selected", "true");
  expect(
    screen.getByRole("button", { name: "Two" }).querySelector(".icon")
      ?.parentElement,
  ).toHaveStyle({ transform: "rotate(90deg)" });
});

it("uses a full-width ActionList for rendered options", () => {
  render(
    <SearchSelect
      options={[
        { value: 1, label: "One" },
        { value: 2, label: "Two" },
      ]}
      open
    />,
  );
  const optionList = screen.getAllByRole("option")[0].parentElement;
  expect(optionList).toHaveClass("oakd-action-list");
  expect(screen.getAllByRole("option")[0]).not.toHaveClass("button");
});

it("applies the Select size contract to the trigger without resizing the menu", () => {
  render(<SearchSelect options={[{ value: 1, label: "One" }]} size="large" />);

  const trigger = screen.getByRole("button", { name: "Select an option" });
  expect(trigger).toHaveClass("size-large");
  expect(trigger.closest(".oakd-search-select")).toHaveClass("size-large");

  fireEvent.click(trigger);
  expect(screen.getByRole("textbox")).toHaveClass("size-default");
  expect(screen.getByRole("listbox")).not.toHaveClass("size-large");
});

it("carries scoped design tokens to the portaled menu", () => {
  const original = window.getComputedStyle;
  const spy = jest.spyOn(window, "getComputedStyle").mockImplementation(element => {
    if (element.classList.contains("oakd-search-select")) {
      const style = document.createElement("div").style;
      style.setProperty("--oakd-radius", "12px");
      style.setProperty("--oakd-card-default-color", "pink");
      return style;
    }
    return original(element);
  });
  try {
    render(<SearchSelect options={[{ value: 1, label: "One" }]} open />);
    const menu = screen.getByRole("listbox");
    expect(menu.parentElement).toBe(document.body);
    expect(menu.style.getPropertyValue("--oakd-radius")).toBe("12px");
    expect(menu.style.getPropertyValue("--oakd-card-default-color")).toBe("pink");
  } finally {
    spy.mockRestore();
  }
});
