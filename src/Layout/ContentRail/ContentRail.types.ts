import { CoreContentProps, CoreComponentSizeType } from "../../Core/Core.types";
export type ContentRailSize = CoreComponentSizeType | "full";
export interface ContentRailProps extends CoreContentProps<HTMLDivElement> {
	size?: ContentRailSize;
	gutter?: boolean;
}
