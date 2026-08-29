import React from "react";
export interface RangeInputProps extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"type" | "onChange"
> {
	onChange?: (
		value: number,
		event: React.ChangeEvent<HTMLInputElement>,
	) => void;
	showValue?: boolean;
}
