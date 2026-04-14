import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Pagination from "./Pagination";
import { PaginationProps } from "./Pagination.types";

describe("Pagination Component", () => {
  let props: PaginationProps;

  beforeEach(() => {
    props = {
      maxPage: 100,
      currentPage: 10,
      onPageChange: jest.fn(),
      count: 5,
      size: "default",
      showPreviousNext: true,
      showNumbers: true,
      showEllipsis: true,
    };
  });

  it("changes to a selected page number", () => {
    render(<Pagination {...props} />);

    fireEvent.click(screen.getByText("11"));
    expect(props.onPageChange).toHaveBeenCalledWith(11);
  });

  it("supports previous and next navigation within range", () => {
    const { rerender } = render(<Pagination {...props} />);

    fireEvent.click(screen.getByTestId("PaginationLeft"));
    expect(props.onPageChange).toHaveBeenCalledWith(9);

    props.currentPage = 11;
    rerender(<Pagination {...props} />);
    fireEvent.click(screen.getByTestId("PaginationRight"));
    expect(props.onPageChange).toHaveBeenCalledWith(12);
  });

  it("prevents navigation past the first or last page", () => {
    const { rerender } = render(<Pagination {...props} currentPage={1} />);
    fireEvent.click(screen.getByTestId("PaginationLeft"));

    rerender(<Pagination {...props} currentPage={100} />);
    fireEvent.click(screen.getByTestId("PaginationRight"));

    expect(props.onPageChange).not.toHaveBeenCalled();
  });

  it("renders a centered page window with ellipses when showNumbers is enabled", () => {
    render(<Pagination {...props} currentPage={10} maxPage={20} count={5} />);

    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getAllByText("...")).toHaveLength(2);
  });

  it("keeps the page window at the start and end boundaries", () => {
    const { rerender } = render(
      <Pagination {...props} currentPage={1} maxPage={20} count={5} />,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.queryByText("6")).not.toBeInTheDocument();
    expect(screen.getAllByText("...")).toHaveLength(1);

    rerender(<Pagination {...props} currentPage={20} maxPage={20} count={5} />);

    expect(screen.getByText("16")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.queryByText("15")).not.toBeInTheDocument();
    expect(screen.getAllByText("...")).toHaveLength(1);
  });

  it("shows all pages and no ellipses when maxPage is within count", () => {
    render(<Pagination {...props} currentPage={3} maxPage={5} count={5} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.queryByText("...")).not.toBeInTheDocument();
  });

  it("uses the active button variant for the current page", () => {
    render(<Pagination {...props} currentPage={10} maxPage={20} count={5} />);

    expect(screen.getByRole("button", { name: "10" })).toHaveClass(
      "type-active",
    );
  });
});
