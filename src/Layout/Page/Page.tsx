import React from "react";
import "./Page.css";
import { PageProps } from "./Page.types";

const Page: React.FC<PageProps> = ({
	id,
	key,
	children,
	style,
	fixed,
	fill,
	gap,
	className,
	onClick,
	...rest
}) => {
	const classes = [
		"oakd",
		"page",
		gap && "gap",
		fill && "fill",
		fixed && "fixed",
		className,
	]
		.filter(Boolean)
		.join(" ");
	return (
		<div
			{...rest}
			id={id}
			key={key}
			data-testid="Page"
			className={classes}
			style={style}
			onClick={onClick}
		>
			{children}
		</div>
	);
};

export default Page;
