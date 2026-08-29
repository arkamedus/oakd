import React from "react";
import { CoreContentProps } from "../../Core/Core.types";
export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";
export type ScrollbarMode = "native" | "hidden";
export interface ScrollAreaHandle {
	element: HTMLDivElement | null;
	scrollTo: (options: ScrollToOptions) => void;
	scrollToEnd: (behavior?: ScrollBehavior) => void;
}
export interface ScrollAreaProps extends Omit<
	CoreContentProps<HTMLDivElement>,
	"onScroll"
> {
	orientation?: ScrollAreaOrientation;
	scrollbar?: ScrollbarMode;
	stickToEnd?: boolean;
	endThreshold?: number;
	onReachEnd?: () => void;
	onScroll?: React.UIEventHandler<HTMLDivElement>;
}
