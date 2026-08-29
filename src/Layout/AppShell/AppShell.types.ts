import React from "react";
import { CoreContentProps } from "../../Core/Core.types";

export type SidebarMode = "expanded" | "collapsed" | "hidden";

export interface AppShellProps extends CoreContentProps<HTMLDivElement> {
	header?: React.ReactNode;
	sidebar?: React.ReactNode;
	footer?: React.ReactNode;
	sidebarMode?: SidebarMode;
	sidebarWidth?: number | string;
	collapsedSidebarWidth?: number | string;
}
