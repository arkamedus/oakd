import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Pill from "./Pill";
const meta: Meta<typeof Pill> = {
	title: "Design System/Atomic/Pill",
	component: Pill,
};
export default meta;
type Story = StoryObj<typeof Pill>;
export const Variations: Story = {
	render: () => (
		<Space direction="vertical" gap wide>
			<Space gap>
				{(["sm", "md", "lg"] as const).map((size) => (
					<Pill key={size} size={size} icon="Plus">
						<Paragraph>{size}</Paragraph>
					</Pill>
				))}
			</Space>
			<Space gap>
				{(
					[
						"default",
						"primary",
						"success",
						"warning",
						"danger",
						"ghost",
					] as const
				).map((variant) => (
					<Pill key={variant} variant={variant}>
						<Paragraph>{variant}</Paragraph>
					</Pill>
				))}
			</Space>
			<Pill wide>
				<Paragraph>Wide pill</Paragraph>
			</Pill>
		</Space>
	),
};
