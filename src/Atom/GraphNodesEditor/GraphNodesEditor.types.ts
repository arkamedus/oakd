import { CoreContentProps } from "../../Core/Core.types";
import {
	GraphNode,
	OakGraphEdge,
	OakGraphNodeTypeDefinition,
} from "../GraphNodes/GraphNodes.types";

export interface GraphNodesEditorValue {
	nodes: GraphNode[];
	edges: OakGraphEdge[];
}

export interface GraphNodesEditorProps extends CoreContentProps<HTMLDivElement> {
	nodeTypes: Record<string, OakGraphNodeTypeDefinition<any>>;
	initialNodes?: GraphNode[];
	initialEdges?: OakGraphEdge[];
	onChange?: (value: GraphNodesEditorValue) => void;
}
