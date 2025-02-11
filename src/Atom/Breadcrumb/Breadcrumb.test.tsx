import React from "react";
import { render, screen } from "@testing-library/react";
import Breadcrumb from "./Breadcrumb";
import { BreadcrumbProps } from "./Breadcrumb.types";

describe("Breadcrumb Component", () => {
  let props: BreadcrumbProps;

  beforeEach(() => {
    props = {
      items: [
        { text: "Home", href: "/" },
        { text: "Library", href: "/library" },
        { text: "Data", href: "/library/data" },
      ],
      separator: "slash",
    };
  });

  const renderComponent = () => render(<Breadcrumb {...props} />);

  it("should render correct text for each breadcrumb item", () => {
    renderComponent();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Library")).toBeInTheDocument();
    expect(screen.getByText("Data")).toBeInTheDocument();
  });

  it("should render anchors when href is provided", () => {
    renderComponent();
    const homeLink = screen.getByText("Home").closest("a");
    const libraryLink = screen.getByText("Library").closest("a");
    const dataLink = screen.getByText("Data").closest("a");

    expect(homeLink).toHaveAttribute("href", "/");
    expect(libraryLink).toHaveAttribute("href", "/library");
    expect(dataLink).toHaveAttribute("href", "/library/data");
  });

  it("should render spans when href is not provided", () => {
    props.items[2].href = undefined;
    renderComponent();
    const dataItem = screen.getByText("Data");
    expect(dataItem.tagName).toBe("SPAN");
  });

  it("should have the correct number of breadcrumb items", () => {
    renderComponent();
    const items = screen.getAllByRole("link");
    expect(items.length).toBe(3);
  });

  it("should apply the correct separator between items", () => {
    renderComponent();
    const separators = screen.getAllByTestId("breadcrumb-separator");
    expect(separators.length).toBe(2); // 3 items have 2 separators
  });

  it("should handle mixed content in items", () => {
    props.items = [
      { text: "Home", href: "/" },
      { text: <strong>Library</strong>, href: "/library" },
      { text: "Data" },
    ];
    renderComponent();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Library")).toBeInTheDocument();
    expect(screen.getByText("Data")).toBeInTheDocument();
  });

  it("should apply custom class names to breadcrumb items", () => {
    props.items = [
      { text: "Home", href: "/", className: "custom-home" },
      { text: "Library", href: "/library", className: "custom-library" },
    ];
    renderComponent();
    expect(screen.getByText("Home")).toHaveClass("custom-home");
    expect(screen.getByText("Library")).toHaveClass("custom-library");
  });

  it("should set aria-current to 'page' for the last breadcrumb item", () => {
    renderComponent();
    const lastItem = screen.getByText("Data").closest("a");
    expect(lastItem).toHaveAttribute("aria-current", "page");
  });

  it("should not set aria-current for intermediate breadcrumb items", () => {
    renderComponent();
    const intermediateItem = screen.getByText("Library").closest("a");
    expect(intermediateItem).not.toHaveAttribute("aria-current");
  });

  it("should render without crashing when items array is empty", () => {
    props.items = [];
    renderComponent();
    let breadcrumb;
    try {
      breadcrumb = screen.getByRole("navigation") || undefined;
    }catch (e) {
      //console.info(e);
    }
    expect(breadcrumb).toEqual(undefined);
  });

});
