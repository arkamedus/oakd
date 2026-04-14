import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import LabelBars from "./LabelBars";

const meta: Meta<typeof LabelBars> = {
	title: "Design System/Atomic/LabelBars",
	component: LabelBars,
	argTypes: {
		colorMode: {
			control: "radio",
			options: ["label", "scale"],
		},
	},
};

export default meta;

type Story = StoryObj<typeof LabelBars>;

export const Default: Story = {
	args: {
		labels: [
			{ label: "Full Support", prob: 0.99 },
			{ label: "Support", prob: 0.84 },
			{ label: "Billing", prob: 0.56 },
			{ label: "Account setup", prob: 0.31 },
			{ label: "Near Zero", prob: 0.01 },
		],
	},
};

export const WithScalarColors: Story = {
	args: {
		labels: [
			{ label: "Full Support", prob: 0.99 },
			{ label: "Support", prob: 0.84 },
			{ label: "Billing", prob: 0.56 },
			{ label: "Account setup", prob: 0.31 },
			{ label: "Near Zero", prob: 0.01 },
		],
		colorMode: "scale",
	},
};

export const Empty: Story = {
	args: {
		labels: [],
	},
};
