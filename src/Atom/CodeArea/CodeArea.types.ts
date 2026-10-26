import React from "react";
import { CoreComponentSizeType } from "../../Core/Core.types";

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

	/** Size variants */
	size?: Exclude<CoreComponentSizeType, "huge">;

	/** Expand to fill available width */
	grow?: boolean;

	/** Fill the available height of the parent host */
	fill?: boolean;

	/** Show line numbers */
	lineNumbers?: boolean;

	/** Highlight the current caret line */
	highlightCurrentLine?: boolean;

	/**
	 * 1-based line numbers that should be marked as errors.
	 * (Example: [1, 3, 10])
	 */
	errorLines?: number[];

	/** Syntax language; defaults to javascript. Empty or unknown names render plain text. */
	language?: string;

	/** Custom token rules override the language. An empty array disables coloring. */
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
