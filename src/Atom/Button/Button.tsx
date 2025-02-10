import React from "react";
import { ButtonProps } from "./Button.types";
import "./Button.css";
import Space from "../Space/Space";
import Icon from "../../Icon/Icon";
import Paragraph from "../Paragraph/Paragraph";
import { sizeMinusOne } from "../../Core/Core.utils";

const Button: React.FC<ButtonProps> = ({
	children,
	onClick,
	style,
	buttonType = "button",
	type = "default",
	size = "default",
	className = "",
	icon,
	disabled,
	role = "button", // Default role for accessibility
	label,
}) => {
	const isDisabled = type === "disabled" || disabled;

	const classNames = [
		"oakd",
		"standardized-reset",
		"standardized-text",
		"button",
		`type-${type}`,
		`size-${size}`,
		isDisabled ? "disabled" : "",
		className,
	]
		.join(" ")
		.trim();

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (isDisabled) return;
		if (onClick) onClick(event);
	};

	return (
		<button
			style={style}
			className={classNames}
			onClick={isDisabled ? undefined : handleClick}
			type={buttonType}
			disabled={isDisabled}
			role={role}
			data-testid="Button"
		>
			<Space gap align={"center"} style={{ height: "100%" }}>
				{icon && typeof icon === "string" ? (
					<Icon name={icon} size={sizeMinusOne(size)} />
				) : (
					icon
				)}
				{label && <Paragraph>{label}</Paragraph>}
				{children}
			</Space>
		</button>
	);
};

export default Button;
