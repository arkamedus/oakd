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
});
