import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Tabs from "./Tabs";
import { TabsProps } from "./Tabs.types";
import Card from "../Card/Card";

describe("Tabs Component", () => {
  let renderTabs: (props?: TabsProps) => void;

  beforeEach(() => {
    renderTabs = (props = {}) =>
      render(
        <Tabs {...props}>
          <Card key="1"  />
          <Card key="2" />
          <Card key="3"  />
        </Tabs>,
      );
  });

  it("should render the Tabs component", () => {
    renderTabs();
    expect(screen.getByTestId("Tabs")).toBeInTheDocument();
  });

  it("should render the correct number of Tab components", () => {
    renderTabs();
    expect(screen.getAllByTestId("Tab")).toHaveLength(3);
  });

  it("should set the correct active tab", () => {
    renderTabs();
    const tab2 = screen.getByText("Tab 2");
    fireEvent.click(tab2);
    expect(tab2).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Tab 1")).toHaveAttribute("aria-selected", "false");
  });

  it("should change the content when a different tab is clicked", () => {
    renderTabs();
    const tab3 = screen.getByText("Tab 3");
    fireEvent.click(tab3);
    expect(tab3).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Tab 1")).toHaveAttribute("aria-selected", "false");
  });

  it("should respect defaultActiveKey prop", () => {
    renderTabs({ defaultActiveKey: "2" });
    expect(screen.getByText("Tab 2")).toHaveAttribute("aria-selected", "true");
  });

  it("should call onChange when the active tab changes", () => {
    const handleChange = jest.fn();
    renderTabs({ onChange: handleChange });
    const tab3 = screen.getByText("Tab 3");
    fireEvent.click(tab3);
    expect(handleChange).toHaveBeenCalledWith("3");
  });
});
