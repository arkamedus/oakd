import React, { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import OakGraphNodes from "./OakGraphNodes";
import {
	OakGraphEdge,
	OakGraphNode,
	OakGraphNodeTypeDefinition,
} from "./OakGraphNodes.types";

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

const nodes: OakGraphNode[] = [
	{ id: "n1", type: "a", x: 20, y: 20, data: {} },
	{ id: "n2", type: "b", x: 300, y: 20, data: {} },
];

const edges: OakGraphEdge[] = [];

describe("OakGraphNodes", () => {
	it("connects output and input ports", () => {
		const onEdgesChange = jest.fn();
		const onConnect = jest.fn();
		render(
			<OakGraphNodes
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
				<OakGraphNodes
					nodes={localNodes}
					edges={edges}
					nodeTypes={nodeTypes}
					onNodesChange={setLocalNodes}
				/>
			);
		};

		render(<Harness />);
		const node = screen.getByTestId("GraphNode-n1");
		const host = screen.getByTestId("OakGraphNodes");

		fireEvent.mouseDown(node, { clientX: 20, clientY: 20 });
		fireEvent.mouseMove(host, { clientX: 70, clientY: 60 });
		fireEvent.mouseUp(host);

		expect(node.getAttribute("style")).toContain("translate(70px, 60px)");
	});
});
