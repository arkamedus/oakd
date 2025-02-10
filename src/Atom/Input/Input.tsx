import React, { useEffect, useState } from "react";
import { InputProps } from "./Input.types";
import "./Input.css";
import Space from "../Space/Space";
import Icon from "../../Icon/Icon";
import Paragraph from "../Paragraph/Paragraph";
import { IconTriangle } from "../../Icon/Icons.bin";
import { sizeMinusOne } from "../../Core/Core.utils";

const Input: React.FC<InputProps> = ({
	type = "text",
	value = "",
	defaultValue,
	placeholder = "",
	error,
	disabled = false,
	size = "default",
	inputType = "default", // Matches Button types
	icon,
	className = "",
	style,
	onChange,
	onBlur,
	onFocus,
}) => {
	const [internalValue, setInternalValue] = useState(defaultValue || value);
	const [hasError, setHasError] = useState(error);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInternalValue(event.target.value);
		setHasError(false); // Reset error when value changes
		if (onChange) onChange(event);
	};

	useEffect(() => {
		setHasError(error);
	}, [error]);

	const classNames = [
		"oakd",
		"standardized-reset",
		"standardized-text",
		"input-container",
		`type-${inputType}`, // Match button styles
		hasError ? "input-error" : "",
		disabled ? "input-disabled" : "",
		className,
	]
		.join(" ")
		.trim();

	const innerClassNames = [
		"oakd",
		"standardized-reset",
		"standardized-text",
		"input",
		`size-${size}`, // Match button styles
		`type-${inputType}`,
		disabled ? "input-disabled" : "",
	]
		.join(" ")
		.trim();

	return (
		<div className={classNames} style={style} data-testid="InputContainer">
			<Space gap align="center" direction={"horizontal"}>
				{icon &&
					(typeof icon === "string" ? (
						<Icon name={icon} size={sizeMinusOne(size)} />
					) : (
						icon
					))}
				<input
					data-testid="Input"
					className={innerClassNames}
					type={type}
					value={internalValue}
					placeholder={placeholder}
					disabled={disabled}
					onChange={handleChange}
					onBlur={onBlur}
					onFocus={onFocus}
				/>
				{hasError && (
					<span data-testid="InputError">
						<IconTriangle size={sizeMinusOne(size)} className="input-error-message"/>
				</span>
				)}
			</Space>
		</div>
	);
};

export default Input;
