import React from "react";
import { CoreComponentSizeType } from "../../Core/Core.types";
import { CoreIconNameType } from "../../Icon/Icons.bin";

export interface CheckboxProps extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"type" | "size"
> {
	label?: React.ReactNode;
	icon?: CoreIconNameType;
	size?: Exclude<CoreComponentSizeType, "huge">;
}
