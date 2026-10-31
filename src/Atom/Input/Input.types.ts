import { CoreIconNameType } from "../../Icon/Icons.bin";
import { CoreComponentSizeType } from "../../Core/Core.types";
import React from "react";

export interface InputProps extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"size"
> {
	/** Displays an error state */
	error?: boolean;
	/** Sets the size variations */
	size?: Exclude<CoreComponentSizeType, "huge">;
	/** Optional icon (either an oakd icon name or a renderable node) */
	icon?: CoreIconNameType | React.ReactNode;
	grow?: boolean;
}
