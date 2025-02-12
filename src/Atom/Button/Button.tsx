import React from "react";
import { ButtonProps } from "./Button.types";
import "./Button.css";
import Space from "../Space/Space";
import Icon from "../../Icon/Icon";
import Paragraph from "../Paragraph/Paragraph";
import { sizeMinusOne } from "../../Core/Core.utils";


/**
 * Button component
 *
 * @param {ButtonProps} props Component properties
 * @returns {JSX.Element} Rendered Button element
 */
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
	role = "button"
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
		.filter(Boolean)
		.join(" ");

	/**
	 * Handles the click event. Prevents action if disabled.
	 * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event
	 */
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (isDisabled) return;
		if (onClick) onClick(event);
	};

	return (
		<button
			style={style}
			className={classNames}
			onClick={handleClick}
			type={buttonType}
			disabled={isDisabled}
			role={role}
			data-testid="Button"
		>
			<Space gap align="center" style={{ height: "100%" }}>
				{icon && typeof icon === "string" ? (
					<Icon name={icon} size={sizeMinusOne(size)} />
				) : (
					icon
				)}
				{children}
			</Space>
		</button>
	);
};

export default Button;

export const ButtonGroup: React.FC<{children?:any}> = ({ children}) => {
	return <Space className={"button_group"}>{children}</Space>
};