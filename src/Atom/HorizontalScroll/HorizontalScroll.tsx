import React from "react";
import { decode__padding } from "../../Core/Core.types";
import { HorizontalScrollProps } from "./HorizontalScroll.types";
import "./HorizontalScroll.css";
import Content from "../../Layout/Content/Content";
import Space from "../Space/Space";

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
	children,
	className = "",
	style,
	gap,
	pad,
	itemWidth,
	align = "stretch",
	wide,
	...rest
}) => {
	const items = React.Children.toArray(children);

	return (
		<Content
			{...rest}
			data-testid="HorizontalScroll"
			className={[
				"oakd",
				"horizontal-scroll",
				pad ? decode__padding(pad) : "",
				wide ? "wide" : "",
				className,
			]
				.filter(Boolean)
				.join(" ")}
			style={style}
			wide={wide}
		>
			<Space
				className={[
					"horizontal-scroll__track",
					gap ? "gap" : "",
					align ? `align-${align}` : "",
				]
					.filter(Boolean)
					.join(" ")}
				noWrap
			>
				{items.map((child, index) => (
					<Content
						key={index}
						className="horizontal-scroll__item"
						style={itemWidth ? { width: itemWidth } : undefined}
					>
						{child}
					</Content>
				))}
			</Space>
		</Content>
	);
};

export default HorizontalScroll;
