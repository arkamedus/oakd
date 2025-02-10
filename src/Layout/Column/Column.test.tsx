import React from "react";
import { render } from "@testing-library/react";
import Column from "./Column";
import { ColumnProps } from "./Column.types";

describe("Column Component", () => {
  const renderComponent = (props: ColumnProps) =>
    render(<Column {...props} data-testid="Column" />);

  it("should render without crashing", () => {
    const { getByTestId } = renderComponent({});
    expect(getByTestId("Column")).toBeInTheDocument();
  });

  it("should apply correct classes for different sizes", () => {
    const { getByTestId } = renderComponent({
      xs: 12,
      sm: 6,
      md: 4,
      lg: 3,
      xl: 2,
    });
    const column = getByTestId("Column");

    expect(column).toHaveClass("xs-12");
    expect(column).toHaveClass("sm-6");
    expect(column).toHaveClass("md-4");
    expect(column).toHaveClass("lg-3");
    expect(column).toHaveClass("xl-2");
  });

  it("should support additional class names", () => {
    const { getByTestId } = renderComponent({ className: "custom-class" });
    expect(getByTestId("Column")).toHaveClass("custom-class");
  });

  it("should support style props", () => {
    const style = { backgroundColor: "red" };
    const { getByTestId } = renderComponent({ style });
    expect(getByTestId("Column")).toHaveStyle("background-color: red");
  });

  it("should render children correctly", () => {
    const { getByTestId } = render(
      <Column data-testid="column">Content</Column>,
    );
    expect(getByTestId("Column")).toHaveTextContent("Content");
  });
});
