import { CoreComponentSizeType, ButtonType } from "../../Core/Core.types";
import React from "react";
import { CoreIconNameType } from "../../Icon/Icons.bin";

export interface ButtonProps extends Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	"type"
> {
	/** Button content */
	children?: React.ReactNode;
	/** HTML button type */
	htmlType?: "button" | "submit" | "reset";
	/** Visual style variant */
	variant?: ButtonType;
	/** Size of the Button */
	size?: Exclude<CoreComponentSizeType, "huge">;
	/** Optional icon (name or renderable node) */
	icon?: CoreIconNameType | React.ReactNode;
}
