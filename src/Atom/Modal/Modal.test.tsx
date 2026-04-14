import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Modal } from "./Modal";
import { ModalProps } from "./Modal.types";

describe("Modal Component", () => {
  let props: ModalProps;

  beforeEach(() => {
    props = {
      visible: false,
      title: "Delete integration",
      onClose: jest.fn(),
      children: <div>Removing this integration will revoke all active tokens.</div>,
    };
  });

  const renderComponent = () => render(<Modal {...props} />);

  it("does not render when hidden", () => {
    const { container } = renderComponent();
    expect(container).toBeEmptyDOMElement();
  });

  it("renders accessible dialog content when visible", () => {
    props.visible = true;
    renderComponent();

    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("Delete integration")).toBeInTheDocument();
    expect(
      screen.getByText("Removing this integration will revoke all active tokens."),
    ).toBeInTheDocument();
  });

  it("closes from the overlay and close button, but not from the dialog body", () => {
    props.visible = true;
    const { container } = renderComponent();

    const overlay = container.querySelector(".modal-container") as HTMLElement;
    fireEvent.click(screen.getByRole("dialog"));
    expect(props.onClose).not.toHaveBeenCalled();

    fireEvent.click(overlay);
    fireEvent.click(screen.getByRole("button", { name: "Close modal" }));

    expect(props.onClose).toHaveBeenCalledTimes(2);
  });
});
