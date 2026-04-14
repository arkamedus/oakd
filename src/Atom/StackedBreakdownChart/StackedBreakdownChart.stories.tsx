import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import StackedBreakdownChart from "./StackedBreakdownChart";
import Paragraph from "../Paragraph/Paragraph";

const meta: Meta<typeof StackedBreakdownChart> = {
	title: "Design System/Atomic/StackedBreakdownChart",
	component: StackedBreakdownChart,
};

export default meta;

type Story = StoryObj<typeof StackedBreakdownChart>;

export const Default: Story = {
	args: {
		labels: ["Helpful", "Neutral", "Risky"],
		xLabels: [
			<Paragraph key="w1">Week 1</Paragraph>,
			<Paragraph key="w2">Week 2</Paragraph>,
			<Paragraph key="w3">Week 3</Paragraph>,
		],
		rows: [
			{
				key: "week-1",
				labelWeights: { Helpful: 0.5, Neutral: 0.3, Risky: 0.2 },
			},
			{
				key: "week-2",
				labelWeights: { Helpful: 0.6, Neutral: 0.25, Risky: 0.15 },
			},
			{
				key: "week-3",
				labelWeights: { Helpful: 0.42, Neutral: 0.35, Risky: 0.23 },
			},
		],
	},
};

export const Empty: Story = {
	args: {
		labels: [],
		rows: [],
	},
};
