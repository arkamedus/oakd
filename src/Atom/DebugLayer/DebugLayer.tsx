import React from "react";
import {DebugLayerProps} from "./DebugLayer.types";
import "./DebugLayer.css";
import Paragraph from "../Paragraph/Paragraph";
import {IconLayers} from "../../Icon/Icons.bin";
import Space from "../Space/Space";

/**
 * DebugLayer Component
 *
 * Provides a visual debug overlay with a dashed border and an optional label for debugging layouts.
 * Useful during development to inspect component boundaries and verify spacing.
 *
 * @param {DebugLayerProps} props - Properties for the DebugLayer component
 * @returns {JSX.Element} Rendered DebugLayer component
 */
const DebugLayer: React.FC<DebugLayerProps> = ({
												   label,
												   children,
												   style,
												   className = "",
												   extra
											   }) => {
	const classes = ["oakd", "debug-layer", className].filter(Boolean).join(" ");
	return (
		<span data-testid="DebugLayer" className={classes} style={style}>
			<Space justify={"between"} className={"header"} wide>
			<span className="label">
				{label && typeof label == "string" ? (
					<Paragraph>
					<IconLayers size="small"/>
						{label}
				</Paragraph>
				) : label}
				</span>
				{extra}
		</Space>
			{children}
		</span>
	);
};

export default DebugLayer;
