import React from "react";
import { CoreContentProps } from "../../Core/Core.types";
import { DropdownDirection } from "../Dropdown/Dropdown.types";

export type TooltipInteraction = "hover" | "click";
export type TooltipDirection =
	| DropdownDirection
	| "top"
	| "right"
	| "bottom"
	| "left";

export interface TooltipProps extends Omit<
	CoreContentProps<HTMLDivElement>,
	"children" | "content"
> {
	/** The on-page element that anchors and triggers the popup. */
	children: React.ReactNode;
	/** Custom OakD content rendered inside the popup Card. */
	content: React.ReactNode;
	/** Opens from pointer/focus interaction or a deliberate click. */
	interaction?: TooltipInteraction;
	direction?: TooltipDirection;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	disabled?: boolean;
	/** Applies the standard Card padding to the popup surface. */
	pad?: boolean;
}
