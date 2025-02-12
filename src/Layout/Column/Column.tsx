import React from "react";

import { ColumnProps } from "./Column.types";

import "./Column.css";

export const Col: React.FC<ColumnProps> = ({
	id,
	children,
	onMouseEnter,
	style,
	xs,
	sm,
	md,
	lg,
	xl,
	xls,
	className,
	key,
}) => {
	let classNames = ["oakd", "column"];
	if (xs) classNames.push(`xs-${xs}`);
	if (sm) classNames.push(`sm-${sm}`);
	if (md) classNames.push(`md-${md}`);
	if (lg) classNames.push(`lg-${lg}`);
	if (xl) classNames.push(`xl-${xl}`);
	if (xls) classNames.push(`xls-${xls}`);
	if (className) classNames.push(className);

	return (
		<div
			id={id}
			key={key}
			data-testid="Column"
			className={classNames.join(" ")}
			style={style}
			onMouseEnter={onMouseEnter}
		>
			{children}
		</div>
	);
};

export default Col;
