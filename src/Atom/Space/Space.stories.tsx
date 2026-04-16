import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Space from "./Space";
import Paragraph from "../Paragraph/Paragraph";
import Button from "../Button/Button";
import Card from "../Card/Card";
import Content from "../../Layout/Content/Content";
import Row from "../../Layout/Row/Row";
import Column from "../../Layout/Column/Column";
import MultiLineChart from "../MultiLineChart/MultiLineChart";
import EmbeddingHeatmap from "../EmbeddingHeatmap/EmbeddingHeatmap";
import StackedBreakdownChart from "../StackedBreakdownChart/StackedBreakdownChart";
import LabelBars from "../LabelBars/LabelBars";
import Aspect from "../../Layout/Aspect/Aspect";
import Collapsible from "../Collapsible/Collapsible";
import Title from "../Title/Title";

const meta: Meta<typeof Space> = {
	title: "Design System/Layout/Space",
	component: Space,
	argTypes: {
		gap: { control: "boolean" },
		direction: {
			control: { type: "select" },
			options: ["default", "horizontal", "vertical"],
		},
		align: {
			control: { type: "select" },
			options: ["default", "normal", "center", "start", "end", "stretch"],
		},
		justify: {
			control: { type: "select" },
			options: [
				"default",
				"center",
				"start",
				"end",
				"stretch",
				"around",
				"between",
				"evenly",
			],
		},
	},
	args: {
		gap: true,
		direction: "horizontal",
		align: "default",
		justify: "default",
	},
};

export default meta;

type Story = StoryObj<typeof Space>;

const simpleBox = (text: string, extraStyle?: React.CSSProperties) => (
	<Card pad wide style={extraStyle}>
		<Paragraph>{text}</Paragraph>
	</Card>
);

export const Default: Story = {
	render: (args) => (
		<Space {...args}>
			{simpleBox("Item one")}
			{simpleBox("Item two")}
		</Space>
	),
};

export const WithJustifyBetween: Story = {
	render: () => (
		<Space justify="between" align="center" wide>
			<Paragraph>Left item</Paragraph>
			<Button variant="primary">Right action</Button>
		</Space>
	),
};

export const WithCurrentStretchBehavior: Story = {
	render: () => (
		<Space justify="stretch" gap>
			<Button variant="default">
				<Paragraph>Short</Paragraph>
			</Button>
			<Button variant="default">
				<Paragraph>Longer button label</Paragraph>
			</Button>
			<Button variant="default">
				<Paragraph>
					Two lines
					<br />
					stretch siblings
				</Paragraph>
			</Button>
		</Space>
	),
};

export const VerticalNaturalHeights: Story = {
	render: () => (
		<Row gap>
			<Column xs={24} md={12}>
				<Space direction="vertical" gap wide>
					<Paragraph>Shared first item</Paragraph>
					{simpleBox("Short second item")}
				</Space>
			</Column>
			<Column xs={24} md={12}>
				<Space direction="vertical" gap wide>
					<Paragraph>Shared first item</Paragraph>
					{simpleBox("Taller second item", { minHeight: 180 })}
				</Space>
			</Column>
		</Row>
	),
};

export const VerticalGrowOnSecondChild: Story = {
	render: () => (
		<Aspect ratio="21x9">
			<Card pad wide fill>
				<Content grow fill>
					<Row gap fill>
						<Column xs={24} md={12}>
							<Card pad wide fill>
								<Space direction="vertical" gap wide fill align="stretch">
									<Paragraph>
										Natural second item in a full-height stack
									</Paragraph>
									{simpleBox(
										"The stack fills the panel, but this item keeps its natural height and leaves the remaining space below it.",
										{
											minHeight: 120,
										},
									)}
								</Space>
							</Card>
						</Column>
						<Column xs={24} md={12}>
							<Card pad wide fill>
								<Space direction="vertical" gap wide fill align="stretch">
									<Paragraph>
										Grow on second item in a full-height stack
									</Paragraph>
									<Content grow fill wide>
										<Card pad wide grow fill>
											<Paragraph>
												The stack fills the panel, and this card grows to
												consume the remaining height.
											</Paragraph>
										</Card>
									</Content>
								</Space>
							</Card>
						</Column>
					</Row>
				</Content>
			</Card>
		</Aspect>
	),
};

export const BetweenHeaderAndDisclosure: Story = {
	render: () => (
		<Row gap>
			<Column xs={24} md={12}>
				<Card pad wide fill>
					<Space justify="between" align="center" wide>
						<Paragraph>
							<strong>Queue summary</strong>
						</Paragraph>
						<Button variant="ghost">View all</Button>
					</Space>
				</Card>
			</Column>
			<Column xs={24} md={12}>
				<Card pad wide>
					<Space direction="vertical" gap wide>
						<Paragraph>
							<strong>Release details</strong>
						</Paragraph>
						<Collapsible
							title={
								<Paragraph>
									<strong>Open checklist</strong>
								</Paragraph>
							}
							defaultOpen
						>
							<Content pad>
								<Paragraph>
									Align the title and disclosure naturally while the content
									stays in a separate flow block below.
								</Paragraph>
							</Content>
						</Collapsible>
					</Space>
				</Card>
			</Column>
		</Row>
	),
};

