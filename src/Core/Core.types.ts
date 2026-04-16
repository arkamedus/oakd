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

export interface CoreComponentEventProps<T = HTMLElement> extends Omit<
	React.HTMLAttributes<T>,
	"children" | "className" | "style" | "onChange"
> {}

export interface CoreComponentProps<T = HTMLElement> extends Omit<
	React.HTMLAttributes<T>,
	"children" | "className" | "style" | "onChange"
> {
	id?: string;
	key?: React.Key;
	style?: CSSProperties;
	children?: React.ReactNode;
	className?: string;
	ref?: React.Ref<T>;
}

export type ButtonType =
	| "default"
	| "primary"
	| "danger"
	| "warning"
	| "ghost"
	| "active"
	| "disabled";

export type CoreComponentSizeType = "default" | "small" | "large" | "huge";
export type CoreComponentLayoutSizingType =
	| "default"
	| "wide"
	| "tall"
	| "full";

export type CoreComponentLayoutDirectionType =
	| "default"
	| "horizontal"
	| "vertical";

export type ComponentAlignType =
	| "default"
	| "normal"
	| "center"
	| "start"
	| "end"
	| "stretch";
export type ComponentJustifyType =
	| "default"
	| "center"
	| "start"
	| "end"
	| "stretch"
	| "around"
	| "between"
	| "evenly";

export interface CoreLayoutProps<
	T = HTMLElement,
> extends CoreComponentProps<T> {
	gap?: number | boolean;
}

export interface CoreContentProps<
	T = HTMLElement,
> extends CoreComponentProps<T> {
	wide?: boolean;
	grow?: boolean;
	fill?: boolean;
	pad?: CorePaddingType;
}

export interface CoreLayoutSizingProps {
	fill?: CoreComponentLayoutSizingType;
}
