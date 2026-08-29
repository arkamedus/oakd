import React from "react";
import { ButtonType } from "../../Core/Core.types";
import { CoreIconNameType } from "../../Icon/Icons.bin";

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: Exclude<ButtonType, "active">;
	size?: "sm" | "md" | "lg";
	icon?: CoreIconNameType | React.ReactNode;
	wide?: boolean;
}
