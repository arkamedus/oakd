import React from "react";
import { ButtonType, CoreComponentSizeType } from "../../Core/Core.types";
export interface FileInputProps extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"type" | "size"
> {
	buttonLabel?: React.ReactNode;
	variant?: ButtonType;
	size?: Exclude<CoreComponentSizeType, "huge">;
}
