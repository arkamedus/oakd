import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Collapsible from "./Collapsible";
import { CollapsibleProps } from "./Collapsible.types";

describe("Collapsible Component", () => {
  let props: CollapsibleProps;

  beforeEach(() => {
    props = {
      title: "Release notes",
      children: <div>Three issues were resolved in this deploy.</div>,
      defaultOpen: false,
      onToggle: jest.fn(),
    };
  });

  const renderComponent = () => render(<Collapsible {...props} />);

  it("renders a single trigger and the content region", () => {
    const { container } = renderComponent();

    expect(
      screen.getByRole("button", { name: /release notes/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Three issues were resolved in this deploy.")).toBeInTheDocument();
    expect(container.querySelector(".collapsible__content")).toHaveStyle(
      "height: 0",
    );
  });

  it("opens and reports state changes when toggled", async () => {
    const { container } = renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /release notes/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /release notes/i }),
      ).toHaveAttribute("aria-expanded", "true");
      expect(
        screen.getByRole("button", { name: /release notes/i }),
      ).toHaveAttribute(
        "aria-controls",
        container.querySelector(".collapsible__content")?.getAttribute("id"),
      );
      expect(container.querySelector(".collapsible__content")).toHaveStyle(
        "height: auto",
      );
    });

    expect(props.onToggle).toHaveBeenCalledWith(true);
  });

  it("respects the default open state", () => {
    props.defaultOpen = true;
    const { container } = renderComponent();

    expect(
      screen.getByRole("button", { name: /release notes/i }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(container.querySelector(".collapsible__content")).toHaveStyle(
      "height: auto",
    );
  });
});
