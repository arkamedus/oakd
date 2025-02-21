import {
	CoreComponentSizeType,
	CoreComponentProps,
	CoreComponentEventProps,
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
export interface ButtonProps
	extends CoreComponentProps,
		CoreComponentEventProps {
	/** HTML button type */
	buttonType?: "button" | "submit" | "reset";
	/** Visual style type */
	type?: ButtonType;
	/** Size of the Button */
	size?: CoreComponentSizeType;
	/** Inline styles for the Button */
	style?: CSSProperties;
	/** Optional icon (name or element) */
	icon?: CoreIconNameType | React.JSX.Element;
	/** Disable the Button */
	disabled?: boolean;
}
