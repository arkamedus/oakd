import React from "react";
import { DividerProps } from "./Divider.types";
import "./Divider.css";

const Divider: React.FC<DividerProps> = ({
	orientation = "horizontal",
	className = "",
	...rest
}) => {
	const dividerClass = `oakd divider ${orientation} ${className}`.trim();
	return (
		<div
			{...rest}
			data-testid="Divider"
			className={dividerClass}
			role="separator"
			aria-orientation={orientation}
		/>
	);
};

export default Divider;
