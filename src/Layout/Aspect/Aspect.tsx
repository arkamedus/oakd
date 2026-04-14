import React from "react";
import { AspectProps } from "./Aspect.types";
import "./Aspect.css";

const Aspect: React.FC<AspectProps> = ({
	id,
	key,
	ratio = "16x9",
	children,
	className = "",
	style,
	...rest
}) => {
	const classNames = `oakd aspect aspect-${ratio} ${className}`.trim();

	return (
		<div
			{...rest}
			id={id}
			key={key}
			data-testid="Aspect"
			className={classNames}
			style={style}
		>
			<div className="aspect-content">{children}</div>
		</div>
	);
};

export default Aspect;
