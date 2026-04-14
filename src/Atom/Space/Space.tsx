import React from "react";

import { SpaceProps } from "./Space.types";

import "./Space.css";

const Space: React.FC<SpaceProps> = ({
	id,
	style,
	children,
	className,
	gap,
	direction,
	align,
	justify,
	wide,
	fill,
	grow,
	noWrap,
	onClick,
	...rest
}) => {
	let classNames = ["oakd", "space"];
	if (className) classNames.push(className);
	if (direction) classNames.push(`direction-${direction}`);
	if (align) classNames.push(`align-${align}`);
	if (justify) classNames.push(`justify-${justify}`);
	if (noWrap || direction === "vertical") classNames.push(`nowrap`);
	if (gap) {
		classNames.push("gap");
	}
	if (wide) {
		classNames.push("wide");
	}
	if (fill) {
		classNames.push("fill");
	}
	if (grow) {
		classNames.push("grow");
	}

	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (onClick) onClick(event);
	};

	return (
		<div
			{...rest}
			id={id}
			onClick={handleClick}
			data-testid="Space"
			style={style}
			className={classNames.join(" ")}
		>
			{children}
		</div>
	);
};

export default Space;
