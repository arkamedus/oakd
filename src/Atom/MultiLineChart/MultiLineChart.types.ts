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
	hoverLabel?: string;
	smooth?: boolean;
	showVerticalTicks?: boolean;
	showHorizontalTicks?: boolean;
	showXAxisLabels?: boolean;
	showYAxisLabels?: boolean;
	xLabels?: React.ReactNode[];
	yLabels?: Array<{ value: number; label: React.ReactNode }>;
	className?: string;
	style?: React.CSSProperties;
}
