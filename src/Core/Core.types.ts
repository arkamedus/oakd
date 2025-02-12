import React, { CSSProperties } from "react";

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
	onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
	onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
	onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
	onFocus?: (event: React.FocusEvent<HTMLButtonElement | HTMLDivElement>) => void;
	onBlur?: (event: React.FocusEvent<HTMLButtonElement | HTMLDivElement>) => void;
	onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement | HTMLDivElement>) => void;
	onKeyUp?: (event: React.KeyboardEvent<HTMLButtonElement | HTMLDivElement>) => void;
}


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
	pad?: number | boolean;
}

export interface CoreLayoutSizingProps {
	fill?: CoreComponentLayoutSizingType;
}
