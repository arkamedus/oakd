import React from "react";

export type VectorAxis = "x" | "y" | "z";

export interface VectorValue {
	x: number;
	y: number;
	z?: number;
}

export interface VectorAxisOptions {
	min?: number;
	max?: number;
	step?: number;
	resetValue?: number;
}

export interface VectorFieldProps extends Omit<
	React.HTMLAttributes<HTMLDivElement>,
	"defaultValue" | "onChange" | "onReset"
> {
	value: VectorValue;
	onChange: (value: VectorValue, axis: VectorAxis) => void;
	label?: React.ReactNode;
	dimensions?: 2 | 3;
	layout?: "grid" | "toolbar";
	axisOptions?: Partial<Record<VectorAxis, VectorAxisOptions>>;
	onResetAxis?: (axis: VectorAxis) => void;
	onRandomizeAxis?: (axis: VectorAxis) => void;
	onReset?: (value: VectorValue) => void;
	onRandomize?: (value: VectorValue) => void;
	onApply?: (value: VectorValue) => void;
	disabled?: boolean;
	readOnly?: boolean;
	showActions?: boolean;
	framed?: boolean;
	wide?: boolean;
	grow?: boolean;
}