export const CenterAndStretchComparison: Story = {
	render: () => (
		<Aspect ratio="18x9">
			<Card pad wide fill>
				<Row gap fill style={{ height: "100%" }}>
					<Column xs={24} md={10}>
						<Card pad wide fill>
							<Space
								direction="vertical"
								gap
								wide
								fill
								align="center"
								justify="center"
							>
								<Title>Centered status</Title>
								<Paragraph>
									Use `justify=&quot;center&quot;` to center content on the main
									axis and `align=&quot;center&quot;` on the cross axis.
								</Paragraph>
							</Space>
						</Card>
					</Column>
					<Column xs={24} md={14}>
						<Card pad wide fill>
							<Space direction="vertical" gap wide fill align="stretch">
								<Paragraph>
									<strong>Stretching detail rail</strong>
								</Paragraph>
								<Content grow fill wide>
									<Card pad wide fill>
										<Paragraph>
											Use `align=&quot;stretch&quot;` when child surfaces should
											expand to the full cross-axis width, and pair it with a
											grow host only on the child that should absorb remaining
											height.
										</Paragraph>
									</Card>
								</Content>
							</Space>
						</Card>
					</Column>
				</Row>
			</Card>
		</Aspect>
	),
};

export const CenteredSummaryAndCollapsible: Story = {
	render: () => (
		<Row gap>
			<Column xs={24} md={12}>
				<Card pad wide fill>
					<Space
						direction="vertical"
						gap
						wide
						fill
						align="center"
						justify="center"
					>
						<Title>42</Title>
						<Paragraph>Active reviews</Paragraph>
					</Space>
				</Card>
			</Column>
			<Column xs={24} md={12}>
				<Card pad wide>
					<Space direction="vertical" gap wide>
						<Paragraph>
							<strong>Details</strong>
						</Paragraph>
						<Collapsible
							title={
								<Paragraph>
									<strong>Deployment note</strong>
								</Paragraph>
							}
							defaultOpen
						>
							<Content pad>
								<Paragraph>
									The release passed validation, but finance still needs the
									final invoice diff before the note can be closed.
								</Paragraph>
							</Content>
						</Collapsible>
					</Space>
				</Card>
			</Column>
		</Row>
	),
};

export const CenteredMessageAndGrowingDetail: Story = {
	render: () => (
		<Aspect ratio="16x9">
			<Card pad wide fill>
				<Row gap fill style={{ height: "100%" }}>
					<Column xs={24} md={9}>
						<Card pad wide fill>
							<Space
								direction="vertical"
								gap
								wide
								fill
								align="center"
								justify="center"
							>
								<Title>Launch ready</Title>
								<Paragraph>
									The left side stays visually centered while the right side
									grows into the remaining height.
								</Paragraph>
							</Space>
						</Card>
					</Column>
					<Column xs={24} md={15}>
						<Card pad wide fill>
							<Space direction="vertical" gap wide fill align="stretch">
								<Paragraph>
									<strong>Growing detail panel</strong>
								</Paragraph>
								<Content grow wide>
									<Card pad wide fill>
										<Paragraph>
											This detail surface is the grow item. Use this pattern
											when one side should stay centered and the other side
											should consume the extra height.
										</Paragraph>
									</Card>
								</Content>
							</Space>
						</Card>
					</Column>
				</Row>
			</Card>
		</Aspect>
	),
};

export const ChartFillComparison: Story = {
	render: () => (
		<Card pad wide>
			<Row gap>
				<Column xs={24} md={14}>
					<Content grow>
						<Space direction="vertical" gap wide fill align="stretch">
							<Paragraph>
								<strong>Primary panel</strong>
							</Paragraph>
							<Paragraph>
								A short summary stays fixed while the main chart region takes
								the remaining space.
							</Paragraph>
							<Content grow wide>
								<Card pad wide fill>
									<MultiLineChart
										lines={[
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
										]}
										hoverLabel="events"
										fill
										showVerticalTicks
										smooth
									/>
								</Card>
							</Content>
						</Space>
					</Content>
				</Column>
				<Column xs={24} md={10}>
					<Content grow>
						<Space direction="vertical" gap wide fill align="stretch">
							<Paragraph>
								<strong>Supporting panels</strong>
							</Paragraph>
							<Paragraph>
								These stay in the same interface slice, but stack naturally as
								supporting views.
							</Paragraph>
							<StackedBreakdownChart
								labels={["Helpful", "Neutral", "Risky"]}
								xLabels={[
									<Paragraph key="w1">Week 1</Paragraph>,
									<Paragraph key="w2">Week 2</Paragraph>,
									<Paragraph key="w3">Week 3</Paragraph>,
								]}
								rows={[
									{
										key: "week-1",
										labelWeights: {
											Helpful: 0.52,
											Neutral: 0.28,
											Risky: 0.2,
										},
									},
									{
										key: "week-2",
										labelWeights: {
											Helpful: 0.57,
											Neutral: 0.24,
											Risky: 0.19,
										},
									},
									{
										key: "week-3",
										labelWeights: {
											Helpful: 0.61,
											Neutral: 0.21,
											Risky: 0.18,
										},
									},
								]}
							/>
							<EmbeddingHeatmap
								embedding={[
									[0.24, 0.32, 0.41, 0.58],
									[0.62, 0.73, 0.28, 0.11],
									[0.84, 0.67, 0.36, 0.29],
								]}
								height={72}
							/>
							<LabelBars
								labels={[
									{ label: "Helpful", prob: 0.68 },
									{ label: "Neutral", prob: 0.22 },
									{ label: "Risky", prob: 0.1 },
								]}
							/>
						</Space>
					</Content>
				</Column>
			</Row>
		</Card>
	),
};

