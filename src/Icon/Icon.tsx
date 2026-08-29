import React from "react";
import { IconProps } from "./Icon.types";
import "./Icon.css";
import { _IconMap } from "./Icons.bin";
import IconBase from "./IconBase";

const Icon: React.FC<IconProps> = ({
	name,
	style,
	size = "default",
	className = "",
	spin = false,
	rotation = 0,
	src,
	preserveColor = false,
	...props
}) => {
	// Resolve asset from map unless an explicit `src` is provided
	const IconSrc = src ? undefined : _IconMap[name];

	if (!src && !IconSrc) {
		console.warn(`Icon "${name}" not found.`);
		return null;
	}

	// Determine the URL from either the provided `src` or the imported icon asset
	const mapUrl =
		// @ts-ignore - accommodate bundlers that default-export url strings
		typeof IconSrc === "string" ? IconSrc : IconSrc?.default || IconSrc;

	const resolvedUrl = (src && src.trim()) || mapUrl;

	if (!resolvedUrl) {
		console.warn(`Icon "${name}" is missing a valid URL.`);
		return null;
	}

	return (
		<IconBase
			{...props}
			name={name}
			src={resolvedUrl}
			style={style}
			size={size}
			className={className}
			spin={spin}
			rotation={rotation}
			preserveColor={src ? preserveColor : false}
		/>
	);
};

export default Icon;

import type { IconStackProps } from "./Icon.types";

export const IconStack: React.FC<IconStackProps> = ({
	children,
	className = "",
	style,
}) => {
	return (
		<span
			data-testid="IconStack"
			className={`oakd oakd-icon-stack ${className}`}
			style={style}
		>
			{React.Children.map(children, (child) => (
				<span className="oakd-icon-stack__item">{child}</span>
			))}
		</span>
	);
};
