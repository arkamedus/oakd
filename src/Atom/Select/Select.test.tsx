import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Select from "./Select";
import { SelectProps } from "./Select.types";
import Paragraph from "../Paragraph/Paragraph";
import { ActionListItem } from "../ActionList/ActionList";

describe("Select Component", () => {
  let props: SelectProps<string>;

  beforeEach(() => {
    props = {
      options: [
        { value: "1", element: <Paragraph>Option 1</Paragraph> },
        { value: "2", element: <Paragraph>Option 2</Paragraph> },
      ],
      onChange: jest.fn(),
      fixed: false,
    };
  });

  const renderComponent = (p?) => render(<Select {...props} {...p} />);

  it("keeps category dividers outside padded headings", () => {
    renderComponent({
      defaultOpen: true,
      categoryOrder: ["Open"],
      options: [
        {
          value: "draft",
          category: "Open",
          element: <Paragraph>Draft</Paragraph>,
        },
      ],
    });
    const menu = screen.getByRole("listbox");
    const divider = screen.getByTestId("Divider");
    expect(menu).toContainElement(divider);
    expect(divider.closest(".pad")).toBeNull();
    expect(screen.getByText("Open").closest(".pad")).not.toBeNull();
  });

  it("uses the neutral trigger by default and preserves the disabled state", () => {
    const { rerender } = renderComponent();
    const button = screen.getByRole("button");

    expect(button).toHaveClass("type-default");
    expect(button).not.toHaveClass("type-ghost", "disabled");

    rerender(<Select {...props} disabled />);

    expect(button).toHaveClass("type-disabled", "disabled");
    expect(button).toBeDisabled();
  });

  it("should open dropdown menu when button is clicked", () => {
    renderComponent();
    const button = screen.getByRole("button");
    fireEvent.click(button);
    const dropdown = screen.getByRole("listbox");
    expect(dropdown).toHaveClass("active");
    expect(button.querySelector(".icon")?.parentElement).toHaveStyle({
      transform: "rotate(90deg)",
    });
  });

  it("should allow selection of an option via click", () => {
    renderComponent();
    const button = screen.getByRole("button");
    fireEvent.click(button);
    const option = screen.getByText("Option 1");
    fireEvent.click(option);
    expect(props.onChange).toHaveBeenCalledWith("1");
  });

  it("should allow selection of an option via keyboard (Enter key)", () => {
    renderComponent();
    const button = screen.getByRole("button");
    fireEvent.keyDown(button, { key: "Enter" });
    const option = screen.getByText("Option 2");
    fireEvent.keyDown(option, { key: "Enter" });
    expect(props.onChange).toHaveBeenCalledWith("2");
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
    const button = screen.getByRole("button");
    fireEvent.click(button);
    const dropdown = screen.getByRole("listbox");

    expect(dropdown).toHaveClass("oakd-select__dropdown--fixed");
    expect(dropdown.parentElement).toBe(document.body);
    expect(dropdown.style.getPropertyValue("--oakd-dropdown-fixed-top")).toBe(
      "8px",
    );
    expect(dropdown.style.getPropertyValue("--oakd-dropdown-fixed-left")).toBe(
      "8px",
    );
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

  it("should support controlled values", () => {
    renderComponent({ value: "2" });
    expect(
      screen.getByRole("button", { name: "Option 2" }),
    ).toBeInTheDocument();
  });

  it("only marks the selected option as selected", () => {
    renderComponent({ value: "2" });
    fireEvent.click(screen.getByRole("button", { name: "Option 2" }));
    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "false");
    expect(options[1]).toHaveAttribute("aria-selected", "true");
  });

  it("uses a supplied ActionListItem as the option surface", () => {
    renderComponent({
      defaultOpen: true,
      options: [
        {
          value: "1",
          label: <Paragraph>Option 1</Paragraph>,
          element: (
            <ActionListItem
              title={<Paragraph>Option 1</Paragraph>}
              description={<Paragraph>Passed action content</Paragraph>}
            />
          ),
        },
      ],
    });

    const option = screen.getByRole("option", { name: /Option 1/ });
    expect(option).toHaveClass("oakd-action-list__item");
    expect(option).not.toHaveClass("oakd-select__item");
    fireEvent.click(option);
    expect(props.onChange).toHaveBeenCalledWith("1");
    expect(
      screen.getByRole("button", { name: "Option 1" }),
    ).toBeInTheDocument();
  });
});
