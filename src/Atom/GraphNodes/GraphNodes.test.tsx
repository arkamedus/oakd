import React, { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import GraphNodes from "./GraphNodes";
import {
	GraphNode,
	OakGraphEdge,
	OakGraphNodeTypeDefinition,
} from "./GraphNodes.types";

const nodeTypes: Record<string, OakGraphNodeTypeDefinition<any>> = {
	a: {
		type: "a",
		title: "A",
		inputs: [],
		outputs: [{ id: "out", label: "out", direction: "out" }],
	},
	b: {
		type: "b",
		title: "B",
		inputs: [{ id: "in", label: "in", direction: "in" }],
		outputs: [],
	},
};

const nodes: GraphNode[] = [
	{ id: "n1", type: "a", x: 20, y: 20, data: {} },
	{ id: "n2", type: "b", x: 300, y: 20, data: {} },
];

const edges: OakGraphEdge[] = [];

describe("GraphNodes", () => {
	it("connects output and input ports", () => {
		const onEdgesChange = jest.fn();
		const onConnect = jest.fn();
		render(
			<GraphNodes
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
			/>,
		);

		fireEvent.click(screen.getByTestId("GraphPort-out-n1-out"));
		fireEvent.click(screen.getByTestId("GraphPort-in-n2-in"));

		expect(onEdgesChange).toHaveBeenCalledTimes(1);
		expect(onConnect).toHaveBeenCalledWith({
			fromNodeId: "n1",
			fromPortId: "out",
			toNodeId: "n2",
			toPortId: "in",
		});
	});

	it("supports dragging nodes via onNodesChange", () => {
		const Harness = () => {
			const [localNodes, setLocalNodes] = useState(nodes);
			return (
				<GraphNodes
					nodes={localNodes}
					edges={edges}
					nodeTypes={nodeTypes}
					onNodesChange={setLocalNodes}
				/>
			);
		};

		render(<Harness />);
		const node = screen.getByTestId("GraphNode-n1");
		const host = screen.getByTestId("GraphNodes");

		fireEvent.mouseDown(node, { clientX: 20, clientY: 20 });
		fireEvent.mouseMove(host, { clientX: 70, clientY: 60 });
		fireEvent.mouseUp(host);

		expect(node.getAttribute("style")).toContain("translate(70px, 60px)");
	});
});
