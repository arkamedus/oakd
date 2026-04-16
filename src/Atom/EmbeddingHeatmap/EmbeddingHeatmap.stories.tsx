import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import EmbeddingHeatmap from "./EmbeddingHeatmap";

const strip64 = Array.from({ length: 16 }, (_, index) => {
	const wave = Math.sin(index / 5) * 0.28 + 0.5;
	const slope = (index % 8) / 20;
	return Number(Math.max(0.04, Math.min(0.96, wave + slope - 0.18)).toFixed(2));
});

const matrix16x16 = Array.from({ length: 16 }, (_, row) =>
	Array.from({ length: 16 }, (_, col) => {
		const radial = Math.cos((row + col) / 5) * 0.18 + 0.5;
		const diagonal = (row * 0.03 + col * 0.02) % 0.4;
		return Number(
			Math.max(0.03, Math.min(0.97, radial + diagonal - 0.08)).toFixed(2),
		);
	}),
);

const meta: Meta<typeof EmbeddingHeatmap> = {
	title: "Design System/Atomic/EmbeddingHeatmap",
	component: EmbeddingHeatmap,
};

export default meta;

type Story = StoryObj<typeof EmbeddingHeatmap>;

export const Default: Story = {
	args: {
		embedding: strip64,
	},
};

export const WithMatrixEmbedding: Story = {
	args: {
		height: 256,
		embedding: matrix16x16,
	},
};
