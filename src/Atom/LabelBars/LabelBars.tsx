import React from "react";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";
import { getChartColor } from "../Chart/Chart.shared";
import { LabelBarsProps } from "./LabelBars.types";

const softScaleColor = (t: number) => {
	const clamped = Math.max(0, Math.min(1, t));

	if (clamped <= 0.5) {
		const local = clamped / 0.5;
		const r = 255;
		const g = Math.round(143 + (220 - 143) * local);
		const b = Math.round(163 + (130 - 163) * local);
		return `rgb(${r}, ${g}, ${b})`;
	}

	const local = (clamped - 0.5) / 0.5;
	const r = Math.round(255 - 95 * local);
	const g = Math.round(220 + 15 * local);
	const b = Math.round(130 + 70 * local);
	return `rgb(${r}, ${g}, ${b})`;
};

const LabelBars: React.FC<LabelBarsProps> = ({
	labels,
	colorMode = "label",
	className = "",
	style,
}) => {
	return (
		<div
			className={["oakd", "wide", "oakd-label-bars", className]
				.filter(Boolean)
				.join(" ")}
			style={style}
		>
			<Space direction="vertical" gap wide>
				{labels.length ? (
					labels.map((label, index) => (
						<Space direction="vertical" gap key={label.label} wide>
							<Space justify="between" wide>
								<Paragraph>{label.label}</Paragraph>
								<Paragraph>{(label.prob * 100).toFixed(1)}%</Paragraph>
							</Space>
							<div
								style={{
									width: "100%",
									height: 10,
									borderRadius: 999,
									background: "rgba(0,0,0,0.08)",
									overflow: "hidden",
								}}
							>
								<div
									data-testid={`LabelBarFill-${label.label}`}
									style={{
										width: `${Math.max(0, Math.min(100, label.prob * 100))}%`,
										height: "100%",
										borderRadius: 999,
										background:
											colorMode === "scale"
												? softScaleColor(label.prob)
												: getChartColor(index),
									}}
								/>
							</div>
						</Space>
					))
				) : (
					<Paragraph>No label guesses.</Paragraph>
				)}
			</Space>
		</div>
	);
};

export default LabelBars;
