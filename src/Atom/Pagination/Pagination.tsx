import React from "react";
import { PaginationProps } from "./Pagination.types";
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
	className = "",
}) => {
	const handlePageChange = (page: number) => {
		if (onPageChange && page !== currentPage) {
			onPageChange(page);
		}
	};

	const numbersToShow =
		showNumbers && maxPage <= 10
			? range(1, maxPage)
			: showNumbers
				? range(1, maxPage).filter(
						(n) => n >= currentPage - 1 && n <= currentPage + 1,
					)
				: [];

	return (
		<Space
			className={`oakd pagination size-${size} ${disabled ? "disabled" : ""} ${className}`.trim()}
			gap
			data-testid="Pagination"
		>
			{showPreviousNext && (
				<Button
					htmlType="button"
					variant="ghost"
					size={size}
					icon="Angle"
					style={{ transform: "rotate(180deg)" }}
					className="arrow left pagination-arrow"
					data-testid="PaginationLeft"
					onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
					aria-label="Previous Page"
					disabled={disabled || currentPage <= 1}
				/>
			)}
			{showEllipsis && maxPage > 4 && !numbersToShow.includes(maxPage - 2) && (
				<span className="dot">...</span>
			)}
			{numbersToShow.map((number) => (
				<Button
					size={size}
					key={`pagination-number-${number}`}
					className={`pagination-button ${currentPage === number ? "current" : ""}`}
					onClick={() => handlePageChange(number)}
					disabled={disabled}
				>
					{number}
				</Button>
			))}
			{showEllipsis && maxPage > 3 && !numbersToShow.includes(3) && (
				<span className="dot">...</span>
			)}
			{showPreviousNext && (
				<Button
					htmlType="button"
					variant="ghost"
					size={size}
					icon="Angle"
					className="arrow right pagination-arrow"
					data-testid="PaginationRight"
					onClick={() =>
						currentPage < maxPage && handlePageChange(currentPage + 1)
					}
					aria-label="Next Page"
					disabled={disabled || currentPage >= maxPage}
				/>
			)}
		</Space>
	);
};

export default Pagination;
