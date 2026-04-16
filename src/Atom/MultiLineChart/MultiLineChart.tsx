import React, { useEffect, useRef, useState } from "react";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";
import {
	ChartAxisLabel,
	ChartLegend,
	getChartColor,
} from "../Chart/Chart.shared";
import "./MultiLineChart.css";
import {
	MultiLineChartPoint,
	MultiLineChartProps,
} from "./MultiLineChart.types";

const makeSmoothPath = (pts: Array<{ x: number; y: number }>) => {
	if (pts.length < 2) return "";

	const d = [`M ${pts[0].x} ${pts[0].y}`];

	for (let i = 0; i < pts.length - 1; i++) {
		const p0 = pts[i];
		const p1 = pts[i + 1];

		const cp1x = p0.x + (p1.x - p0.x) * 0.35;
		const cp2x = p1.x - (p1.x - p0.x) * 0.35;

		d.push(`C ${cp1x} ${p0.y}, ${cp2x} ${p1.y}, ${p1.x} ${p1.y}`);
	}

	return d.join(" ");
};

const parseYmdToLocalDate = (ymd: string) => {
	const [y, m, d] = ymd.split("-").map(Number);
	return new Date(y, m - 1, d);
};

const getWidth = (element: HTMLDivElement | null) => {
	if (!element) return 0;
	return element.clientWidth || element.getBoundingClientRect().width || 0;
};

const getHeight = (element: HTMLDivElement | null) => {
	if (!element) return 0;
	return element.clientHeight || element.getBoundingClientRect().height || 0;
};

const getValueAtIndex = (values: MultiLineChartPoint[], index: number) =>
	values[index]?.y ?? 0;

const TOOLTIP_WIDTH = 200;
const TOOLTIP_GUTTER = 8;

