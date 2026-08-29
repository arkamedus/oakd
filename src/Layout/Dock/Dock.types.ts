import { CoreContentProps } from "../../Core/Core.types";
export type DockPosition =
	| "top"
	| "bottom"
	| "left"
	| "right"
	| "top-left"
	| "top-right"
	| "bottom-left"
	| "bottom-right";
export interface DockProps extends CoreContentProps<HTMLDivElement> {
	position?: DockPosition;
	offset?: number | string;
}
