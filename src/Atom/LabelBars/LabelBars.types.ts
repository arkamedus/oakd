import React from "react";

export interface LabelBarDatum {
	label: string;
	prob: number;
}

export interface LabelBarsProps {
	labels: LabelBarDatum[];
	className?: string;
	style?: React.CSSProperties;
}
