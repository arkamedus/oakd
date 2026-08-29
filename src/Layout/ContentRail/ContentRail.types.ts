import { CoreContentProps } from "../../Core/Core.types";
export type ContentRailSize = "sm" | "md" | "lg" | "xl" | "full";
export interface ContentRailProps extends CoreContentProps<HTMLDivElement> {
	size?: ContentRailSize;
	gutter?: boolean;
}
