import React from "react";
import { DropdownDirection } from "./Dropdown.types";

export interface DropdownPlacement {
	direction: DropdownDirection;
	style: React.CSSProperties;
}

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
	const vertical = centerY / Math.max(1, window.innerHeight) > placementThreshold
		? "top"
		: "bottom";
	const horizontal = centerX / Math.max(1, window.innerWidth) > placementThreshold
		? "right"
		: "left";
	return `${vertical}-${horizontal}` as DropdownDirection;
};

export const getAdaptiveDropdownPlacement = (
	element: HTMLElement,
	fallback: DropdownDirection,
	placementThreshold = 0.6,
): DropdownPlacement => {
	const direction = getAdaptiveDropdownDirection(element, fallback, placementThreshold);
	if (typeof window === "undefined") {
		return { direction, style: {} };
	}

	const rect = element.getBoundingClientRect();
	const rootStyle = window.getComputedStyle(document.documentElement);
	const leading = Number.parseFloat(rootStyle.getPropertyValue("--leading")) || 8;
	const vertical = direction.startsWith("top") ? "top" : "bottom";
	const horizontal = direction.endsWith("right") ? "right" : "left";

	return {
		direction,
		style: {
			"--oakd-dropdown-fixed-top": vertical === "bottom"
				? `${rect.bottom + leading}px`
				: "auto",
			"--oakd-dropdown-fixed-right": horizontal === "right"
				? `${window.innerWidth - rect.right}px`
				: "auto",
			"--oakd-dropdown-fixed-bottom": vertical === "top"
				? `${window.innerHeight - rect.top + leading}px`
				: "auto",
			"--oakd-dropdown-fixed-left": horizontal === "left"
				? `${rect.left}px`
				: "auto",
			"--oakd-dropdown-fixed-width": `${rect.width}px`,
		} as React.CSSProperties,
	};
};
