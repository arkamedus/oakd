import React from "react";
import { CardProps } from "./Card.types";
import "./Card.css";

/**
 * Card Component
 *
 * A flexible container component that adheres to oakd's design system. It renders children within a styled container.
 *
 * @param {CardProps} props - The props for the Card component.
 * @returns {JSX.Element} The rendered Card component.
 */
const Card: React.FC<CardProps> = ({
	children,
	style,
	wide,
	grow,
	fill,
	className,
	pad,
	onClick,
	variant = "default",
	...rest
}) => {
	const classNames = ["oakd", "card", `type-${variant}`];
	if (pad) {
		classNames.push("pad");
	}
	if (wide) {
		classNames.push("wide");
	}
	if (grow) {
		classNames.push("grow");
	}
	if (fill) {
		classNames.push("fill");
	}
	if (className) {
		classNames.push(className);
	}
	return (
		<div
			{...rest}
			data-testid="Card"
			className={classNames.join(" ")}
			style={style}
			role="region"
			onClick={onClick}
		>
			{children}
		</div>
	);
};

export default Card;
