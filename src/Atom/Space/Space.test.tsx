import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Space from "./Space";

describe("Space Component", () => {
  const renderComponent = (props = {}) =>
    render(
      <Space data-testid="Space" {...props}>
        <div>Item 1</div>
        <div>Item 2</div>
      </Space>,
    );

  it("should render without errors", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId("Space")).toBeInTheDocument();
  });

  it("should apply default classes", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId("Space")).toHaveClass("space");
  });

  it("should render children correctly", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId("Space")).toHaveTextContent("Item 1");
    expect(getByTestId("Space")).toHaveTextContent("Item 2");
  });

  it("should apply gap class when gap prop is true", () => {
    const { getByTestId } = renderComponent({ gap: true });
    expect(getByTestId("Space")).toHaveClass("gap");
  });

  it("should apply direction class correctly", () => {
    const { getByTestId } = renderComponent({ direction: "vertical" });
    expect(getByTestId("Space")).toHaveClass("direction-vertical");
  });

  it("should apply alignment class correctly", () => {
    const { getByTestId } = renderComponent({ align: "center" });
    expect(getByTestId("Space")).toHaveClass("align-center");
  });

  it("should apply justification class correctly", () => {
    const { getByTestId } = renderComponent({ justify: "between" });
    expect(getByTestId("Space")).toHaveClass("justify-between");
  });

  it("should ensure both DebugLayer components have the same height", () => {
    const { getByTestId } = render(
        <Space justify={"stretch"} style={{width:"50px"}}>
          <div data-testid={"DL-02"}>Item 1</div>
          <div data-testid="DL-01"><h1>Item 2</h1></div>
        </Space>,
    );

    const debugLayer1 = getByTestId("DL-01");
    const debugLayer2 = getByTestId("DL-02");

    expect(debugLayer1).toBeInTheDocument();
    expect(debugLayer2).toBeInTheDocument();

    const height1 = debugLayer1.getBoundingClientRect().height;
    const height2 = debugLayer2.getBoundingClientRect().height;

    expect(height1).toBe(height2);
  });

  it("should match snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

});
