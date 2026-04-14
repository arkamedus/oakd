import React from "react";

export interface MultiLineChartPoint {
	x: string;
	y: number;
}

export interface MultiLineChartSeries {
	label: string;
	color?: string;
	values: MultiLineChartPoint[];
}

export interface MultiLineChartProps {
	lines: MultiLineChartSeries[];
	height?: number;
	fill?: boolean;
	/** @deprecated Use `fill` instead. */
	fillHeight?: boolean;
	hoverLabel?: string;
	smooth?: boolean;
	showVerticalTicks?: boolean;
	className?: string;
	style?: React.CSSProperties;
}
