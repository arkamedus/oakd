import { CoreIconNameType } from "../../Icon/Icons.bin";

export interface InputProps {
	/** The type of the input element */
	type?: "text" | "password" | "email" | "number";
	/** The controlled value of the input */
	value?: string;
	/** The default value for uncontrolled usage */
	defaultValue?: string | number;
	/** Placeholder text for the input */
	placeholder?: string;
	/** Displays an error state */
	error?: boolean;
	/** Disables the input element */
	disabled?: boolean;
	/** Specifies the visual style type, matching button types */
	inputType?: string;
	/** Sets the size variations */
	size?: "small" | "default" | "large";
	/** Optional icon (either an oakd icon name or a JSX element) */
	icon?: CoreIconNameType | React.JSX.Element;
	/** Additional class names */
	className?: string;
	/** Inline styles */
	style?: React.CSSProperties;
	/** OnChange event handler */
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	/** OnBlur event handler */
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** OnFocus event handler */
	onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}
