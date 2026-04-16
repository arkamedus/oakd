import React from "react";
import "./Content.css";
import { ContentProps } from "./Content.types";
import { decode__padding } from "../../Core/Core.types";

const Content = React.forwardRef<HTMLDivElement, ContentProps>(
	({ id, className, children, pad, grow, fill, wide, style, ...rest }, ref) => {
		const dataTestId = (rest as Record<string, unknown>)["data-testid"] as
			| string
			| undefined;
		const classes = [
			"oakd",
			"content",
			pad && decode__padding(pad),
			grow && "grow",
			fill && "fill",
			wide && "wide",
			className,
		]
			.filter(Boolean)
			.join(" ");
		return (
			<div
				{...rest}
				ref={ref}
				id={id}
				data-testid={dataTestId || "Content"}
				className={classes}
				style={style}
			>
				{children}
			</div>
		);
	},
);

Content.displayName = "Content";

export default Content;

export const ContentRow = React.forwardRef<HTMLDivElement, ContentProps>(
	({ id, children, className, style, pad, grow, fill, wide, ...rest }, ref) => {
		const dataTestId = (rest as Record<string, unknown>)["data-testid"] as
			| string
			| undefined;
		const classes = [
			"oakd",
			"content-row",
			pad && decode__padding(pad),
			grow && "grow",
			fill && "fill",
			wide && "wide",
			className,
		]
			.filter(Boolean)
			.join(" ");
		return (
			<div
				{...rest}
				ref={ref}
				id={id}
				style={style}
				data-testid={dataTestId || "ContentRow"}
				className={classes}
			>
				{children}
			</div>
		);
	},
);

ContentRow.displayName = "ContentRow";
