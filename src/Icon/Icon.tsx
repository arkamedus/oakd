import React from "react";
import { IconProps } from "./Icon.types";
import "./Icon.css";
import { IconMap } from "./Icons.bin";

const Icon: React.FC<IconProps> = ({
	name,
	style,
	size = "default",
	className = "",
	spin = false,
	rotation = 0,
	...props
}) => {
	const IconSrc = IconMap[name];

	if (!IconSrc) {
		console.warn(`Icon "${name}" not found.`);
		return null;
	}

	// Determine the URL from the imported icon asset
	// @ts-ignore
	const iconUrl = typeof IconSrc === "string" ? IconSrc : IconSrc.default || IconSrc;

	const iconStyle = {
		...style,
		backgroundColor: style?.color || "currentColor",
		mask: `url(${iconUrl}) no-repeat center/contain`,
		WebkitMask: `url(${iconUrl}) no-repeat center/contain`,
	};

	const iconElement = (
		<span
			data-testid="Icon"
			className={`oakd standardized-reset standardized-text icon icon-${size} ${className} ${spin ? "spin" : ""}`}
			style={iconStyle}
			{...props}
		/>
	);

	return rotation !== 0 ? (
		<span style={{ display: "inline-block", transform: `rotate(${rotation}deg)`, transformOrigin: "center" }}>
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
