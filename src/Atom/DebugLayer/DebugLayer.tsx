import React from "react";

import { DebugLayerProps } from "./DebugLayer.types";

import "./DebugLayer.css";
import Paragraph from "../Paragraph/Paragraph";
import {IconLayers} from "../../Icon/Icons.bin";

const DebugLayer: React.FC<DebugLayerProps> = ({
	label,
	children,
	style,
	className,
}) => {
	const classNames = [
		"oakd",
		"debug-layer",
		className
	].join(" ").trim();
	return (
		<span data-testid="DebugLayer" className={classNames} style={style}>
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
