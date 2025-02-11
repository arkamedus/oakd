import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Divider from "./Divider";
import { DividerProps } from "./Divider.types";

const meta: Meta<typeof Divider> = {
	title: "Design System/Atomic/Divider",
	component: Divider,
	argTypes: {
		orientation: {
			control: {
				type: "select",
				options: ["horizontal", "vertical"],
			},
		},
		className: {
			control: "text",
		},
	},
};
export default meta;

const Template: StoryFn<DividerProps> = (args) => <Divider {...args} />;

export const Horizontal = Template.bind({});
Horizontal.args = {
	orientation: "horizontal",
};

export const Vertical = Template.bind({});
Vertical.args = {
	orientation: "vertical",
};

export const CustomClass = Template.bind({});
CustomClass.args = {
	className: "custom-class",
};
