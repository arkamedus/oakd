import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./Pagination";
import { PaginationProps } from "./Pagination.types";

describe("Pagination Component", () => {
    let props: PaginationProps;

    beforeEach(() => {
        props = {
            maxPage: 100,
            currentPage: 1,
            onPageChange: jest.fn(),
            size: "default",
            showPreviousNext: true,
            showNumbers: true,
            showEllipsis: true,
        };
    });

    it("should render the Pagination component", () => {
        render(<Pagination {...props} />);
        expect(screen.getByTestId("PaginationLeft")).toBeInTheDocument();
    });

    it("should disable the component styles when disabled is true", () => {
        props.disabled = true;
        const { container } = render(<Pagination {...props} />);
        expect(container.querySelector(".disabled")).toBeInTheDocument();
    });

    it("should call onPageChange when clicking a page number", () => {
        render(<Pagination {...props} />);
        const page2 = screen.getByText("2");
        fireEvent.click(page2);
        expect(props.onPageChange).toHaveBeenCalledWith(2);
    });

    it("should correctly go to the previous page", () => {
        props.currentPage = 2;
        render(<Pagination {...props} />);
        const prevBtn = screen.getByTestId("PaginationLeft");
        fireEvent.click(prevBtn);
        expect(props.onPageChange).toHaveBeenCalledWith(1);
    });

    it("should correctly go to the next page", () => {
        props.currentPage = 1;
        render(<Pagination {...props} />);
        const nextBtn = screen.getByTestId("PaginationRight");
        fireEvent.click(nextBtn);
        expect(props.onPageChange).toHaveBeenCalledWith(2);
    });

    it("should not go to the previous page if on the first page", () => {
        props.currentPage = 1;
        render(<Pagination {...props} />);
        const prevBtn = screen.getByTestId("PaginationLeft");
        fireEvent.click(prevBtn);
        expect(props.onPageChange).not.toHaveBeenCalled();
    });

    it("should not go to the next page if on the last page", () => {
        props.currentPage = 100;
        render(<Pagination {...props} />);
        const nextBtn = screen.getByTestId("PaginationRight");
        fireEvent.click(nextBtn);
        expect(props.onPageChange).not.toHaveBeenCalled();
    });

});