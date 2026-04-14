import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Paragraph from "./Paragraph";
import { IconMagnify } from "../../Icon/Icons.bin";

const meta: Meta<typeof Paragraph> = {
	title: "Design System/Atomic/Typography/Paragraph",
	component: Paragraph,
	argTypes: {
		children: { control: "text" },
		className: { control: "text" },
		style: { control: "object" },
	},
};
export default meta;
type Story = StoryObj<typeof Paragraph>;

export const Default: Story = {
	render: () => (
		<Paragraph>
			Paragraph text should read like product copy, not placeholder filler.
		</Paragraph>
	),
};

export const SmallText: Story = {
	render: () => (
		<Paragraph>
			<small>This is small text.</small>
		</Paragraph>
	),
};

export const StrongText: Story = {
	render: () => (
		<Paragraph>
			<strong>This is strong text.</strong>
		</Paragraph>
	),
};

export const EmphasizedText: Story = {
	render: () => (
		<Paragraph>
			<em>This is emphasized text.</em>
		</Paragraph>
	),
};

export const LongText: Story = {
	render: () => (
		<Paragraph>
			<IconMagnify size={"small"} /> Search indexes update every 15 minutes, so
			recent changes may take a moment to appear in results. Use{" "}
			<strong>filters</strong> to narrow large datasets and <em>saved views</em>{" "}
			to preserve your working context.
		</Paragraph>
	),
};
