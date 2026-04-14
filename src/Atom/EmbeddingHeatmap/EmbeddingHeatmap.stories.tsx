import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import EmbeddingHeatmap from "./EmbeddingHeatmap";

const meta: Meta<typeof EmbeddingHeatmap> = {
	title: "Design System/Atomic/EmbeddingHeatmap",
	component: EmbeddingHeatmap,
};

export default meta;

type Story = StoryObj<typeof EmbeddingHeatmap>;

export const Default: Story = {
	args: {
		embedding: [0.12, 0.44, 0.87, 0.22, 0.55, 0.91, 0.31],
	},
};

export const WithMatrixEmbedding: Story = {
	args: {
		height: 120,
		embedding: [
			[0.12, 0.44, 0.87, 0.22],
			[0.55, 0.91, 0.31, 0.14],
			[0.68, 0.19, 0.49, 0.73],
		],
	},
};
