import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import GraphNodesEditor from "./GraphNodesEditor";
import { OakGraphNodeTypeDefinition } from "../OakGraphNodes/OakGraphNodes.types";
import Paragraph from "../Paragraph/Paragraph";

const nodeTypes: Record<string, OakGraphNodeTypeDefinition<any>> = {
	trigger: {
		type: "trigger",
		title: "Trigger",
		color: "#4f7cff",
		inputs: [],
		outputs: [{ id: "tick", label: "tick", direction: "out" }],
		renderBody: () => (
			<Paragraph>
				<small>Starts a graph action.</small>
			</Paragraph>
		),
	},
	filter: {
		type: "filter",
		title: "Filter",
		color: "#9d66ff",
		inputs: [{ id: "in", label: "in", direction: "in" }],
		outputs: [{ id: "pass", label: "pass", direction: "out" }],
		renderBody: () => (
			<Paragraph>
				<small>Applies conditions to payloads.</small>
			</Paragraph>
		),
	},
	logger: {
		type: "logger",
		title: "Logger",
		color: "#5cb67d",
		inputs: [{ id: "in", label: "in", direction: "in" }],
		outputs: [],
		renderBody: () => (
			<Paragraph>
				<small>Stores values for audit.</small>
			</Paragraph>
		),
	},
};

const meta: Meta<typeof GraphNodesEditor> = {
	title: "Design System/Atomic/GraphNodesEditor",
	component: GraphNodesEditor,
};

export default meta;
type Story = StoryObj<typeof GraphNodesEditor>;

export const Default: Story = {
	render: () => <GraphNodesEditor nodeTypes={nodeTypes} />,
};
