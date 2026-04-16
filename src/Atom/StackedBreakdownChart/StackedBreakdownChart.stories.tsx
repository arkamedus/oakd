import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import StackedBreakdownChart from "./StackedBreakdownChart";
import Paragraph from "../Paragraph/Paragraph";
import Card from "../Card/Card";
import Content from "../../Layout/Content/Content";
import Space from "../Space/Space";

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
		showXAxisLabels: true,
		showHover: true,
	},
};

export const Empty: Story = {
	args: {
		labels: [],
		rows: [],
	},
};

export const WithoutXAxisLabels: Story = {
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
		showXAxisLabels: false,
		showHover: true,
	},
};

export const WithoutHover: Story = {
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
		showXAxisLabels: true,
		showHover: false,
	},
};

export const WithCustomHeight: Story = {
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
		height: 320,
		showHover: true,
	},
};

export const FillContainer: Story = {
	render: () => (
		<Card pad wide>
			<Content fill style={{ height: 360 }}>
				<Space direction="vertical" gap wide fill align="stretch">
					<Paragraph>
						<strong>Breakdown view</strong>
					</Paragraph>
					<Content grow fill wide>
						<Card pad wide grow fill>
							<StackedBreakdownChart
								fill
								labels={["Helpful", "Neutral", "Risky"]}
								xLabels={[
									<Paragraph key="w1">Week 1</Paragraph>,
									<Paragraph key="w2">Week 2</Paragraph>,
									<Paragraph key="w3">Week 3</Paragraph>,
								]}
								rows={[
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
								]}
							/>
						</Card>
					</Content>
				</Space>
			</Content>
		</Card>
	),
};
