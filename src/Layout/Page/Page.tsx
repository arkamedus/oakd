import React from "react";
import "./Page.css";
import { PageProps } from "./Page.types";

const Page: React.FC<PageProps> = ({ children, fixed, gap, className }) => {
	const classes = ["oakd", "page", gap && "gap", fixed && "fixed", className]
		.filter(Boolean)
		.join(" ");
	return (
		<div data-testid="Page" className={classes}>
			{children}
		</div>
	);
};

export default Page;
