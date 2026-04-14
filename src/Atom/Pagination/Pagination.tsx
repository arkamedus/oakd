import React from "react";
import { PaginationProps } from "./Pagination.types";
import "./Pagination.css";
import Button from "../Button/Button";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";

const range = (start: number, end: number) => {
	return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const Pagination: React.FC<PaginationProps> = ({
	maxPage = 100,
	currentPage = 1,
	onPageChange,
	count = 5,
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

	const visibleCount = Math.max(1, Math.min(count, maxPage));
	const halfWindow = Math.floor(visibleCount / 2);
	const startPage = Math.min(
		Math.max(1, currentPage - halfWindow),
		Math.max(1, maxPage - visibleCount + 1),
	);
	const endPage = Math.min(maxPage, startPage + visibleCount - 1);
	const numbersToShow = showNumbers ? range(startPage, endPage) : [];
	const showLeadingEllipsis =
		showNumbers && showEllipsis && numbersToShow.length > 0 && startPage > 1;
	const showTrailingEllipsis =
		showNumbers &&
		showEllipsis &&
		numbersToShow.length > 0 &&
		endPage < maxPage;

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
			{showLeadingEllipsis && <Paragraph className="dot">...</Paragraph>}
			{numbersToShow.map((number) => (
				<Button
					htmlType="button"
					variant={currentPage === number ? "active" : "ghost"}
					size={size}
					key={`pagination-number-${number}`}
					className={`pagination-button ${currentPage === number ? "current" : ""}`}
					onClick={() => handlePageChange(number)}
					disabled={disabled}
				>
					{number}
				</Button>
			))}
			{showTrailingEllipsis && <Paragraph className="dot">...</Paragraph>}
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
