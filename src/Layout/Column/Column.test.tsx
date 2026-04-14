import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Column from "./Column";

describe("Column Component", () => {
  it("applies responsive width classes for the configured breakpoints", () => {
    render(
      <Column xs={24} sm={12} md={8} lg={6} xl={4}>
        Metrics
      </Column>,
    );
    const column = screen.getByTestId("Column");

    expect(column).toHaveClass("xs-24");
    expect(column).toHaveClass("sm-12");
    expect(column).toHaveClass("md-8");
    expect(column).toHaveClass("lg-6");
    expect(column).toHaveClass("xl-4");
  });

  it("forwards standard DOM props without pretending to be a form control", () => {
    const handleMouseEnter = jest.fn();
    render(
      <Column
        xs={12}
        onMouseEnter={handleMouseEnter}
        role="presentation"
        aria-hidden="true"
      >
        Sidebar
      </Column>,
    );

    const column = screen.getByTestId("Column");
    fireEvent.mouseEnter(column);

    expect(handleMouseEnter).toHaveBeenCalled();
    expect(column).toHaveAttribute("role", "presentation");
    expect(column).toHaveAttribute("aria-hidden", "true");
  });

  it("acts as a flex column host for growing children", () => {
    render(
      <Column xs={12}>
        <div>Header</div>
        <div className="oakd grow">Body</div>
      </Column>,
    );

    const column = screen.getByTestId("Column");
    expect(column).toHaveClass("column");
    expect(screen.getByText("Body")).toHaveClass("grow");
  });
});
