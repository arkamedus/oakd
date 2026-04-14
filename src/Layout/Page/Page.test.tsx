import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Page from "./Page";

describe("Page Component", () => {
  it("renders children and forwards DOM props", () => {
    const onScroll = jest.fn();
    render(
      <Page onScroll={onScroll}>
        <div>Account settings</div>
      </Page>,
    );

    const page = screen.getByTestId("Page");
    expect(page).toHaveTextContent("Account settings");

    fireEvent.scroll(page);
    expect(onScroll).toHaveBeenCalled();
  });

  it("applies layout modifiers and custom classes", () => {
    render(
      <Page fixed gap className="custom-page">
        <div>Layout shell</div>
      </Page>,
    );

    const page = screen.getByText("Layout shell").parentElement;
    expect(page).toHaveClass("fixed");
    expect(page).toHaveClass("gap");
    expect(page).toHaveClass("custom-page");
  });
});
