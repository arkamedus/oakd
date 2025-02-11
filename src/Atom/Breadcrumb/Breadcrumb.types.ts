export interface BreadcrumbItem extends Omit<any, "className"> {
	text: string | any;
}

export type BreadcrumbSeperatorType = "default" | "dot" | "slash" | "backslash";

export interface BreadcrumbProps {
	items?: BreadcrumbItem[];
	separator?: BreadcrumbSeperatorType;
	className?: string;
}
