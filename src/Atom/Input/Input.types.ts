import { CoreIconNameType } from "../../Icon/Icons.bin";
import { ButtonType, CoreComponentSizeType } from "../../Core/Core.types";
import React from "react";

export interface InputProps extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"size"
> {
	/** Displays an error state */
	error?: boolean;
	/** Specifies the visual style variant, matching button variants */
	variant?: ButtonType;
	/** Sets the size variations */
	size?: Exclude<CoreComponentSizeType, "huge">;
	/** Optional icon (either an oakd icon name or a JSX element) */
	icon?: CoreIconNameType | React.JSX.Element;
	grow?: boolean;
}
