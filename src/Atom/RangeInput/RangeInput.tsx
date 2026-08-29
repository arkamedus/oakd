import React, { forwardRef, useState } from "react";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";
import "./RangeInput.css";
import { RangeInputProps } from "./RangeInput.types";
const RangeInput = forwardRef<HTMLInputElement, RangeInputProps>(
	(
		{ onChange, showValue = false, value, defaultValue, className, ...rest },
		ref,
	) => {
		const [internalValue, setInternalValue] = useState(
			defaultValue ?? rest.min ?? 0,
		);
		const renderedValue = value ?? internalValue;
		return (
			<Space
				className={["oakd-range", className].filter(Boolean).join(" ")}
				align="center"
				gap
				wide
				noWrap
			>
				<input
					{...rest}
					ref={ref}
					type="range"
					value={renderedValue}
					onChange={(event) => {
						if (value === undefined) setInternalValue(event.target.value);
						onChange?.(event.target.valueAsNumber, event);
					}}
				/>
				{showValue ? (
					<output>
						<Paragraph>{renderedValue}</Paragraph>
					</output>
				) : null}
			</Space>
		);
	},
);
RangeInput.displayName = "RangeInput";
export default RangeInput;
