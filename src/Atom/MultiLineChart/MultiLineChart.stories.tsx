import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import MultiLineChart from "./MultiLineChart";

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
	},
};
