import React from "react";
import { IconProps } from "./Icon.types";
import "./Icon.css";
import { _IconMap } from "./Icons.bin";

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

	// Decide whether we will recolor via CSS mask.
	// - For normal mapped icons: always recolor (existing behavior).
	// - For explicit `src`: recolor unless `preserveColor` is true.
	const shouldRecolor = src ? !preserveColor : true;

	// Base classes (keep existing sizing/inline/spin behavior)
	const baseClass =
		`oakd standardized-reset standardized-text icon icon-${size} ${className} ${spin ? "spin" : ""}`.trim();

	// Style when recoloring (mask + backgroundColor)
	const recolorStyle: React.CSSProperties = {
		...style,
		// The color is taken from style.color or falls back to currentColor
		backgroundColor: style?.color || "currentColor",
		mask: `url(${resolvedUrl}) no-repeat center/contain`,
		WebkitMask: `url(${resolvedUrl}) no-repeat center/contain`,
	};

	// Style when preserving original image colors (no mask, no recolor)
	const preserveColorStyle: React.CSSProperties = {
		...style,
		backgroundColor: "transparent",
		backgroundImage: `url(${resolvedUrl})`,
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center",
		backgroundSize: "contain",
		// Ensure no stale mask values linger if user passed them in
		mask: undefined,
		WebkitMask: undefined,
	};

	const iconElement = (
		<span
			data-testid="Icon"
			className={baseClass}
			style={shouldRecolor ? recolorStyle : preserveColorStyle}
			{...props}
		/>
	);

	return rotation !== 0 ? (
		<span
			style={{
				display: "inline-block",
				transform: `rotate(${rotation}deg)`,
				transformOrigin: "center",
			}}
		>
			{iconElement}
		</span>
	) : (
		iconElement
	);
};

export default Icon;

interface IconStackProps {
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

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
