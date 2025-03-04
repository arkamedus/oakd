import React, { CSSProperties } from "react";

export type CorePaddingValueTypes = "both" | "horizontal" | "vertical";

export type CorePaddingType = number | CorePaddingValueTypes | boolean;

export const decode__padding = (padding: CorePaddingType): string => {
	const hasPadding = !!padding;
	if (!hasPadding) {
		return "";
	}

	if (typeof padding === "number") {
		return "pad";
	}

	if (typeof padding === "string") {
		return `pad-${padding}`;
	}

	return "pad";
};

export interface CoreComponentProps extends CoreComponentEventProps {
	id?: string;
	key?: React.Key;
	style?: CSSProperties;
	children?: React.ReactNode;
	className?: string;
	role?: string; // Added for accessibility
	"aria-label"?: string; // Added for accessibility
	tabIndex?: number; // Added for keyboard interactions
}

export interface CoreComponentEventProps {
	onClick?: (
		event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
	) => void;
	onMouseEnter?: (
		event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
	) => void;
	onMouseLeave?: (
		event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
	) => void;
	onFocus?: (
		event: React.FocusEvent<HTMLButtonElement | HTMLDivElement>,
	) => void;
	onBlur?: (
		event: React.FocusEvent<HTMLButtonElement | HTMLDivElement>,
	) => void;
	onKeyDown?: (
		event: React.KeyboardEvent<HTMLButtonElement | HTMLDivElement>,
	) => void;
	onKeyUp?: (
		event: React.KeyboardEvent<HTMLButtonElement | HTMLDivElement>,
	) => void;
}

export type ButtonType =
	| "default"
	| "primary"
	| "danger"
	| "warning"
	| "ghost"
	| "active"
	| "disabled";

export type CoreComponentSizeType = "default" | "small" | "large";
export type CoreComponentLayoutSizingType =
	| "default"
	| "wide"
	| "tall"
	| "full";

export type CoreComponentLayoutDirectionType =
	| "default"
	| "horizontal"
	| "vertical";

export type ComponentAlignType = "default" | "center" | "start" | "end";
export type ComponentJustifyType =
	| "default"
	| "center"
	| "start"
	| "end"
	| "stretch"
	| "around"
	| "between"
	| "evenly";

export interface CoreLayoutProps extends CoreComponentProps {
	gap?: number | boolean;
}

export interface CoreContentProps extends CoreComponentProps {
	wide?: boolean;
	pad?: CorePaddingType;
}

export interface CoreLayoutSizingProps {
	fill?: CoreComponentLayoutSizingType;
}
