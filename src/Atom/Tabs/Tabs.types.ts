import { CoreComponentProps } from "../../Core/Core.types";

export interface TabsProps extends CoreComponentProps {
	/**
	 * The active key of the tab. If provided, it makes the component controlled.
	 */
	activeKey?: string;
	/**
	 * The default active key of the tab. Only used when the component is uncontrolled.
	 */
	defaultActiveKey?: string;
	/**
	 * Callback function called when the active tab changes.
	 */
	onChange?: (key: string) => void;
	/**
	 * The orientation of the Tabs. Can be "horizontal" or "vertical".
	 */
	orientation?: "horizontal" | "vertical";
}
