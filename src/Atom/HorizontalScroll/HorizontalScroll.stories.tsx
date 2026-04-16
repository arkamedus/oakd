import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import HorizontalScroll from "./HorizontalScroll";
import Card from "../Card/Card";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Button from "../Button/Button";
import Icon from "../../Icon/Icon";

const meta: Meta<typeof HorizontalScroll> = {
	title: "Design System/Atomic/HorizontalScroll",
	component: HorizontalScroll,
};

export default meta;

type Story = StoryObj<typeof HorizontalScroll>;

const itemCard = (label: string) => (
	<Card pad style={{ width: 140, height: 140 }}>
		<Space direction="vertical" gap wide fill justify="center" align="center">
			<Paragraph>
				<strong>{label}</strong>
			</Paragraph>
			<Paragraph>{label} details</Paragraph>
		</Space>
	</Card>
);

export const Default: Story = {
	render: () => (
		<HorizontalScroll gap wide>
			{Array.from({ length: 6 }, (_, index) => itemCard(`Item ${index + 1}`))}
		</HorizontalScroll>
	),
};

export const CardFeed: Story = {
	render: () => (
		<HorizontalScroll gap wide>
			{Array.from({ length: 12 }, (_, index) => itemCard(`Card ${index + 1}`))}
		</HorizontalScroll>
	),
};

export const WithCenteredIconItem: Story = {
	render: () => (
		<HorizontalScroll gap wide>
			{Array.from({ length: 5 }, (_, index) => itemCard(`Item ${index + 1}`))}
			<Card pad style={{ width: 140, height: 140 }}>
				<Space
					direction="vertical"
					gap
					wide
					fill
					justify="center"
					align="center"
				>
					<Icon name="Plus" />
					<Paragraph>Add new</Paragraph>
				</Space>
			</Card>
		</HorizontalScroll>
	),
};

export const MixedSurfaceRail: Story = {
	render: () => (
		<HorizontalScroll gap wide>
			<Card pad style={{ width: 180, height: 140 }}>
				<Space direction="vertical" gap wide fill>
					<Paragraph>
						<strong>Summary</strong>
					</Paragraph>
					<Paragraph>Recent activity across the feed.</Paragraph>
				</Space>
			</Card>
			{itemCard("Asset 1")}
			<Button variant="active" style={{ width: 140, height: 140 }}>
				<Paragraph>Selected action</Paragraph>
			</Button>
			{itemCard("Asset 2")}
		</HorizontalScroll>
	),
};
