import React from "react";
import { PaginationProps } from "./Pagination.types";
import Icon from "../../Icon/Icon";
import "./Pagination.css";
import Button from "../Button/Button";
import Space from "../Space/Space";

const range = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const Pagination: React.FC<PaginationProps> = ({
    maxPage = 100,
    currentPage = 1,
    onPageChange,
    size = "default",
    disabled,
    showPreviousNext = true,
    showNumbers = true,
    showEllipsis = true,
}) => {

    const handlePageChange = (page: number) => {
        if (onPageChange && page !== currentPage) {
            onPageChange(page);
        }
    };

    const numbersToShow = showNumbers && maxPage <= 10
        ? range(1, maxPage)
        : showNumbers
        ? range(1, maxPage).filter((n) => n >= currentPage - 1 && n <= currentPage + 1)
        : [];

    return (
        <Space className={`oakd pagination size-${size} ${disabled ? "disabled" : ""}`} gap>
            {showPreviousNext && (
                <Icon
                    name="Triangle"
                    className="arrow left"
                    data-testid="PaginationLeft"
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    title="Previous Page"
                    role="button"
                    aria-label="Previous Page"
                />
            )}
            {showEllipsis && maxPage > 4 && !numbersToShow.includes(maxPage - 2) && <span className="dot">...</span>}
            {numbersToShow.map((number) => (
                <Button
                    key={`pagination-number-${number}`}
                    className={`pagination-button ${currentPage === number ? "current" : ""}`}
                    onClick={() => handlePageChange(number)}
                    disabled={disabled}
                >
                    {number}
                </Button>
            ))}
            {showEllipsis && maxPage > 3 && !numbersToShow.includes(3) && <span className="dot">...</span>}
            {showPreviousNext && (
                <Icon
                    name="Triangle"
                    className="arrow right"
                    data-testid="PaginationRight"
                    onClick={() => currentPage < maxPage && handlePageChange(currentPage + 1)}
                    title="Next Page"
                    role="button"
                    aria-label="Next Page"
                />
            )}
        </Space>
    );
};

export default Pagination;