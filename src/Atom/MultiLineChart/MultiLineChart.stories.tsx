import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import MultiLineChart from "./MultiLineChart";
import Card from "../Card/Card";
import Content from "../../Layout/Content/Content";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";

const meta: Meta<typeof MultiLineChart> = {
	title: "Design System/Atomic/MultiLineChart",
	component: MultiLineChart,
};

export default meta;

type Story = StoryObj<typeof MultiLineChart>;

const lines = [
	{
		label: "Signups",
		values: [
			{ x: "2026-04-01", y: 18 },
			{ x: "2026-04-02", y: 24 },
			{ x: "2026-04-03", y: 28 },
			{ x: "2026-04-04", y: 31 },
		],
	},
	{
		label: "Activations",
		values: [
			{ x: "2026-04-01", y: 12 },
			{ x: "2026-04-02", y: 16 },
			{ x: "2026-04-03", y: 22 },
			{ x: "2026-04-04", y: 20 },
		],
	},
];

export const Default: Story = {
	args: {
		lines,
		hoverLabel: "events",
	},
};

export const WithSmoothLines: Story = {
	args: {
		lines,
		hoverLabel: "events",
		smooth: true,
		showVerticalTicks: true,
		showHorizontalTicks: true,
		showXAxisLabels: true,
		showYAxisLabels: true,
		xLabels: ["Apr 1", "Apr 2", "Apr 3", "Apr 4"],
	},
};

export const WithAxisLabels: Story = {
	args: {
		lines,
		hoverLabel: "events",
		showXAxisLabels: true,
		showYAxisLabels: true,
		xLabels: ["Apr 1", "Apr 2", "Apr 3", "Apr 4"],
		yLabels: [
			{ value: 31, label: "31" },
			{ value: 16, label: "16" },
			{ value: 0, label: "0" },
		],
	},
};

export const WithAxisGuides: Story = {
	args: {
		lines,
		hoverLabel: "events",
		showVerticalTicks: true,
		showHorizontalTicks: true,
		showXAxisLabels: true,
		showYAxisLabels: true,
		xLabels: ["Apr 1", "Apr 2", "Apr 3", "Apr 4"],
		yLabels: [
			{ value: 31, label: "31" },
			{ value: 16, label: "16" },
			{ value: 0, label: "0" },
		],
	},
};

export const WithCustomHeight: Story = {
	args: {
		lines,
		hoverLabel: "events",
		height: 320,
		showVerticalTicks: true,
		smooth: true,
	},
};

export const FillContainer: Story = {
	render: () => (
		<Card pad wide>
			<Content fill style={{ height: 360 }}>
				<Space direction="vertical" gap wide fill align="stretch">
					<Paragraph>
						<strong>Primary chart</strong>
					</Paragraph>
					<Content grow fill wide>
						<Card pad wide grow fill>
							<MultiLineChart
								lines={lines}
								hoverLabel="events"
								fill
								showVerticalTicks
								smooth
							/>
						</Card>
					</Content>
				</Space>
			</Content>
		</Card>
	),
};
