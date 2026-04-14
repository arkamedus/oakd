import React from "react";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";
import { ChartHeader, ChartLegend, getChartColor } from "../Chart/Chart.shared";
import { StackedBreakdownChartProps } from "./StackedBreakdownChart.types";

const StackedBreakdownChart: React.FC<StackedBreakdownChartProps> = ({
	title,
	subtitle,
	xLabels = [],
	rows,
	labels,
	className = "",
	style,
}) => {
	return (
		<div
			className={["oakd", "wide", "oakd-stacked-breakdown-chart", className]
				.filter(Boolean)
				.join(" ")}
			style={style}
		>
			<Space direction="vertical" gap wide>
				<ChartHeader title={title} subtitle={subtitle} />
				{!rows.length || !labels.length ? (
					<Paragraph>No data.</Paragraph>
				) : (
					<>
						<div
							style={{
								width: "100%",
								display: "grid",
								gridTemplateColumns: `repeat(${rows.length}, minmax(0, 1fr))`,
								gap: 2,
								alignItems: "end",
								minHeight: 220,
							}}
						>
							{rows.map((row, rowIndex) => (
								<Space key={row.key} direction="vertical" gap align="center">
									<div
										style={{
											height: 180,
											width: "100%",
											minWidth: 10,
											borderRadius: "3pt",
											overflow: "hidden",
											background: "rgba(0,0,0,0.05)",
											display: "flex",
											flexDirection: "column-reverse",
										}}
										title={row.key}
									>
										{labels.map((label, labelIndex) => {
											const value = row.labelWeights[label] ?? 0;
											if (value <= 0) return null;

											return (
												<div
													key={label}
													style={{
														height: `${Math.max(0, Math.min(100, value * 100))}%`,
														background: getChartColor(labelIndex),
														minHeight: value > 0 ? 2 : 0,
													}}
													title={`${label}: ${(value * 100).toFixed(1)}%`}
												/>
											);
										})}
									</div>
									<Paragraph style={{ opacity: 0.7, fontSize: "0.8em" }}>
										{xLabels[rowIndex] ?? row.key}
									</Paragraph>
								</Space>
							))}
						</div>
						<ChartLegend
							items={labels.map((label, index) => ({
								label,
								color: getChartColor(index),
							}))}
						/>
					</>
				)}
			</Space>
		</div>
	);
};

export default StackedBreakdownChart;
