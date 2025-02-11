import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Collapsible from "./Collapsible";
import Button from "../Button/Button";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import DebugLayer from "../DebugLayer/DebugLayer";

const meta: Meta<typeof Collapsible> = {
	title: "Design System/Atomic/Collapsible",
	component: Collapsible,
	argTypes: {
		defaultOpen: { control: "boolean" },
	},
};
export default meta;

const Template: StoryFn<typeof Collapsible> = (args) => (
	<Collapsible {...args} />
);

export const Default = Template.bind({});
Default.args = {
	title: "Show more information",
	children: (
		<DebugLayer label={"DebugLayer inside Collapsible"}>
			<Paragraph>Here is some more information.</Paragraph>
		</DebugLayer>
	),
	action: (
		<Button size="small">
			<Paragraph>Button</Paragraph>
		</Button>
	),
};

export const Multiple = () => (
	<Space direction="vertical" gap>
		<Collapsible
			title={"Collapsible 1"}
			defaultOpen={true}
			children={
				<DebugLayer label={"DebugLayer inside Collapsible 1"}>
					<Paragraph>Content of Collapsible 1.</Paragraph>
				</DebugLayer>
			}
		/>
		<Collapsible
			title={"Collapsible 2"}
			children={
				<DebugLayer label={"DebugLayer inside Collapsible 2"}>
					<Paragraph>Content of Collapsible 2.</Paragraph>
				</DebugLayer>
			}
		/>
	</Space>
);
