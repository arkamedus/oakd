import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Aspect from "./Aspect";
import DebugLayer from "../../Atom/DebugLayer/DebugLayer";

const meta: Meta<typeof Aspect> = {
	title: "Design System/Layout/Aspect",
	component: Aspect,
	argTypes: {
		ratio: {
			control: { type: "select" },
			options: [
				"1x1",
				"16x9",
				"4x3",
				"3x2",
				"21x9",
				"9x16",
				"2x1",
				"3x4",
				"5x4",
				"32x9",
				"1x2",
			],
		},
	},
} as Meta<typeof Aspect>;
export default meta;

const Template: StoryFn<typeof Aspect> = (args) => (
	<Aspect {...args}>
		<DebugLayer label={args.ratio} style={{ height: "100%" }} />
	</Aspect>
);

export const Default = Template.bind({});
Default.args = { ratio: "16x9" };

export const Square = Template.bind({});
Square.args = { ratio: "1x1" };

export const Wide = Template.bind({});
Wide.args = { ratio: "21x9" };

export const Tall = Template.bind({});
Tall.args = { ratio: "9x16" };
