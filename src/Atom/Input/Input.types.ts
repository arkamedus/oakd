import { CoreIconNameType } from "../../Icon/Icons.bin";

export interface InputProps {
	type?: "text" | "password" | "email" | "number";
	value?: string;
	defaultValue?: string|number;
	placeholder?: string;
	error?: boolean;
	disabled?: boolean;
	inputType?: string;
	size?: "small" | "default" | "large";
	icon?: CoreIconNameType | React.JSX.Element; // Optional icon
	className?: string;
	style?: React.CSSProperties;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
	onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}
