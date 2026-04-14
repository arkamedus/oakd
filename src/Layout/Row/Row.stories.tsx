import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Row from "./Row";
import Col from "../Column/Column";
import Card from "../../Atom/Card/Card";
import Space from "../../Atom/Space/Space";
import Paragraph from "../../Atom/Paragraph/Paragraph";
import Title from "../../Atom/Title/Title";
import Button from "../../Atom/Button/Button";
import Content from "../Content/Content";
import MultiLineChart from "../../Atom/MultiLineChart/MultiLineChart";
import EmbeddingHeatmap from "../../Atom/EmbeddingHeatmap/EmbeddingHeatmap";
import Aspect from "../Aspect/Aspect";

const meta: Meta<typeof Row> = {
	title: "Design System/Layout/Row",
	component: Row,
};

export default meta;

type Story = StoryObj<typeof Row>;

const noteCard = (title: string, body: string) => (
	<Card pad wide>
		<Space direction="vertical" gap>
			<Paragraph>
				<strong>{title}</strong>
			</Paragraph>
			<Paragraph>{body}</Paragraph>
		</Space>
	</Card>
);

export const Default: Story = {
	render: () => (
		<Row gap>
			<Col xs={24} md={12}>
				{noteCard("Left", "A basic row with two equal columns.")}
			</Col>
			<Col xs={24} md={12}>
				{noteCard("Right", "Each column is correctly sized with `md={12}`.")}
			</Col>
		</Row>
	),
};

export const ThreeColumnSlice: Story = {
	render: () => (
		<Row gap>
			<Col xs={24} md={8}>
				{noteCard("Queue", "Open reviews waiting on billing confirmation.")}
			</Col>
			<Col xs={24} md={8}>
				{noteCard("Context", "The export permissions fix is already live.")}
			</Col>
			<Col xs={24} md={8}>
				{noteCard("Owner", "Maya is covering invoice validation this morning.")}
			</Col>
		</Row>
	),
};

export const EqualHeightCards: Story = {
	render: () => (
		<Row gap>
			<Col xs={24} md={12}>
				<Card pad wide fill>
					<Space direction="vertical" gap wide fill align="stretch">
						<Paragraph>
							<strong>Longer content</strong>
						</Paragraph>
						<Paragraph>
							This card has more text and a second paragraph so it naturally
							takes more space in the column.
						</Paragraph>
						<Paragraph>
							The point of the row is that both columns still read as one
							interface slice.
						</Paragraph>
					</Space>
				</Card>
			</Col>
			<Col xs={24} md={12}>
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
						<Paragraph>Short centered content</Paragraph>
					</Space>
				</Card>
			</Col>
		</Row>
	),
};

export const PrimaryChartAndSupportRail: Story = {
	render: () => (
		<Card pad wide>
			<Row gap>
				<Col xs={24} md={14}>
					<Content grow fill>
						<Space direction="vertical" gap wide fill align="stretch">
							<Paragraph>
								<strong>Primary panel</strong>
							</Paragraph>
							<Paragraph>
								The left column holds the main chart while the right column
								keeps shorter supporting content.
							</Paragraph>
							<Card pad wide>
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
									showVerticalTicks
									smooth
								/>
							</Card>
						</Space>
					</Content>
				</Col>
				<Col xs={24} md={10}>
					<Space direction="vertical" gap wide>
						{noteCard(
							"Support panel",
							"Context cards stay shorter while the main chart takes the larger slice.",
						)}
						<Card pad wide>
							<EmbeddingHeatmap
								embedding={[
									[0.24, 0.32, 0.41, 0.58],
									[0.62, 0.73, 0.28, 0.11],
									[0.84, 0.67, 0.36, 0.29],
								]}
								height={72}
							/>
						</Card>
						<Button variant="primary">Review details</Button>
					</Space>
				</Col>
			</Row>
		</Card>
	),
};

export const PrimaryChartWithGrowingSupportRail: Story = {
	render: () => (
		<Row gap>
			<Col xs={24} md={14}>
				<Content grow fill>
					<Space direction="vertical" gap wide fill align="stretch">
						<Paragraph>
							<strong>Primary panel</strong>
						</Paragraph>
						<Paragraph>
							The primary chart keeps its natural chart height while the support
							rail stretches to match the overall slice.
						</Paragraph>
						<Card pad wide>
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
								showVerticalTicks
								smooth
							/>
						</Card>
					</Space>
				</Content>
			</Col>
			<Col xs={24} md={10}>
				<Content grow fill>
					<Space direction="vertical" gap wide fill grow>
						<Paragraph>
							<strong>Growing support rail</strong>
						</Paragraph>
						<Paragraph>
							The support rail uses the embedding matrix as the element that
							grows to match the primary slice height.
						</Paragraph>
						<Card pad wide grow fill>
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
					</Space>
				</Content>
			</Col>
		</Row>
	),
};
