import React from "react";
import { TitleProps } from "./Title.types";
import "./Title.css";

const Title: React.FC<TitleProps> = ({
	id,
	key,
	children,
	style,
	className,
}) => {
	let classNames = ["oakd", "standardized-reset", "standardized-text", "title"];

	if (className) classNames.push(className);

	return (
		<h1
			id={id}
			key={key}
			data-testid={"Title"}
			style={style}
			className={classNames.join(" ")}
		>
			{children}
		</h1>
	);
};

export default Title;
