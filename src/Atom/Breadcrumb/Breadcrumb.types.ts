import React from "react";
import { CoreComponentProps } from "../../Core/Core.types";

export interface BreadcrumbItem {
	text: React.ReactNode;
	href?: string;
	className?: string;
}

export type BreadcrumbSeparatorType = "default" | "dot" | "slash" | "backslash";

export interface BreadcrumbProps extends CoreComponentProps<HTMLElement> {
	items: BreadcrumbItem[];
	separator?: BreadcrumbSeparatorType;
	className?: string;
}
