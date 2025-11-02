import React from "react";
import { CoreLayoutProps } from "../../Core/Core.types";

export type DropdownDirection =
	| "bottom-left"
	| "bottom-right"
	| "top-left"
	| "top-right";

export interface DropdownProps extends CoreLayoutProps {
	children?: React.ReactNode;
	direction?: DropdownDirection;
	fixed?: boolean;
	label?: React.ReactNode | string;
	className?: string;
}
