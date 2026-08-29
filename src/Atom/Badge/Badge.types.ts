import React from "react";
import { ButtonType } from "../../Core/Core.types";
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: ButtonType;
	hidden?: boolean;
	label?: string;
	wide?: boolean;
}
