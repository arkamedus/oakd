import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import LabelBars from "./LabelBars";

const meta: Meta<typeof LabelBars> = {
	title: "Design System/Atomic/LabelBars",
	component: LabelBars,
};

export default meta;

type Story = StoryObj<typeof LabelBars>;

export const Default: Story = {
	args: {
		labels: [
			{ label: "Support", prob: 0.84 },
			{ label: "Billing", prob: 0.56 },
			{ label: "Account setup", prob: 0.31 },
		],
	},
};

export const Empty: Story = {
	args: {
		labels: [],
	},
};
