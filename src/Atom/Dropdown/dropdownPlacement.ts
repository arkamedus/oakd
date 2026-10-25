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

	const theme = window.getComputedStyle(element);
	const themeTokens: Record<string, string> = {};
	for (let index = 0; index < theme.length; index++) {
		const name = theme.item(index);
		if (name.startsWith("--oakd-")) themeTokens[name] = theme.getPropertyValue(name);
	}
	const rect = element.getBoundingClientRect();
	// Resolve lengths through layout so pt, rem, calc(), and scoped themes work.
	// A DOM probe is necessary here because custom-property values retain units.
	const probe = document.createElement("span");
	probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;padding:0;border:0;min-width:0;max-width:none;height:0;";
	probe.style.width = "var(--oakd-leading, 8px)";
	element.appendChild(probe);
	const resolved = window.getComputedStyle(probe).width;
	const measured = Number.parseFloat(resolved);
	const leading = resolved.endsWith("px") && Number.isFinite(measured)
		? Math.max(0, measured)
		: 8;
	probe.remove();
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
			...themeTokens,
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
