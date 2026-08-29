import React from "react";
import {
	ButtonType,
	CoreComponentSizeType,
	CoreLayoutProps,
} from "../../Core/Core.types";
export type DropdownDirection =
	| "bottom-left"
	| "bottom-right"
	| "top-left"
	| "top-right";

export interface SelectOption<T> {
	element: React.ReactNode;
	label?: React.ReactNode;
	value: T;
	category?: string;
	disabled?: boolean;
}

export interface SelectProps<T> extends Omit<
	CoreLayoutProps<HTMLDivElement>,
	"defaultValue"
> {
	options: SelectOption<T>[];
	value?: T;
	defaultValue?: T;
	placeholder?: React.ReactNode;
	onChange?: (value: T) => void;
	variant?: ButtonType;
	size?: Exclude<CoreComponentSizeType, "huge">;
	categoryOrder?: string[];
	fixed?: boolean;
	grow?: boolean;
	direction?: DropdownDirection;
	disabled?: boolean;
	placementThreshold?: number;
	wide?: boolean;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	emptyContent?: React.ReactNode;
}
