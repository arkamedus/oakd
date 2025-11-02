import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import { InputProps } from "./Input.types";
import "./Input.css";
import Space from "../Space/Space";
import Icon from "../../Icon/Icon";
import { IconTriangle } from "../../Icon/Icons.bin";
import { sizeMinusOne } from "../../Core/Core.utils";

/**
 * Input component for user text entry.
 * @param {InputProps} props - The component props.
 * @returns {JSX.Element} The rendered Input component.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(({
	type = "text",
	value = "",
	defaultValue,
	placeholder = "",
	error = false,
	disabled = false,
	size = "default",
	inputType = "default", // Matches Button types
	icon,
	className = "",
	style,
	onChange,
	onBlur,
	onFocus,
	min,
	max,
	grow,
	onKeyPress,
}, ref) => {
	const [internalValue, setInternalValue] = useState<string | number>(
		defaultValue ?? value,
	);
	const [hasError, setHasError] = useState(error);

	const inputRef = useRef<HTMLInputElement>(null);

	// expose the inner input ref to parent
	useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

	/**
	 * Handler for input change event
	 * @param {React.ChangeEvent<HTMLInputElement>} event
	 */
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInternalValue(event.target.value);
		setHasError(false);
		if (onChange) onChange(event);
	};

	// Sync error flag when error prop changes
	useEffect(() => {
		setHasError(error);
	}, [error]);

	// Sync error flag when error prop changes
	useEffect(() => {
		setInternalValue(defaultValue ?? value);
	}, [defaultValue, value]);

	const containerClasses = [
		"oakd",
		"standardized-reset",
		"standardized-text",
		"input-container",
		`type-${inputType}`,
		hasError ? "input-error" : "",
		disabled ? "input-disabled" : "",
		grow ? "grow" : "",
		className,
	]
		.filter(Boolean)
		.join(" ");

	const inputClasses = [
		"oakd",
		"standardized-reset",
		"standardized-text",
		"input",
		`size-${size}`,
		`type-${inputType}`,
		disabled ? "input-disabled" : "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div
			className={containerClasses}
			style={style}
			data-testid="InputContainer"
		>
			<Space gap align="center" direction="horizontal" wide>
				{icon &&
					(typeof icon === "string" ? (
						<Icon name={icon} size={sizeMinusOne(size)} />
					) : (
						icon
					))}
				<input
					ref={inputRef}
					min={min}
					max={max}
					aria-invalid={hasError}
					aria-disabled={disabled}
					data-testid="Input"
					className={inputClasses}
					type={type}
					value={internalValue}
					placeholder={placeholder}
					disabled={disabled}
					onChange={handleChange}
					onBlur={onBlur}
					onFocus={onFocus}
					onKeyPress={onKeyPress}
				/>
				{hasError && (
					<span data-testid="InputError" className="input-error-icon">
						<IconTriangle size={sizeMinusOne(size)} />
					</span>
				)}
			</Space>
		</div>
	);
});

export default Input;
