import { CoreComponentProps } from "../../Core/Core.types";

/**
 * Props for the Divider component.
 */
export interface DividerProps extends CoreComponentProps<HTMLDivElement> {
	/**
	 * The orientation of the divider (horizontal or vertical).
	 * @default "horizontal"
	 */
	orientation?: "horizontal" | "vertical";

	/**
	 * Additional class names to apply to the divider.
	 */
	className?: string;
}
