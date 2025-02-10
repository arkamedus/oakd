import React from "react";

import { DebugLayerProps } from "./DebugLayer.types";

import "./DebugLayer.css";
import Paragraph from "../Paragraph/Paragraph";
import { IconLayers } from "../../Icon/Icons.bin";

const DebugLayer: React.FC<DebugLayerProps> = ({
	label,
	children,
	style,
	className,
}) => {
	return (
		<span data-testid="DebugLayer" className="oakd debug-layer" style={style}>
			{label && (
				<Paragraph className={"label"}>
					<IconLayers size={"small"} />
					{label}
				</Paragraph>
			)}
			{children}
		</span>
	);
};

export default DebugLayer;