const MultiLineChart: React.FC<MultiLineChartProps> = ({
	lines,
	height,
	fill = false,
	hoverLabel,
	smooth = false,
	showVerticalTicks = false,
	showHorizontalTicks = false,
	showXAxisLabels = false,
	showYAxisLabels = false,
	xLabels,
	yLabels,
	className = "",
	style,
}) => {
	const shouldFill = fill;
	const frameRef = useRef<HTMLDivElement>(null);
	const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
	const [hoverX, setHoverX] = useState<number | null>(null);
	const [hoverIndex, setHoverIndex] = useState<number | null>(null);

	useEffect(() => {
		const frameElement = frameRef.current;
		if (!frameElement) return;
		let frameId: number | null = null;

		const measure = () => {
			const nextWidth = getWidth(frameElement);
			const nextHeight = shouldFill ? getHeight(frameElement) : (height ?? 180);
			setFrameSize((current) =>
				current.width === nextWidth && current.height === nextHeight
					? current
					: { width: nextWidth, height: nextHeight },
			);
		};

		measure();

		if (typeof ResizeObserver === "undefined") return;

		const observer = new ResizeObserver(() => {
			if (frameId !== null) {
				cancelAnimationFrame(frameId);
			}
			frameId = requestAnimationFrame(measure);
		});

		observer.observe(frameElement);
		return () => {
			observer.disconnect();
			if (frameId !== null) {
				cancelAnimationFrame(frameId);
			}
		};
	}, [shouldFill, height]);

	if (!lines.length) {
		return (
			<div
				className={["oakd", "wide", "oakd-multi-line-chart", className]
					.filter(Boolean)
					.join(" ")}
				style={style}
			>
				<div className="oakd-multi-line-chart__content">
					<Paragraph>No line data available.</Paragraph>
				</div>
			</div>
		);
	}

	const normalizedLines = lines.map((line, index) => ({
		...line,
		color: line.color || getChartColor(index),
	}));

	if (frameSize.width === 0) {
		return (
			<div
				data-testid="MultiLineChartRoot"
				className={[
					"oakd",
					"wide",
					"oakd-multi-line-chart",
					shouldFill && "oakd-multi-line-chart--fill",
					className,
				]
					.filter(Boolean)
					.join(" ")}
				style={style}
			>
				<div className="oakd-multi-line-chart__content">
					<div>
						<ChartLegend
							items={normalizedLines.map((line) => ({
								label: line.label,
								color: line.color,
							}))}
						/>
					</div>
					<div
						ref={frameRef}
						className={[
							"oakd-multi-line-chart__frame",
							shouldFill ? "oakd-multi-line-chart__frame-fill" : "",
						]
							.filter(Boolean)
							.join(" ")}
					/>
				</div>
			</div>
		);
	}
	const chartHeight = frameSize.height || height || 180;
	const width = frameSize.width;

	const maxLen = Math.max(
		...normalizedLines.map((line) => line.values.length),
		1,
	);
	const maxY = Math.max(
		...normalizedLines.flatMap((line) => line.values.map((value) => value.y)),
		1,
	);
	const axisXLabels = xLabels?.length
		? xLabels
		: (normalizedLines[0]?.values.map((value) => value.x) ?? []);
	const axisYLabels = yLabels?.length
		? yLabels
		: [
				{ value: maxY, label: maxY.toLocaleString() },
				{ value: maxY / 2, label: Math.round(maxY / 2).toLocaleString() },
				{ value: 0, label: "0" },
			];
	const leftPad = showYAxisLabels ? 40 : 0;
	const rightPad = 0;
	const topPad = 0;
	const bottomPad = showXAxisLabels ? 28 : 0;

	const xAt = (index: number) =>
		maxLen <= 1
			? (leftPad + width - rightPad) / 2
			: leftPad + (index / (maxLen - 1)) * (width - leftPad - rightPad);
	const yAt = (value: number) =>
		chartHeight -
		bottomPad -
		(value / maxY) * (chartHeight - topPad - bottomPad);

	const hoverDate =
		hoverIndex !== null
			? normalizedLines[0]?.values[hoverIndex]?.x || null
			: null;
	const tooltipLeft =
		hoverX !== null
			? Math.min(
					Math.max(hoverX - TOOLTIP_WIDTH / 2, TOOLTIP_GUTTER),
					Math.max(TOOLTIP_GUTTER, width - TOOLTIP_WIDTH - TOOLTIP_GUTTER),
				)
			: TOOLTIP_GUTTER;

	return (
		<div
			data-testid="MultiLineChartRoot"
			className={[
				"oakd",
				"wide",
				"oakd-multi-line-chart",
				shouldFill && "oakd-multi-line-chart--fill",
				className,
			]
				.filter(Boolean)
				.join(" ")}
			style={style}
		>
			<div className="oakd-multi-line-chart__content">
				<div>
					<ChartLegend
						items={normalizedLines.map((line) => ({
							label: line.label,
							color: line.color,
						}))}
					/>
				</div>
				<div
					ref={frameRef}
					data-testid="MultiLineChartFrame"
					className={[
						"oakd-multi-line-chart__frame",
						shouldFill ? "oakd-multi-line-chart__frame-fill" : "",
					]
						.filter(Boolean)
						.join(" ")}
				>
					<svg
						data-testid="MultiLineChartSvg"
						width={width}
						height={chartHeight}
						style={{ overflow: "visible" }}
					>
						{showHorizontalTicks
							? axisYLabels.map((tick, index) => {
									const cy = yAt(tick.value);
									return (
										<line
											key={`h-tick-${index}`}
											x1={leftPad}
											y1={cy}
											x2={width - rightPad}
											y2={cy}
											stroke="rgba(0, 0, 0, 0.08)"
											strokeDasharray="2 4"
										/>
									);
								})
							: null}

						{showVerticalTicks
							? Array.from({ length: maxLen }).map((_, index) => {
									const cx = xAt(index);
									return (
										<line
											key={`tick-${index}`}
											x1={cx}
											y1={topPad}
											x2={cx}
											y2={chartHeight - bottomPad}
											stroke="rgba(0, 0, 0, 0.08)"
											strokeDasharray="2 4"
										/>
									);
								})
							: null}

						{hoverX !== null && hoverIndex !== null ? (
							<line
								x1={hoverX}
								y1={topPad}
								x2={hoverX}
								y2={chartHeight - bottomPad}
								stroke="#999"
								strokeDasharray="4 2"
							/>
						) : null}

						{normalizedLines.map((line, lineIndex) => {
							const points = line.values.map((value, index) => ({
								x: xAt(index),
								y: yAt(value.y),
							}));

							const path = smooth
								? makeSmoothPath(points)
								: points
										.map(
											(point, index) =>
												`${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
										)
										.join(" ");

							return (
								<g key={lineIndex}>
									<path
										d={path}
										fill="none"
										stroke={line.color}
										strokeWidth={3}
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									{points.map((point, index) => (
										<circle
											key={index}
											cx={point.x}
											cy={point.y}
											r={5}
											fill={line.color}
											opacity={hoverIndex === index ? 1 : 0}
										/>
									))}
								</g>
							);
						})}

						{showYAxisLabels
							? axisYLabels.map((tick, index) => (
									<foreignObject
										key={`y-label-${index}`}
										x={0}
										y={yAt(tick.value) - 10}
										width={leftPad - 8}
										height={20}
									>
										<ChartAxisLabel align="right">{tick.label}</ChartAxisLabel>
									</foreignObject>
								))
							: null}

						{showXAxisLabels
							? axisXLabels.slice(0, maxLen).map((label, index) => {
									const layout =
										index === 0
											? { x: 0, align: "left" as const }
											: index === maxLen - 1
												? {
														x: Math.max(0, width - 80),
														align: "right" as const,
													}
												: {
														x: Math.max(
															0,
															Math.min(width - 80, xAt(index) - 40),
														),
														align: "center" as const,
													};

									return (
										<foreignObject
											key={`x-label-${index}`}
											x={layout.x}
											y={chartHeight - bottomPad + 8}
											width={80}
											height={20}
										>
											<ChartAxisLabel align={layout.align}>
												{label}
											</ChartAxisLabel>
										</foreignObject>
									);
								})
							: null}

						{Array.from({ length: maxLen }).map((_, index) => {
							const cx = xAt(index);
							const plotWidth = width - leftPad - rightPad;
							const widthPerBucket =
								maxLen <= 1 ? plotWidth : plotWidth / maxLen;

							return (
								<rect
									key={index}
									x={cx - widthPerBucket / 2}
									width={widthPerBucket}
									y={0}
									height={chartHeight}
									fill="transparent"
									onMouseEnter={() => {
										setHoverX(cx);
										setHoverIndex(index);
									}}
									onMouseLeave={() => {
										setHoverX(null);
										setHoverIndex(null);
									}}
								/>
							);
						})}
					</svg>

					{hoverIndex !== null && hoverDate ? (
						<div
							className="oakd-multi-line-chart__tooltip"
							style={{
								left: tooltipLeft,
								top: 10,
							}}
						>
							<Space direction="vertical" gap>
								<Paragraph>
									<strong>
										{parseYmdToLocalDate(hoverDate).toLocaleDateString(
											undefined,
											{
												month: "short",
												day: "numeric",
												year: "numeric",
											},
										)}
									</strong>
								</Paragraph>
								<Paragraph style={{ opacity: 0.7 }}>
									<strong>
										{normalizedLines
											.reduce(
												(sum, line) =>
													sum + getValueAtIndex(line.values, hoverIndex),
												0,
											)
											.toLocaleString()}
									</strong>{" "}
									{hoverLabel || "total"}
								</Paragraph>
								{normalizedLines.map((line, index) => (
									<Space key={index} justify="between" gap wide>
										<Paragraph style={{ color: line.color }}>
											{line.label}
										</Paragraph>
										<Paragraph>
											{getValueAtIndex(
												line.values,
												hoverIndex,
											).toLocaleString()}
										</Paragraph>
									</Space>
								))}
							</Space>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default MultiLineChart;
