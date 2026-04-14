import React from "react";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";
import { ChartHeader, viridisColor } from "../Chart/Chart.shared";
import { EmbeddingHeatmapProps } from "./EmbeddingHeatmap.types";
import "./EmbeddingHeatmap.css";

const normalizeEmbedding = (embedding: number[] | number[][]) => {
	if (!Array.isArray(embedding[0])) {
		return [embedding as number[]];
	}

	return embedding as number[][];
};

const EmbeddingHeatmap: React.FC<EmbeddingHeatmapProps> = ({
	embedding,
	title,
	subtitle,
	minCellWidth = 8,
	stripHeight = 18,
	height,
	fillHeight = false,
	className = "",
	style,
}) => {
	const rows = normalizeEmbedding(embedding);
	const flat = rows.flat();

	if (!flat.length) {
		return (
			<div
				className={[
					"oakd",
					"wide",
					"oakd-embedding-heatmap",
					fillHeight && "oakd-embedding-heatmap--fill",
					className,
				]
					.filter(Boolean)
					.join(" ")}
				style={style}
			>
				<Space
					direction="vertical"
					gap
					wide
					className="oakd-embedding-heatmap__content"
				>
					<ChartHeader title={title} subtitle={subtitle} />
					<Paragraph>No embedding data.</Paragraph>
				</Space>
			</div>
		);
	}

	const min = Math.min(...flat);
	const max = Math.max(...flat);
	const span = Math.max(max - min, 1e-6);
	const isMatrix = rows.length > 1;
	const columns = Math.max(...rows.map((row) => row.length), 1);
	const resolvedHeight = fillHeight ? "100%" : height;
	const rowHeight = isMatrix
		? typeof height === "number"
			? height / Math.max(rows.length, 1)
			: minCellWidth
		: typeof height === "number"
			? height
			: stripHeight;

	return (
		<div
			className={[
				"oakd",
				"wide",
				"oakd-embedding-heatmap",
				fillHeight && "oakd-embedding-heatmap--fill",
				className,
			]
				.filter(Boolean)
				.join(" ")}
			style={style}
		>
			<Space
				direction="vertical"
				gap
				wide
				fill={fillHeight}
				className="oakd-embedding-heatmap__content"
			>
				<ChartHeader title={title} subtitle={subtitle} />
				<div
					data-testid="EmbeddingHeatmapGrid"
					className={[
						"oakd-embedding-heatmap__grid",
						fillHeight && "oakd-embedding-heatmap__grid--fill",
					]
						.filter(Boolean)
						.join(" ")}
					style={{
						display: "grid",
						gridTemplateColumns: `repeat(${columns}, minmax(${minCellWidth}px, 1fr))`,
						width: "100%",
						gap: 0,
						minHeight: fillHeight ? 0 : isMatrix ? undefined : rowHeight,
						height: resolvedHeight,
						overflow: "hidden",
						borderRadius: 6,
					}}
				>
					{rows.map((row, rowIndex) =>
						Array.from({ length: columns }).map((_, colIndex) => {
							const value = row[colIndex];
							const color =
								typeof value === "number"
									? viridisColor((value - min) / span)
									: "transparent";

							return (
								<div
									key={`${rowIndex}-${colIndex}`}
									style={{
										minWidth: minCellWidth,
										minHeight: fillHeight && isMatrix ? undefined : rowHeight,
										height: fillHeight && isMatrix ? "100%" : rowHeight,
										background: color,
										borderRadius: 0,
									}}
									title={
										typeof value === "number"
											? `Row ${rowIndex + 1}, Col ${colIndex + 1}: ${value.toFixed(4)}`
											: undefined
									}
								/>
							);
						}),
					)}
				</div>
			</Space>
		</div>
	);
};

export default EmbeddingHeatmap;
