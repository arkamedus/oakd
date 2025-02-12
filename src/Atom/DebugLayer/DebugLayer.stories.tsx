import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import DebugLayer from "./DebugLayer";
import {IconSliders} from "../../Icon/Icons.bin";

const meta: Meta<typeof DebugLayer> = {
	title: "Design System/Atomic/DebugLayer",
	component: DebugLayer,
	parameters: {
		docs: {
			description: {
				component:
					"The DebugLayer component visually outlines its children for debugging layout issues.",
			},
		},
	},
};

export default meta;

const Template: StoryFn<typeof DebugLayer> = (args) => <DebugLayer {...args} />;

export const Default = Template.bind({});
Default.args = {
	label: "DebugLayer",
};

export const Extra = Template.bind({});
Default.args = {
	label: "DebugLayer",
	extra: <IconSliders size={"small"}/>
};
