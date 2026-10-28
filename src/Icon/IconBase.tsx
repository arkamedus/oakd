import React from "react";
import { IconProps } from "./Icon.types";

const IconBase: React.FC<IconProps> = ({
	name: _name,
	style,
	size = "default",
	className = "",
	spin = false,
	rotation = 0,
	src,
	preserveColor = false,
	...props
}) => {
	const resolvedSrc =
		typeof src === "string"
			? src
			: (src as unknown as { default?: string })?.default || String(src || "");
	if (!resolvedSrc?.trim()) return null;
	const shouldRecolor = !preserveColor;
	const imageUrl = `url(${JSON.stringify(resolvedSrc)})`;
	const baseClass =
		`oakd standardized-reset standardized-text icon icon-${size} ${className} ${spin ? "spin" : ""}`.trim();
	const recolorStyle: React.CSSProperties = {
		...style,
		backgroundColor: style?.color || "currentColor",
		mask: `${imageUrl} no-repeat center/contain`,
		WebkitMask: `${imageUrl} no-repeat center/contain`,
	};
	const preserveColorStyle: React.CSSProperties = {
		...style,
		backgroundColor: "transparent",
		backgroundImage: imageUrl,
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center",
		backgroundSize: "contain",
		mask: undefined,
		WebkitMask: undefined,
	};
	const icon = (
		<span
			data-testid="Icon"
			className={baseClass}
			style={shouldRecolor ? recolorStyle : preserveColorStyle}
			{...props}
		/>
	);
	return rotation ? (
		<span
			style={{
				display: "inline-block",
				transform: `rotate(${rotation}deg)`,
				transformOrigin: "center",
			}}
		>
			{icon}
		</span>
	) : (
		icon
	);
};

export default IconBase;
