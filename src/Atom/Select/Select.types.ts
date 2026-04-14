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
	value: T;
	category?: string;
}

export interface SelectProps<T> extends CoreLayoutProps {
	options: SelectOption<T>[];
	value?: T;
	defaultValue?: T;
	placeholder?: React.ReactNode;
	onChange?: (value: T) => void;
	variant?: ButtonType;
	size?: Exclude<CoreComponentSizeType, "huge">;
	categoryOrder?: string[];
	fixed?: boolean;
	direction?: DropdownDirection;
	disabled?: boolean;
}
