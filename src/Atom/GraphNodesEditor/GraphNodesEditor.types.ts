import { CoreContentProps } from "../../Core/Core.types";
import {
	OakGraphEdge,
	OakGraphNode,
	OakGraphNodeTypeDefinition,
} from "../OakGraphNodes/OakGraphNodes.types";

export interface GraphNodesEditorValue {
	nodes: OakGraphNode[];
	edges: OakGraphEdge[];
}

export interface GraphNodesEditorProps extends CoreContentProps<HTMLDivElement> {
	nodeTypes: Record<string, OakGraphNodeTypeDefinition<any>>;
	initialNodes?: OakGraphNode[];
	initialEdges?: OakGraphEdge[];
	onChange?: (value: GraphNodesEditorValue) => void;
}
