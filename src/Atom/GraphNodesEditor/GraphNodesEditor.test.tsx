import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import GraphNodesEditor from "./GraphNodesEditor";
import { OakGraphNodeTypeDefinition } from "../OakGraphNodes/OakGraphNodes.types";

const nodeTypes: Record<string, OakGraphNodeTypeDefinition<any>> = {
	trigger: {
		type: "trigger",
		title: "Trigger",
		inputs: [],
		outputs: [{ id: "tick", label: "tick", direction: "out" }],
	},
	logger: {
		type: "logger",
		title: "Logger",
		inputs: [{ id: "in", label: "in", direction: "in" }],
		outputs: [],
	},
};

describe("GraphNodesEditor", () => {
	it("adds a node from toolbar actions", () => {
		render(<GraphNodesEditor nodeTypes={nodeTypes} />);
		fireEvent.click(screen.getByText("Add Trigger"));
		expect(screen.getByTestId(/GraphNode-/)).toBeInTheDocument();
	});

	it("updates selected node title via inspector", () => {
		render(<GraphNodesEditor nodeTypes={nodeTypes} />);
		fireEvent.click(screen.getByText("Add Trigger"));
		const node = screen.getByTestId(/GraphNode-/);
		fireEvent.mouseDown(node, { clientX: 10, clientY: 10 });
		fireEvent.mouseUp(screen.getByTestId("OakGraphNodes"));

		const titleInput = screen.getByPlaceholderText("Node title");
		fireEvent.change(titleInput, { target: { value: "Run Emails" } });
		expect(screen.getByText("Run Emails")).toBeInTheDocument();
	});
});
