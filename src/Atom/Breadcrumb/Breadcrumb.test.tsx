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
        { text: "Billing", href: "/billing" },
        { text: "Invoices", href: "/billing/invoices" },
      ],
      separator: "slash",
    };
  });

  const renderComponent = () => render(<Breadcrumb {...props} />);

  it("renders breadcrumb items as navigation list content", () => {
    renderComponent();

    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getAllByTestId("breadcrumb-separator")).toHaveLength(2);
  });

  it("renders linked ancestors and marks the current page", () => {
    renderComponent();

    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");
    expect(screen.getByText("Billing").closest("a")).toHaveAttribute(
      "href",
      "/billing",
    );
    expect(screen.getByText("Invoices").closest("a")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("supports non-linked current items and custom item classes", () => {
    props.items = [
      { text: "Home", href: "/" },
      { text: <strong>Projects</strong>, href: "/projects" },
      { text: "Q2 rollout", className: "current-item" },
    ];
    renderComponent();

    expect(screen.getByText("Q2 rollout").tagName).toBe("SPAN");
    expect(screen.getByText("Q2 rollout")).toHaveClass("current-item");
    expect(screen.getByText("Projects")).toBeInTheDocument();
  });
});
