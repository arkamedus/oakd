import React from "react";

import { SpaceProps } from "./Space.types";

import "./Space.css";

const Space: React.FC<SpaceProps> = ({
	id, key,
	style,
	children,
	className,
	gap,
	direction,
	align,
	justify,
	wide,
	noWrap,
	onClick
}) => {
	let classNames = ["oakd", "space"];
	if (className) classNames.push(className);
	if (direction) classNames.push(`direction-${direction}`);
	if (align) classNames.push(`align-${align}`);
	if (justify) classNames.push(`justify-${justify}`);
	if (noWrap) classNames.push(`nowrap`);
	if (gap) {
		classNames.push("gap");
	}
	if (wide) {
		classNames.push("wide");
	}

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (onClick) onClick(event);
	};

	return (
		<span id={id} key={key} onClick={handleClick} data-testid="Space" style={style} className={classNames.join(" ")}>
			{children}
		</span>
	);
};

export default Space;
