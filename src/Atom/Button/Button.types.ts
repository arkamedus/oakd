import { CoreComponentSizeType, ButtonType } from "../../Core/Core.types";
import React from "react";
import { CoreIconNameType } from "../../Icon/Icons.bin";

export interface ButtonProps extends Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	"type"
> {
	/** HTML button type */
	htmlType?: "button" | "submit" | "reset";
	/** Visual style variant */
	variant?: ButtonType;
	/** Size of the Button */
	size?: Exclude<CoreComponentSizeType, "huge">;
	/** Optional icon (name or element) */
	icon?: CoreIconNameType | React.JSX.Element;
}
