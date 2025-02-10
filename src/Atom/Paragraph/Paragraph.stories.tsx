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
	render: () => <Paragraph>This is some text.</Paragraph>,
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
			<IconMagnify size={"small"} /> Lorem ipsum <strong>dolor sit</strong>{" "}
			amet, consectetur adipiscing elit. Pellentesque sit amet tellus in{" "}
			<em>urna varius</em> tincidunt et a enim. Duis sit amet eros ut velit
			pharetra fermentum. Sed vel lectus at arcu ultricies luctus a sed neque.
		</Paragraph>
	),
};
