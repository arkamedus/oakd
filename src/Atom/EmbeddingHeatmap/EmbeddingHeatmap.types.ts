import React from "react";

export interface EmbeddingHeatmapProps {
	embedding: number[] | number[][];
	title?: React.ReactNode;
	subtitle?: React.ReactNode;
	minCellWidth?: number;
	stripHeight?: number;
	height?: number;
	fill?: boolean;
	className?: string;
	style?: React.CSSProperties;
}
