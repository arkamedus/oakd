import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Tabs, { Tab } from "./Tabs";
import { TabsProps } from "./Tabs.types";

describe("Tabs Component", () => {
  let renderTabs: (props?: TabsProps) => void;

  beforeEach(() => {
    renderTabs = (props = {}) =>
      render(
        <Tabs {...props}>
          <Tab key="overview" label="Overview">
            Overview panel
          </Tab>
          <Tab key="usage" label="Usage">
            Usage panel
          </Tab>
          <Tab key="history" label="History">
            History panel
          </Tab>
        </Tabs>,
      );
  });

  it("renders a tablist with the first tab active by default", () => {
    renderTabs();

    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveClass(
      "type-active",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Overview panel");
  });

  it("changes the active tab and panel content when a tab is clicked", () => {
    renderTabs();

    fireEvent.click(screen.getByRole("tab", { name: "Usage" }));

    expect(screen.getByRole("tab", { name: "Usage" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Usage panel");
  });

  it("supports controlled defaults and change notifications", () => {
    const handleChange = jest.fn();
    renderTabs({ defaultActiveKey: "history", onChange: handleChange });

    const historyTab = screen.getByRole("tab", { name: "History" });
    expect(historyTab).toHaveAttribute("aria-selected", "true");

    fireEvent.click(screen.getByRole("tab", { name: "Usage" }));
    expect(handleChange).toHaveBeenCalledWith("usage");
  });

  it("wires tabs to tabpanels with accessible relationships", () => {
    renderTabs();

    const overviewTab = screen.getByRole("tab", { name: "Overview" });
    const panel = screen.getByRole("tabpanel");
    expect(overviewTab).toHaveAttribute(
      "aria-controls",
      panel.getAttribute("id"),
    );
    expect(panel).toHaveAttribute(
      "aria-labelledby",
      overviewTab.getAttribute("id"),
    );
  });
});
