import React, { CSSProperties } from "react";

export interface CoreComponentProps {
	id?: string;
	key?: string;
	style?: CSSProperties;
	children?: React.ReactNode;
	className?: string;
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
