import React from "react";
import { ButtonType, CoreComponentSizeType } from "../../Core/Core.types";
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: ButtonType;
	size?: Exclude<CoreComponentSizeType, "huge">;
	hidden?: boolean;
	label?: string;
	wide?: boolean;
}
