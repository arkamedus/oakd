import {
	CoreComponentSizeType,
	CoreComponentProps,
} from "../../Core/Core.types";
import { CSSProperties } from "react";
import { CoreIconNameType } from "../../Icon/Icons.bin";

/**
 * Defines the possible button types.
 */
export type ButtonType =
	| "default"
	| "primary"
	| "danger"
	| "warning"
	| "ghost"
	| "disabled";

/**
 * Properties for the Button component.
 */
export interface ButtonProps extends CoreComponentProps {
	/** Content of the Button */
	children?: React.ReactNode;
	/** onClick event handler */
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	/** HTML button type */
	buttonType?: "button" | "submit" | "reset";
	/** Visual style type */
	type?: ButtonType;
	/** Size of the Button */
	size?: CoreComponentSizeType;
	/** Inline styles for the Button */
	style?: CSSProperties;
	/** Additional class names */
	className?: string;
	/** Optional icon (name or element) */
	icon?: CoreIconNameType | React.JSX.Element;
	/** Disable the Button */
	disabled?: boolean;
	/** ARIA role, defaults to 'button' */
	role?: string;
	/** Optional label to display alongside content */
	label?: string;
}
