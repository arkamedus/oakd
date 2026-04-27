import React from "react";
import { CoreContentProps } from "../../Core/Core.types";

export type GraphPortDirection = "in" | "out";

export interface OakGraphPort {
	id: string;
	label: string;
	direction: GraphPortDirection;
}

export interface OakGraphNodeTypeDefinition<TData = Record<string, unknown>> {
	type: string;
	title: string;
	color?: string;
	width?: number;
	inputs: OakGraphPort[];
	outputs: OakGraphPort[];
	renderBody?: (args: {
		node: OakGraphNode<TData>;
		data: TData;
		selected: boolean;
	}) => React.ReactNode;
}

export interface OakGraphNode<TData = Record<string, unknown>> {
	id: string;
	type: string;
	title?: string;
	x: number;
	y: number;
	data: TData;
}

export interface OakGraphEdge {
	id: string;
	fromNodeId: string;
	fromPortId: string;
	toNodeId: string;
	toPortId: string;
}

export interface OakGraphConnectEvent {
	fromNodeId: string;
	fromPortId: string;
	toNodeId: string;
	toPortId: string;
}

export interface OakGraphNodesProps
	extends CoreContentProps<HTMLDivElement> {
	nodeTypes: Record<string, OakGraphNodeTypeDefinition<any>>;
	nodes: OakGraphNode[];
	edges: OakGraphEdge[];
	onNodesChange?: (nodes: OakGraphNode[]) => void;
	onEdgesChange?: (edges: OakGraphEdge[]) => void;
	onConnect?: (event: OakGraphConnectEvent) => void;
	selectedNodeId?: string | null;
	onSelectedNodeIdChange?: (nodeId: string | null) => void;
	gridSize?: number;
}
