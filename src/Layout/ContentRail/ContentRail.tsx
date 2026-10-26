import React, { forwardRef } from "react";
import Content from "../Content/Content";
import "./ContentRail.css";
import { ContentRailProps } from "./ContentRail.types";

const ContentRail = forwardRef<HTMLDivElement, ContentRailProps>(
	({ size = "large", gutter = true, className, ...rest }, ref) => (
		<Content
			{...rest}
			ref={ref}
			className={[
				"oakd-content-rail",
				`oakd-content-rail--${size}`,
				gutter && "oakd-content-rail--gutter",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		/>
	),
);
ContentRail.displayName = "ContentRail";
export default ContentRail;
