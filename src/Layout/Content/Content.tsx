import React from "react";
import "./Content.css";
import { ContentProps } from "./Content.types";

const Content: React.FC<ContentProps> = ({ children, pad, grow }) => {
	const classes = ["oakd", "content", pad && "pad", grow && "grow"]
		.filter(Boolean)
		.join(" ");
	return (
		<div data-testid="Content" className={classes}>
			{children}
		</div>
	);
};

export default Content;

export interface ContentRowProps {
	children: React.ReactNode;
	className?: string;
}

export const ContentRow: React.FC<ContentRowProps> = ({
	children,
	className,
}) => {
	const classes = ["oakd", "content-row", className].filter(Boolean).join(" ");
	return (
		<div data-testid="ContentRow" className={classes}>
			{children}
		</div>
	);
};
