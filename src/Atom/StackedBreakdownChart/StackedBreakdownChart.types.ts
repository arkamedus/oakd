import React from "react";

export interface StackedBreakdownRow {
	key: string;
	labelWeights: Record<string, number>;
}

export interface StackedBreakdownChartProps {
	title?: React.ReactNode;
	subtitle?: React.ReactNode;
	xLabels?: React.ReactNode[];
	rows: StackedBreakdownRow[];
	labels: string[];
	className?: string;
	style?: React.CSSProperties;
}
