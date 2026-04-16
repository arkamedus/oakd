import React from "react";
import { CoreLayoutProps } from "../../Core/Core.types";

export interface ContextMenuProps extends Omit<
	CoreLayoutProps<HTMLDivElement>,
	"content"
> {
	children: React.ReactNode;
	content: React.ReactNode;
	disabled?: boolean;
	offset?: number;
	onOpenChange?: (open: boolean) => void;
}
