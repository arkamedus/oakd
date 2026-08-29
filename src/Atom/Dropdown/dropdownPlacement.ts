import React from "react";
import { DropdownDirection } from "./Dropdown.types";

export interface DropdownPlacement {
	direction: DropdownDirection;
	style: React.CSSProperties;
}

export const clampFloatingPosition = (
	x: number,
	y: number,
	width: number,
	height: number,
	gap = 8,
) => ({
	x: Math.min(Math.max(gap, x), Math.max(gap, window.innerWidth - width - gap)),
	y: Math.min(
		Math.max(gap, y),
		Math.max(gap, window.innerHeight - height - gap),
	),
});

export const getAdaptiveDropdownDirection = (
	element: HTMLElement,
	fallback: DropdownDirection,
	placementThreshold = 0.6,
): DropdownDirection => {
	if (typeof window === "undefined") {
		return fallback;
	}
	const rect = element.getBoundingClientRect();
	const centerX = rect.left + rect.width / 2;
	const centerY = rect.top + rect.height / 2;
	const vertical =
		centerY / Math.max(1, window.innerHeight) > placementThreshold
			? "top"
			: "bottom";
	const horizontal =
		centerX / Math.max(1, window.innerWidth) > placementThreshold
			? "right"
			: "left";
	return `${vertical}-${horizontal}` as DropdownDirection;
};

export const getAdaptiveDropdownPlacement = (
	element: HTMLElement,
	fallback: DropdownDirection,
	placementThreshold = 0.6,
): DropdownPlacement => {
	const direction = getAdaptiveDropdownDirection(
		element,
		fallback,
		placementThreshold,
	);
	if (typeof window === "undefined") {
		return { direction, style: {} };
	}

	const rect = element.getBoundingClientRect();
	const rootStyle = window.getComputedStyle(document.documentElement);
	const leading =
		Number.parseFloat(rootStyle.getPropertyValue("--leading")) || 8;
	const vertical = direction.startsWith("top") ? "top" : "bottom";
	const horizontal = direction.endsWith("right") ? "right" : "left";
	const clampedLeft = Math.min(
		Math.max(leading, rect.left),
		Math.max(leading, window.innerWidth - rect.width - leading),
	);
	const clampedRight = Math.min(
		Math.max(leading, window.innerWidth - rect.right),
		Math.max(leading, window.innerWidth - rect.width - leading),
	);
	const availableHeight = Math.max(
		0,
		vertical === "bottom"
			? window.innerHeight - rect.bottom - leading * 2
			: rect.top - leading * 2,
	);

	return {
		direction,
		style: {
			"--oakd-dropdown-fixed-top":
				vertical === "bottom" ? `${rect.bottom + leading}px` : "auto",
			"--oakd-dropdown-fixed-right":
				horizontal === "right" ? `${clampedRight}px` : "auto",
			"--oakd-dropdown-fixed-bottom":
				vertical === "top"
					? `${window.innerHeight - rect.top + leading}px`
					: "auto",
			"--oakd-dropdown-fixed-left":
				horizontal === "left" ? `${clampedLeft}px` : "auto",
			"--oakd-dropdown-fixed-width": `${rect.width}px`,
			"--oakd-dropdown-available-height": `${availableHeight}px`,
		} as React.CSSProperties,
	};
};
