import React from "react";
import { ButtonType } from "../Button/Button.types";

export interface SelectOption<T> {
	element: React.ReactNode;
	value: T;
	category?: string; // Optional category for sorting
}

export interface SelectProps<T> {
	options: SelectOption<T>[];
	defaultValue?: T;
	placeholder?: React.ReactNode | string;
	onSelected: (value: T) => void;
	type?: ButtonType;
	categorize?: {
		property: string;
		order?: string[];
	};
}
