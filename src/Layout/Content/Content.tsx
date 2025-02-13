import React from "react";
import "./Content.css";
import { ContentProps } from "./Content.types";
import {decode__padding} from "../../Core/Core.types";

const Content: React.FC<ContentProps> = ({ id, key, className, children, pad, grow, style }) => {
	const classes = ["oakd", "content", pad && decode__padding(pad), grow && "grow", className]
		.filter(Boolean)
		.join(" ");
	return (
		<div id={id} key={key} data-testid="Content" className={classes} style={style}>
			{children}
		</div>
	);
};

export default Content;

export const ContentRow: React.FC<ContentProps> = ({
	id, key,
	children,
	className,
	style ,
	pad ,
	grow
}) => {
	const classes = ["oakd", "content-row", pad && decode__padding(pad), grow && "grow", className]
		.filter(Boolean)
		.join(" ");	return (
		<div id={id} key={key} style={style} data-testid="ContentRow" className={classes}>
			{children}
		</div>
	);
};
