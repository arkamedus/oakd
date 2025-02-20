import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Modal } from "./Modal";

describe("Modal Component", () => {
  let props: any;

  beforeEach(() => {
    props = {
      visible: false,
      title: "Test Modal",
      content: "This is a test",
      onClose: jest.fn(),
    };
  });

  const renderComponent = () => render(<Modal {...props} />);

  it("should not render when visible is false", () => {
    props.visible = false;
    const { container } = renderComponent();
    expect(container).toBeEmptyDOMElement();
  });

  it("should render the modal when visible is true", () => {
    props.visible = true;
    const { getByText } = renderComponent();
    expect(getByText("Test Modal")).toBeInTheDocument();
  });

  it("should call onClose when clicking the close button", () => {
    props.visible = true;
    const { getByText } = renderComponent();
    const closeButton = getByText("×");
    fireEvent.click(closeButton);
    expect(props.onClose).toHaveBeenCalled();
  });

  it("should render children correctly", () => {
    props.visible = true;
    props.children = <div data-testid="child">Child Content</div>;
    const { getByTestId } = renderComponent();
    expect(getByTestId("child")).toHaveTextContent("Child Content");
  });
});