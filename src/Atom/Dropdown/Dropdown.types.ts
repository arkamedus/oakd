import React from "react";
import { CoreLayoutProps } from "../../Core/Core.types";

export type DropdownDirection =
	| "bottom-left"
	| "bottom-right"
	| "top-left"
	| "top-right";

export interface DropdownProps extends CoreLayoutProps<HTMLDivElement> {
	children?: React.ReactNode;
	direction?: DropdownDirection;
	fixed?: boolean;
	grow?: boolean;
	label?: React.ReactNode;
	placementThreshold?: number;
	wide?: boolean;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	disabled?: boolean;
	closeOnSelect?: boolean;
}
