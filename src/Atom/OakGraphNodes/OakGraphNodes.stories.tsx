import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import OakGraphNodes from "./OakGraphNodes";
import {
	OakGraphEdge,
	OakGraphNode,
	OakGraphNodeTypeDefinition,
} from "./OakGraphNodes.types";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Card from "../Card/Card";

const nodeTypes: Record<string, OakGraphNodeTypeDefinition<any>> = {
	input: {
		type: "input",
		title: "Input",
		color: "#4f7cff",
		inputs: [],
		outputs: [{ id: "out", label: "value", direction: "out" }],
		renderBody: () => (
			<Paragraph>
				<small>Produces a signal.</small>
			</Paragraph>
		),
	},
	mix: {
		type: "mix",
		title: "Mix",
		color: "#ff8f4f",
		inputs: [
			{ id: "a", label: "a", direction: "in" },
			{ id: "b", label: "b", direction: "in" },
		],
		outputs: [{ id: "out", label: "mixed", direction: "out" }],
		renderBody: () => (
			<Paragraph>
				<small>Combines two values.</small>
			</Paragraph>
		),
	},
	output: {
		type: "output",
		title: "Output",
		color: "#69b870",
		inputs: [{ id: "in", label: "in", direction: "in" }],
		outputs: [],
	},
};

const initialNodes: OakGraphNode[] = [
	{ id: "node-a", type: "input", x: 40, y: 120, data: {}, title: "Input A" },
	{ id: "node-b", type: "mix", x: 330, y: 160, data: {}, title: "Mix" },
	{ id: "node-c", type: "output", x: 650, y: 210, data: {}, title: "Output" },
];

const initialEdges: OakGraphEdge[] = [
	{
		id: "edge-a-b",
		fromNodeId: "node-a",
		fromPortId: "out",
		toNodeId: "node-b",
		toPortId: "a",
	},
	{
		id: "edge-b-c",
		fromNodeId: "node-b",
		fromPortId: "out",
		toNodeId: "node-c",
		toPortId: "in",
	},
];

const meta: Meta<typeof OakGraphNodes> = {
	title: "Design System/Atomic/OakGraphNodes",
	component: OakGraphNodes,
};

export default meta;
type Story = StoryObj<typeof OakGraphNodes>;

export const ConfigurableNodes: Story = {
	render: () => {
		const [nodes, setNodes] = useState(initialNodes);
		const [edges, setEdges] = useState(initialEdges);
		const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

		return (
			<Space direction="vertical" gap wide>
				<Card pad wide>
					<Paragraph>
						Click an output port, then click an input port to connect nodes.
					</Paragraph>
				</Card>
				<OakGraphNodes
					nodes={nodes}
					edges={edges}
					nodeTypes={nodeTypes}
					onNodesChange={setNodes}
					onEdgesChange={setEdges}
					selectedNodeId={selectedNodeId}
					onSelectedNodeIdChange={setSelectedNodeId}
				/>
			</Space>
		);
	},
};
