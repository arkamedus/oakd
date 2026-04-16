import React from "react";

import { RowProps } from "./Row.types";

import "./Row.css";

const Row: React.FC<RowProps> = ({
	id,
	key,
	style,
	children,
	className,
	gap,
	wide,
	grow,
	fill,
	...rest
}) => {
	const classNames = ["oakd", "row"];
	if (gap) {
		classNames.push("gap");
	}
	if (wide) {
		classNames.push("wide");
	}
	if (grow) {
		classNames.push("grow");
	}
	if (fill) {
		classNames.push("fill");
	}
	if (className) {
		classNames.push(className);
	}
	return (
		<div
			{...rest}
			data-testid="Row"
			id={id}
			key={key}
			className={classNames.join(" ")}
			style={style}
		>
			{children}
		</div>
	);
};

export default Row;
