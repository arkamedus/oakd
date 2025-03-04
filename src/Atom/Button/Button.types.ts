import {
	CoreComponentSizeType,
	CoreComponentProps,
	CoreComponentEventProps, ButtonType,
} from "../../Core/Core.types";
import { CSSProperties } from "react";
import { CoreIconNameType } from "../../Icon/Icons.bin";

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