export const StackedBreakdownAsPrimaryPanel: Story = {
	render: () => (
		<Card pad wide>
			<Row gap>
				<Column xs={24} md={14}>
					<Content grow>
						<Space direction="vertical" gap wide fill align="stretch">
							<Paragraph>
								<strong>Primary panel</strong>
							</Paragraph>
							<Paragraph>
								The summary stays fixed while the weekly breakdown expands as
								the main view.
							</Paragraph>
							<Content grow wide>
								<Card pad wide fill>
									<StackedBreakdownChart
										labels={["Helpful", "Neutral", "Risky"]}
										xLabels={[
											<Paragraph key="w1">Week 1</Paragraph>,
											<Paragraph key="w2">Week 2</Paragraph>,
											<Paragraph key="w3">Week 3</Paragraph>,
											<Paragraph key="w4">Week 4</Paragraph>,
										]}
										rows={[
											{
												key: "week-1",
												labelWeights: {
													Helpful: 0.44,
													Neutral: 0.34,
													Risky: 0.22,
												},
											},
											{
												key: "week-2",
												labelWeights: {
													Helpful: 0.53,
													Neutral: 0.29,
													Risky: 0.18,
												},
											},
											{
												key: "week-3",
												labelWeights: {
													Helpful: 0.48,
													Neutral: 0.32,
													Risky: 0.2,
												},
											},
											{
												key: "week-4",
												labelWeights: {
													Helpful: 0.58,
													Neutral: 0.26,
													Risky: 0.16,
												},
											},
										]}
									/>
								</Card>
							</Content>
						</Space>
					</Content>
				</Column>
				<Column xs={24} md={10}>
					<Content grow>
						<Space direction="vertical" gap wide fill align="stretch">
							<Paragraph>
								<strong>Supporting panels</strong>
							</Paragraph>
							<Paragraph>
								These remain natural-height detail views within the same
								interface slice.
							</Paragraph>
							<Content grow wide>
								<EmbeddingHeatmap
									fill
									embedding={[
										[0.22, 0.31, 0.42, 0.53],
										[0.61, 0.74, 0.29, 0.14],
										[0.79, 0.66, 0.37, 0.2],
									]}
								/>
							</Content>
							<LabelBars
								labels={[
									{ label: "Helpful", prob: 0.58 },
									{ label: "Neutral", prob: 0.26 },
									{ label: "Risky", prob: 0.16 },
								]}
							/>
						</Space>
					</Content>
				</Column>
			</Row>
		</Card>
	),
};

export const EmbeddingAsPrimaryPanel: Story = {
	render: () => (
		<Card pad wide>
			<Row gap>
				<Column xs={24} md={14}>
					<Content grow>
						<Space direction="vertical" gap wide fill align="stretch">
							<Paragraph>
								<strong>Primary panel</strong>
							</Paragraph>
							<Paragraph>
								The matrix stretches as the main inspection surface while the
								note and legend stay fixed.
							</Paragraph>
							<Content grow wide>
								<Card pad wide fill>
									<EmbeddingHeatmap
										fill
										embedding={[
											[0.12, 0.2, 0.31, 0.42, 0.5, 0.58],
											[0.64, 0.71, 0.48, 0.26, 0.15, 0.09],
											[0.82, 0.77, 0.54, 0.33, 0.21, 0.12],
											[0.73, 0.62, 0.44, 0.29, 0.19, 0.1],
										]}
									/>
								</Card>
							</Content>
						</Space>
					</Content>
				</Column>
				<Column xs={24} md={10}>
					<Content grow>
						<Space direction="vertical" gap wide>
							<Paragraph>
								<strong>Supporting panels</strong>
							</Paragraph>
							<Paragraph>
								Secondary views keep their natural size and do not drive the
								overall panel height.
							</Paragraph>
							<MultiLineChart
								lines={[
									{
										label: "Similarity",
										values: [
											{ x: "2026-04-01", y: 11 },
											{ x: "2026-04-02", y: 14 },
											{ x: "2026-04-03", y: 13 },
											{ x: "2026-04-04", y: 17 },
										],
									},
								]}
								showVerticalTicks
							/>
							<LabelBars
								labels={[
									{ label: "Cluster A", prob: 0.51 },
									{ label: "Cluster B", prob: 0.32 },
									{ label: "Cluster C", prob: 0.17 },
								]}
							/>
						</Space>
					</Content>
				</Column>
			</Row>
		</Card>
	),
};
