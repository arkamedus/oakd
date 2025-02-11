import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import Collapsible from "./Collapsible";
import { CollapsibleProps } from "./Collapsible.types";

describe("Collapsible Component", () => {
  let props: CollapsibleProps;

  beforeEach(() => {
    props = {
      title: "Test Title",
      children: <div>Test Content</div>,
      action: <button>Test Action</button>,
      defaultOpen: false,
      onToggle: jest.fn(),
    };
  });

  const renderComponent = () => render(<Collapsible {...props} />);

  it("should render title, action, and content", () => {
    const { getByText } = renderComponent();
    expect(getByText("Test Title")).toBeInTheDocument();
    expect(getByText("Test Action")).toBeInTheDocument();
    expect(getByText("Test Content")).toBeInTheDocument();
  });

  it("should not show content when collapsed", () => {
    const { container } = renderComponent();
    expect(container.querySelector(".collapsible__content")).toHaveStyle("height: 0");
  });

  it("should toggle open state when clicked", async () => {
    const { getByText } = renderComponent();
    const toggleButton = getByText("Test Title");

    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(getByText("Test Title").parentNode.parentNode).toHaveAttribute("aria-expanded", "true");
    });

    expect(props.onToggle).toHaveBeenCalledWith(true);
  });

  it("should update content height to auto when opened", async () => {
    const { getByText, container } = renderComponent();
    const toggleButton = getByText("Test Title");

    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(container.querySelector(".collapsible__content")).toHaveStyle("height: auto");
    });
  });

  it("should call onToggle when the component is toggled", async () => {
    const { getByText } = renderComponent();
    const toggleButton = getByText("Test Title");

    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(props.onToggle).toHaveBeenCalled();
    });
  });
});
