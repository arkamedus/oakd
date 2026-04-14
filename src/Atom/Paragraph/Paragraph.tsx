import React from "react";

import { ParagraphProps } from "./Paragraph.types";

import "./Paragraph.css";

const Paragraph: React.FC<ParagraphProps> = ({
	style,
	children,
	className,
	...rest
}) => {
	let classNames = [
		"oakd",
		"standardized-reset",
		"standardized-text",
		"paragraph",
	];
	if (className) classNames.push(className);

	return (
		<p
			{...rest}
			data-testid={"Paragraph"}
			style={{ flexShrink: 0, minWidth: 0, ...style }}
			className={classNames.join(" ")}
		>
			{children}
		</p>
	);
};

export default Paragraph;
