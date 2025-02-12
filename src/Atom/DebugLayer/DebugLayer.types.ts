import { CoreComponentProps } from "../../Core/Core.types";
import React from "react";

/**
 * Props for the DebugLayer component
 */
export interface DebugLayerProps extends CoreComponentProps {
	/**
	 * Optional label text to display on the debug overlay
	 */
	label?: string | React.ReactNode;
	extra?: string | React.ReactNode;
}
