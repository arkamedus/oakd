import React, { forwardRef } from "react";
import Icon, { IconStack } from "../../Icon/Icon";
import { sizeMinusOne } from "../../Core/Core.utils";
import "./Checkbox.css";
import { CheckboxProps } from "./Checkbox.types";
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	(
		{ label, icon = "Check", size = "default", className, style, ...rest },
		ref,
	) => (
		<label
			className={["oakd", "oakd-checkbox", `size-${size}`, className]
				.filter(Boolean)
				.join(" ")}
			style={style}
		>
			<input
				{...rest}
				ref={ref}
				type="checkbox"
				className="oakd-checkbox__input"
			/>
			<IconStack className="oakd-checkbox__indicator">
				<Icon name="Square" size={size} />
				<Icon
					name={icon}
					className="oakd-checkbox__check"
					size={sizeMinusOne(size)}
				/>
			</IconStack>
			{label}
		</label>
	),
);
Checkbox.displayName = "Checkbox";
export default Checkbox;
