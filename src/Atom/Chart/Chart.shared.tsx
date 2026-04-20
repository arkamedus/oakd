import React from "react";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";

export const CHART_PASTEL_COLORS = [
	"#A0C4FF",
	"#BDB2FF",
	"#FFC6FF",
	"#FF8FA3",
	"#9BF6FF",
	"#7FD8BE",
	"#FFADAD",
	"#CDB4DB",
	"#F15BB5",
	"#00BBF9",
	"#00D4B8",
	"#5EC2B7",
	"#8EDFCC",
	"#F9BEC7",
	"#E0BBE4",
	"#D0CFFF",
];

export function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

export function getChartColor(index: number) {
	return CHART_PASTEL_COLORS[index % CHART_PASTEL_COLORS.length];
}

export function viridisColor(t: number) {
	const stops = [
		[88, 42, 118],
		[88, 108, 172],
		[58, 165, 164],
		[120, 210, 118],
		[249, 226, 78],
	];

	const clamped = Math.max(0, Math.min(1, t));
	const x = clamped * (stops.length - 1);
	const i = Math.floor(x);
	const f = x - i;

	const a = stops[i] ?? stops[0];
	const b = stops[Math.min(i + 1, stops.length - 1)] ?? stops[stops.length - 1];

	const r = Math.round(lerp(a[0], b[0], f));
	const g = Math.round(lerp(a[1], b[1], f));
	const bl = Math.round(lerp(a[2], b[2], f));

	return `rgb(${r}, ${g}, ${bl})`;
}

export function scaleColor(t: number) {
	const clamped = Math.max(0, Math.min(1, t));

	if (clamped <= 0.5) {
		const local = clamped / 0.5;
		const r = 255;
		const g = Math.round(lerp(86, 180, local));
		return `rgb(${r}, ${Math.max(0, g)}, 0)`;
	}

	const local = (clamped - 0.5) / 0.5;
	const r = Math.round(lerp(255, 0, local));
	const g = Math.round(lerp(180, 210, local));
	return `rgb(${Math.max(0, r)}, ${Math.min(255, g)}, 0)`;
}

export const ChartHeader: React.FC<{
	title?: React.ReactNode;
	subtitle?: React.ReactNode;
}> = ({ title, subtitle }) =>
	title || subtitle ? (
		<Space direction="vertical" gap>
			{title ? (
				<Paragraph>
					<strong>{title}</strong>
				</Paragraph>
			) : null}
			{subtitle ? (
				<Paragraph style={{ opacity: 0.7 }}>{subtitle}</Paragraph>
			) : null}
		</Space>
	) : null;

export const ChartLegend: React.FC<{
	items: Array<{ label: React.ReactNode; color: string }>;
}> = ({ items }) => (
	<Space gap style={{ flexWrap: "wrap" }}>
		{items.map((item, index) => (
			<Space key={index} gap align="center">
				<span
					aria-hidden="true"
					style={{
						width: 10,
						height: 10,
						borderRadius: 999,
						background: item.color,
						flexShrink: 0,
					}}
				/>
				<Paragraph>{item.label}</Paragraph>
			</Space>
		))}
	</Space>
);

export const ChartAxisLabel: React.FC<{
	children: React.ReactNode;
	align?: "left" | "center" | "right";
}> = ({ children, align = "center" }) => (
	<Paragraph
		className="oakd-chart-axis-label"
		style={{
			opacity: 0.7,
			fontSize: "0.6em",
			textAlign: align,
		}}
	>
		{children}
	</Paragraph>
);
