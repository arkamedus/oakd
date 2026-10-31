import React from "react";
import { CoreComponentSizeType } from "../../Core/Core.types";

export type DropdownDirection =
	| "bottom-left"
	| "bottom-right"
	| "top-left"
	| "top-right";

export interface DropdownProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Native props and ref for the trigger button; layout props stay on the container. */
	triggerProps?: Omit<React.ComponentPropsWithRef<"button">, "children">;
	children?: React.ReactNode;
	direction?: DropdownDirection;
	fixed?: boolean;
	grow?: boolean;
	label?: React.ReactNode;
	/** Size of the trigger button; popup content retains its own sizing. */
	size?: Exclude<CoreComponentSizeType, "huge">;
	placementThreshold?: number;
	wide?: boolean;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	disabled?: boolean;
	closeOnSelect?: boolean;
}
