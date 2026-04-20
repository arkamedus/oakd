import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { InputProps } from "./Input.types";
import "./Input.css";
import Space from "../Space/Space";
import Icon from "../../Icon/Icon";
import { CoreIconNameType, IconTriangle } from "../../Icon/Icons.bin";
import { sizeMinusOne } from "../../Core/Core.utils";

type InputValue = string | number | readonly string[];

/**
 * Input component for user text entry.
 * @param {InputProps} props - The component props.
 * @returns {JSX.Element} The rendered Input component.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			type = "text",
			value,
			defaultValue,
			placeholder = "",
			error = false,
			disabled = false,
			readOnly = false,
			size = "default",
			variant = "default",
			icon,
			className = "",
			style,
			onChange,
			grow,
			...rest
		},
		ref,
	) => {
		const isControlled = value !== undefined;
		const [internalValue, setInternalValue] = useState<InputValue>(
			defaultValue ?? "",
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
			if (!isControlled) {
				setInternalValue(event.target.value);
			}
			setHasError(false);
			onChange?.(event);
		};

		// Sync error flag when error prop changes
		useEffect(() => {
			setHasError(error);
		}, [error]);

		// Sync internal value when the component is controlled.
		useEffect(() => {
			if (isControlled) {
				setInternalValue(value ?? "");
			}
		}, [isControlled, value]);

		const renderedValue = isControlled ? value : internalValue;

		const containerClasses = [
			"oakd",
			"standardized-reset",
			"standardized-text",
			"input-container",
			`type-${variant}`,
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
			`type-${variant}`,
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
							<Icon name={icon as CoreIconNameType} size={sizeMinusOne(size)} />
						) : (
							icon
						))}
					<input
						{...rest}
						ref={inputRef}
						readOnly={readOnly}
						aria-invalid={hasError}
						data-testid="Input"
						className={inputClasses}
						type={type}
						value={renderedValue}
						defaultValue={isControlled ? undefined : defaultValue}
						placeholder={placeholder}
						disabled={disabled}
						onChange={handleChange}
					/>
					{hasError && (
						<span data-testid="InputError" className="input-error-icon">
							<IconTriangle size={sizeMinusOne(size)} />
						</span>
					)}
				</Space>
			</div>
		);
	},
);

export default Input;
