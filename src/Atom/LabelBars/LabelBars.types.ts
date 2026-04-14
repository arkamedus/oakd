import React from "react";

export interface LabelBarDatum {
	label: string;
	prob: number;
}

export type LabelBarsColorMode = "label" | "scale";

export interface LabelBarsProps {
	labels: LabelBarDatum[];
	colorMode?: LabelBarsColorMode;
	className?: string;
	style?: React.CSSProperties;
}
