import React from "react";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";
import { scaleColor } from "../Chart/Chart.shared";
import { LabelBarsProps } from "./LabelBars.types";

const LabelBars: React.FC<LabelBarsProps> = ({
	labels,
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
					labels.map((label) => (
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
									style={{
										width: `${Math.max(0, Math.min(100, label.prob * 100))}%`,
										height: "100%",
										borderRadius: 999,
										background: scaleColor(label.prob),
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
