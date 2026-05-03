import React, { useEffect, useMemo, useState } from "react";
import "./GraphNodesEditor.css";
import { GraphNodesEditorProps } from "./GraphNodesEditor.types";
import GraphNodes from "../GraphNodes/GraphNodes";
import Card from "../Card/Card";
import Content from "../../Layout/Content/Content";
import Row from "../../Layout/Row/Row";
import Col from "../../Layout/Column/Column";
import Space from "../Space/Space";
import Button from "../Button/Button";
import Paragraph from "../Paragraph/Paragraph";
import Input from "../Input/Input";

const uid = (prefix = "node") => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const GraphNodesEditor: React.FC<GraphNodesEditorProps> = ({
	nodeTypes,
	initialNodes,
	initialEdges,
	onChange,
	className,
	style,
	...rest
}) => {
	const [nodes, setNodes] = useState(initialNodes || []);
	const [edges, setEdges] = useState(initialEdges || []);
	const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

	const selectedNode = useMemo(
		() => nodes.find((node) => node.id === selectedNodeId),
		[nodes, selectedNodeId],
	);

	useEffect(() => {
		onChange?.({ nodes, edges });
	}, [edges, nodes, onChange]);

	const addNode = (type: string) => {
		const def = nodeTypes[type];
		if (!def) return;
		const nextNode = {
			id: uid(),
			type: def.type,
			title: def.title,
			x: 36 + nodes.length * 24,
			y: 36 + nodes.length * 24,
			data: {},
		};
		setNodes((current) => [...current, nextNode]);
		setSelectedNodeId(nextNode.id);
	};

	const removeSelectedNode = () => {
		if (!selectedNodeId) return;
		setNodes((current) => current.filter((node) => node.id !== selectedNodeId));
		setEdges((current) =>
			current.filter(
				(edge) =>
					edge.fromNodeId !== selectedNodeId && edge.toNodeId !== selectedNodeId,
			),
		);
		setSelectedNodeId(null);
	};

	return (
		<Content
			{...rest}
			className={["oakd", "graph-nodes-editor", className].filter(Boolean).join(" ")}
			style={style}
		>
			<Row gap wide>
				<Col xs={24} md={18}>
					<Card pad wide>
						<Space gap align="center" className="graph-nodes-editor__toolbar">
							{Object.values(nodeTypes).map((nodeType) => (
								<Button
									key={nodeType.type}
									variant="ghost"
									onClick={() => addNode(nodeType.type)}
								>
									<Paragraph>Add {nodeType.title}</Paragraph>
								</Button>
							))}
							<Button
								variant="danger"
								onClick={removeSelectedNode}
								disabled={!selectedNodeId}
							>
								<Paragraph>Delete Selected</Paragraph>
							</Button>
						</Space>
					</Card>
					<GraphNodes
						nodes={nodes}
						edges={edges}
						nodeTypes={nodeTypes}
						onNodesChange={setNodes}
						onEdgesChange={setEdges}
						selectedNodeId={selectedNodeId}
						onSelectedNodeIdChange={setSelectedNodeId}
					/>
				</Col>
				<Col xs={24} md={6}>
					<Card pad wide>
						<Space direction="vertical" gap wide>
							<Paragraph>
								<strong>Inspector</strong>
							</Paragraph>
							{selectedNode ? (
								<>
									<Paragraph className="muted">Node Id: {selectedNode.id}</Paragraph>
									<Input
										placeholder="Node title"
										value={selectedNode.title || ""}
										onChange={(event) => {
											const title = event.currentTarget.value;
											setNodes((current) =>
												current.map((node) =>
													node.id === selectedNode.id ? { ...node, title } : node,
												),
											);
										}}
									/>
								</>
							) : (
								<Paragraph className="muted">Select a node to edit.</Paragraph>
							)}
						</Space>
					</Card>
				</Col>
			</Row>
		</Content>
	);
};

export default GraphNodesEditor;
