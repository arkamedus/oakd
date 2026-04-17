import React from "react";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";
import Content from "../../Layout/Content/Content";
import {
	ChartAxisLabel,
	ChartHeader,
	ChartLegend,
	getChartColor,
} from "../Chart/Chart.shared";
import { StackedBreakdownChartProps } from "./StackedBreakdownChart.types";
import "./StackedBreakdownChart.css";

const TOOLTIP_WIDTH = 200;
const TOOLTIP_GUTTER = 8;
const TOOLTIP_OFFSET = 16;

const StackedBreakdownChart: React.FC<StackedBreakdownChartProps> = ({
	title,
	subtitle,
	height,
	fill = false,
	xLabels = [],
	showXAxisLabels = true,
	showHover = true,
	rows,
	labels,
	className = "",
	style,
}) => {
	const [hoveredRowIndex, setHoveredRowIndex] = React.useState<number | null>(
		null,
	);
	const bodyRef = React.useRef<HTMLDivElement>(null);
	const [bodyWidth, setBodyWidth] = React.useState(0);
	const [pointerX, setPointerX] = React.useState<number | null>(null);

	React.useEffect(() => {
		const element = bodyRef.current;
		if (!element) return;

		const measure = () => {
			const nextWidth =
				element.clientWidth || element.getBoundingClientRect().width || 0;
			setBodyWidth((current) => (current === nextWidth ? current : nextWidth));
		};

		measure();

		if (typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver(measure);
		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	const hoveredRow = hoveredRowIndex !== null ? rows[hoveredRowIndex] : null;
	const shouldFill = fill;
	const shouldStretchPlot = shouldFill || !showXAxisLabels;
	const labelReserve = showXAxisLabels ? 40 : 0;
	const stackHeight = height ? Math.max(120, height - labelReserve) : undefined;
	const chartMinHeight = height ?? (showXAxisLabels ? 220 : 220);
	const hoveredCenterX =
		hoveredRowIndex !== null && rows.length
			? ((hoveredRowIndex + 0.5) / rows.length) * bodyWidth
			: TOOLTIP_GUTTER;
	const tooltipLeft = Math.min(
		Math.max(
			(pointerX ?? hoveredCenterX) < bodyWidth / 2
				? (pointerX ?? hoveredCenterX) + TOOLTIP_OFFSET
				: (pointerX ?? hoveredCenterX) - TOOLTIP_WIDTH - TOOLTIP_OFFSET,
			TOOLTIP_GUTTER,
		),
		Math.max(TOOLTIP_GUTTER, bodyWidth - TOOLTIP_WIDTH - TOOLTIP_GUTTER),
	);

	return (
		<div
			className={[
				"oakd",
				"wide",
				"oakd-stacked-breakdown-chart",
				shouldFill ? "oakd-stacked-breakdown-chart--fill" : "",
				className,
			]
				.filter(Boolean)
				.join(" ")}
			style={style}
		>
			<Space direction="vertical" gap wide fill={shouldFill} align="stretch">
				<ChartHeader title={title} subtitle={subtitle} />
				{!rows.length || !labels.length ? (
					<Paragraph>No data.</Paragraph>
				) : (
					<>
						<div
							ref={bodyRef}
							className={[
								"oakd-stacked-breakdown-chart__body",
								shouldStretchPlot
									? "oakd-stacked-breakdown-chart__body--fill"
									: "",
							]
								.filter(Boolean)
								.join(" ")}
						>
							<div
								className={[
									"oakd-stacked-breakdown-chart__grid",
									shouldStretchPlot
										? "oakd-stacked-breakdown-chart__grid--fill"
										: "",
								]
									.filter(Boolean)
									.join(" ")}
								style={{
									gridTemplateColumns: `repeat(${rows.length}, minmax(0, 1fr))`,
									minHeight: chartMinHeight,
								}}
							>
								{rows.map((row, rowIndex) => (
									<Content
										key={row.key}
										wide
										className={[
											"oakd-stacked-breakdown-chart__column",
											"oakd-stacked-breakdown-chart__column-fill",
										]
											.filter(Boolean)
											.join(" ")}
										data-testid={`StackedBreakdownColumn-${row.key}`}
									>
										<Space direction="vertical" gap align="stretch" wide fill>
											<div
												className={[
													"oakd-stacked-breakdown-chart__stack",
													!stackHeight
														? "oakd-stacked-breakdown-chart__stack--fill"
														: "",
													hoveredRowIndex === rowIndex ? "is-hovered" : "",
												]
													.filter(Boolean)
													.join(" ")}
												//title={row.key}
												style={
													stackHeight ? { height: stackHeight } : undefined
												}
												onMouseEnter={(event) => {
													if (showHover) {
														setHoveredRowIndex(rowIndex);
														const bounds =
															bodyRef.current?.getBoundingClientRect();
														setPointerX(
															bounds
																? event.clientX - bounds.left
																: hoveredCenterX,
														);
													}
												}}
												onMouseMove={(event) => {
													if (showHover) {
														const bounds =
															bodyRef.current?.getBoundingClientRect();
														setPointerX(
															bounds
																? event.clientX - bounds.left
																: hoveredCenterX,
														);
													}
												}}
												onMouseLeave={() => {
													if (showHover) {
														setHoveredRowIndex(null);
														setPointerX(null);
													}
												}}
												data-testid={`StackedBreakdownRow-${row.key}`}
											>
												{labels.map((label, labelIndex) => {
													const value = row.labelWeights[label] ?? 0;
													if (value <= 0) return null;

													return (
														<div
															key={label}
															className="oakd-stacked-breakdown-chart__segment"
															style={{
																height: `${Math.max(0, Math.min(100, value * 100))}%`,
																background: getChartColor(labelIndex),
																minHeight: value > 0 ? 2 : 0,
															}}
															//title={`${label}: ${(value * 100).toFixed(1)}%`}
														/>
													);
												})}
											</div>
											{showXAxisLabels ? (
												<ChartAxisLabel>
													{xLabels[rowIndex] ?? row.key}
												</ChartAxisLabel>
											) : null}
										</Space>
									</Content>
								))}
							</div>
							{showHover && hoveredRow ? (
								<div
									className="oakd-stacked-breakdown-chart__tooltip"
									style={{ left: tooltipLeft }}
									data-testid="StackedBreakdownTooltip"
								>
									<Space direction="vertical" gap wide>
										<Paragraph>
											<strong>
												{xLabels[hoveredRowIndex] ?? hoveredRow.key}
											</strong>
										</Paragraph>
										<Paragraph style={{ opacity: 0.7 }}>
											<strong>
												{labels
													.reduce(
														(sum, label) =>
															sum + (hoveredRow.labelWeights[label] ?? 0),
														0,
													)
													.toLocaleString(undefined, {
														style: "percent",
														minimumFractionDigits: 1,
														maximumFractionDigits: 1,
													})}
											</strong>{" "}
											total
										</Paragraph>
										{labels.map((label, labelIndex) => {
											const value = hoveredRow.labelWeights[label] ?? 0;
											return (
												<Space key={label} justify="between" gap wide>
													<Paragraph
														style={{ color: getChartColor(labelIndex) }}
													>
														{label}
													</Paragraph>
													<Paragraph>{(value * 100).toFixed(1)}%</Paragraph>
												</Space>
											);
										})}
									</Space>
								</div>
							) : null}
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
