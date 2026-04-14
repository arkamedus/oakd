import React from "react";

export type CodeAreaTokenRule = {
	/** CSS class applied to matched segments */
	className: string;
	/** RegExp used for matching (prefer global "g") */
	regex: RegExp;
};

export interface CodeAreaProps extends Omit<
	React.TextareaHTMLAttributes<HTMLTextAreaElement>,
	"size"
> {
	/** Controlled value */
	value?: string;
	/** Uncontrolled default value */
	defaultValue?: string;

	/** Placeholder text */
	placeholder?: string;

	/** Disabled state */
	disabled?: boolean;

	readOnly?: boolean;

	/** Visual style type (matches your button/input types) */
	codeType?: "default" | "primary" | "danger" | "warning" | "ghost";

	/** Size variants */
	size?: "small" | "default" | "large";

	/** Expand to fill available width */
	grow?: boolean;

	/** Show line numbers */
	lineNumbers?: boolean;

	/** Highlight the current caret line */
	highlightCurrentLine?: boolean;

	/**
	 * 1-based line numbers that should be marked as errors.
	 * (Example: [1, 3, 10])
	 */
	errorLines?: number[];

	/**
	 * Custom token rules for highlighting.
	 * If omitted, a simple JS default set is used.
	 */
	rules?: CodeAreaTokenRule[];

	/**
	 * Optional: provide your own way to compute the current line from the textarea state.
	 * If not provided, selectionStart is used.
	 */
	getCurrentLine?: (value: string, selectionStart: number) => number;

	/** Textarea events */
	//onChange?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
	//onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
	//onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
	//onKeyDown?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
	//onKeyUp?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
}
