import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { GraphNodesProps, OakGraphConnectEvent, OakGraphEdge } from "./GraphNodes.types";
import "./GraphNodes.css";
import Card from "../Card/Card";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";

interface DragState {
	nodeId: string;
	pointerStartX: number;
	pointerStartY: number;
	nodeStartX: number;
	nodeStartY: number;
}

interface PanState {
	pointerStartX: number;
	pointerStartY: number;
	panStartX: number;
	panStartY: number;
}

interface PendingConnection {
	fromNodeId: string;
	fromPortId: string;
}

const uid = (prefix = "edge") => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
const clamp = (value: number, min: number, max: number): number =>
	Math.max(min, Math.min(max, value));

const getPath = (x1: number, y1: number, x2: number, y2: number): string => {
	if (x2 >= x1) {
		const midX = x1 + Math.max(42, (x2 - x1) * 0.5);
		return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
	}

	const lead = 64;
	const firstX = x1 + lead;
	const secondX = x2 - lead;
	const midY = y1 + (y2 - y1) * 0.5;
	return `M ${x1} ${y1} L ${firstX} ${y1} L ${firstX} ${midY} L ${secondX} ${midY} L ${secondX} ${y2} L ${x2} ${y2}`;
};

type PortDirection = "in" | "out";

const portRefKey = (direction: PortDirection, nodeId: string, portId: string): string =>
	`${direction}:${nodeId}:${portId}`;

const GraphNodes: React.FC<GraphNodesProps> = ({
	nodes,
	edges,
	nodeTypes,
	onNodesChange,
	onEdgesChange,
	onConnect,
	selectedNodeId,
	onSelectedNodeIdChange,
	gridSize = 24,
	className,
	style,
	...rest
}) => {
	const rootRef = useRef<HTMLDivElement>(null);
	const portRefs = useRef(new Map<string, HTMLButtonElement>());
	const [dragState, setDragState] = useState<DragState | null>(null);
	const [panState, setPanState] = useState<PanState | null>(null);
	const [pendingConnection, setPendingConnection] = useState<PendingConnection | null>(
		null,
	);
	const [portVersion, setPortVersion] = useState(0);
	const [zoom, setZoom] = useState(1);
	const [pan, setPan] = useState({ x: 0, y: 0 });
	const [edgePaths, setEdgePaths] = useState<Array<{ id: string; path: string }>>([]);

	useEffect(() => {
		setPortVersion((value) => value + 1);
	}, [edges, nodes]);

	useEffect(() => {
		const root = rootRef.current;
		if (!root) return;
		const onNativeWheel = (event: WheelEvent) => {
			if (event.ctrlKey || event.metaKey) {
				event.preventDefault();
			}
		};
		root.addEventListener("wheel", onNativeWheel, { passive: false });
		return () => root.removeEventListener("wheel", onNativeWheel);
	}, []);

	const setPortRef = useCallback(
		(direction: PortDirection, nodeId: string, portId: string) =>
			(element: HTMLButtonElement | null) => {
				const key = portRefKey(direction, nodeId, portId);
				if (element) {
					portRefs.current.set(key, element);
					return;
				}
				portRefs.current.delete(key);
			},
		[],
	);

	const getPortAnchor = useCallback(
		(direction: PortDirection, nodeId: string, portId: string): { x: number; y: number } | null => {
			const rootElement = rootRef.current;
			if (!rootElement) return null;
			const portElement = portRefs.current.get(portRefKey(direction, nodeId, portId));
			if (!portElement) return null;
			const anchor = portElement.querySelector<HTMLElement>(".oak-graph-nodes__dot");
			if (!anchor) return null;

			const rootRect = rootElement.getBoundingClientRect();
			const dotRect = anchor.getBoundingClientRect();
			const localX = dotRect.left + dotRect.width * 0.5 - rootRect.left;
			const localY = dotRect.top + dotRect.height * 0.5 - rootRect.top;

			return {
				x: (localX - pan.x) / zoom,
				y: (localY - pan.y) / zoom,
			};
		},
		[pan.x, pan.y, zoom],
	);

	useLayoutEffect(() => {
		const nextPaths = edges
			.map((edge) => {
				const from = getPortAnchor("out", edge.fromNodeId, edge.fromPortId);
				const to = getPortAnchor("in", edge.toNodeId, edge.toPortId);
				if (!from || !to) return null;
				return {
					id: edge.id,
					path: getPath(from.x, from.y, to.x, to.y),
				};
			})
			.filter(Boolean) as Array<{ id: string; path: string }>;
		setEdgePaths(nextPaths);
	}, [edges, getPortAnchor, nodes, portVersion]);

	const updateNodePosition = (nodeId: string, x: number, y: number) => {
		onNodesChange?.(
			nodes.map((node) => (node.id === nodeId ? { ...node, x, y } : node)),
		);
	};

	const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		if (!dragState) return;
		const dx = event.clientX - dragState.pointerStartX;
		const dy = event.clientY - dragState.pointerStartY;
		updateNodePosition(
			dragState.nodeId,
			dragState.nodeStartX + dx / zoom,
			dragState.nodeStartY + dy / zoom,
		);
	};

	const onMouseUp = () => {
		setDragState(null);
		setPanState(null);
	};

	const onWorkspaceMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
		if (event.button !== 0) return;
		const target = event.target as HTMLElement;
		if (target.closest(".oak-graph-nodes__node")) return;
		if (target.closest(".oak-graph-nodes__port")) return;
		if (target.closest(".oak-graph-nodes__zoom-controls")) return;
		setPanState({
			pointerStartX: event.clientX,
			pointerStartY: event.clientY,
			panStartX: pan.x,
			panStartY: pan.y,
		});
		onSelectedNodeIdChange?.(null);
		setPendingConnection(null);
	};

	const onWorkspaceMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		onMouseMove(event);
		if (!panState) return;
		const dx = event.clientX - panState.pointerStartX;
		const dy = event.clientY - panState.pointerStartY;
		setPan({
			x: panState.panStartX + dx,
			y: panState.panStartY + dy,
		});
	};

	const zoomAtLocalPoint = (localX: number, localY: number, nextZoom: number) => {
		const worldXBefore = (localX - pan.x) / zoom;
		const worldYBefore = (localY - pan.y) / zoom;
		setZoom(nextZoom);
		setPan({
			x: localX - worldXBefore * nextZoom,
			y: localY - worldYBefore * nextZoom,
		});
	};

	const onWheelWorkspace = (event: React.WheelEvent<HTMLDivElement>) => {
		const root = rootRef.current;
		if (!root) return;
		const rect = root.getBoundingClientRect();
		const localX = event.clientX - rect.left;
		const localY = event.clientY - rect.top;

		if (event.ctrlKey || event.metaKey) {
			event.preventDefault();
			const nextZoom = clamp(zoom + (event.deltaY > 0 ? -0.08 : 0.08), 0.4, 1.8);
			zoomAtLocalPoint(localX, localY, nextZoom);
			return;
		}

		event.preventDefault();
		setPan((current) => ({
			x: current.x - event.deltaX,
			y: current.y - event.deltaY,
		}));
	};

	const connect = (event: OakGraphConnectEvent) => {
		const nextEdge: OakGraphEdge = {
			id: uid(),
			fromNodeId: event.fromNodeId,
			fromPortId: event.fromPortId,
			toNodeId: event.toNodeId,
			toPortId: event.toPortId,
		};
		onEdgesChange?.([...edges, nextEdge]);
		onConnect?.(event);
	};

	return (
		<div
			{...rest}
			ref={rootRef}
			data-testid="GraphNodes"
			className={["oakd", "oak-graph-nodes", className].filter(Boolean).join(" ")}
			style={{
				...style,
				backgroundSize: `${gridSize * zoom}px ${gridSize * zoom}px`,
				backgroundPosition: `${pan.x}px ${pan.y}px`,
				cursor: panState ? "grabbing" : "grab",
			}}
			onMouseDown={onWorkspaceMouseDown}
			onMouseMove={onWorkspaceMouseMove}
			onMouseUp={onMouseUp}
			onMouseLeave={onMouseUp}
			onWheel={onWheelWorkspace}
			onClick={(event) => {
				const target = event.target as HTMLElement;
				if (
					!target.closest(".oak-graph-nodes__node") &&
					!target.closest(".oak-graph-nodes__port") &&
					!target.closest(".oak-graph-nodes__zoom-controls")
				) {
					onSelectedNodeIdChange?.(null);
					setPendingConnection(null);
				}
			}}
		>
			<div
				className="oak-graph-nodes__viewport"
				style={{
					transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
				}}
			>
				<svg className="oak-graph-nodes__edges" aria-hidden="true">
					{edgePaths.map((edgePath) => (
						<path
							key={edgePath.id}
							d={edgePath.path}
							className="oak-graph-nodes__edge"
							data-testid={`GraphEdge-${edgePath.id}`}
						/>
					))}
				</svg>
				{nodes.map((node) => {
				const definition = nodeTypes[node.type];
				if (!definition) return null;
				const width = definition.width || 260;
				const selected = selectedNodeId === node.id;
					return (
						<Card
							key={node.id}
						className={[
							"oak-graph-nodes__node",
							selected ? "is-selected" : "",
						].join(" ")}
							style={{
								width,
								transform: `translate(${node.x}px, ${node.y}px)`,
								borderColor: definition.color || "var(--oakd-card-default-border)",
								"--oak-graph-node-accent":
									definition.color || "var(--oakd-card-default-border)",
							} as React.CSSProperties}
							variant="default"
								onMouseDown={(event) => {
								if ((event.target as HTMLElement).closest(".oak-graph-nodes__port")) return;
								event.stopPropagation();
								onSelectedNodeIdChange?.(node.id);
								setDragState({
								nodeId: node.id,
								pointerStartX: event.clientX,
								pointerStartY: event.clientY,
								nodeStartX: node.x,
								nodeStartY: node.y,
							});
						}}
						data-testid={`GraphNode-${node.id}`}
					>
						<Space justify="between" wide className="oak-graph-nodes__header">
							<Paragraph>
								<strong>{node.title || definition.title}</strong>
							</Paragraph>
						</Space>
						<Space className="oak-graph-nodes__ports" justify="between" wide>
							<Space direction="vertical" gap>
									{definition.inputs.map((port) => (
										<button
										key={port.id}
										type="button"
											className="oakd oak-graph-nodes__port is-in"
											ref={setPortRef("in", node.id, port.id)}
											data-testid={`GraphPort-in-${node.id}-${port.id}`}
										onClick={() => {
											if (!pendingConnection) return;
											if (pendingConnection.fromNodeId === node.id) return;
											connect({
												fromNodeId: pendingConnection.fromNodeId,
												fromPortId: pendingConnection.fromPortId,
												toNodeId: node.id,
												toPortId: port.id,
											});
											setPendingConnection(null);
										}}
									>
										<span className="oak-graph-nodes__dot" aria-hidden="true" />
										<Paragraph>{port.label}</Paragraph>
									</button>
								))}
							</Space>
							<Space direction="vertical" gap>
									{definition.outputs.map((port) => (
										<button
										key={port.id}
										type="button"
											className={[
												"oakd",
												"oak-graph-nodes__port",
												"is-out",
												pendingConnection?.fromNodeId === node.id &&
												pendingConnection?.fromPortId === port.id
													? "is-pending"
													: "",
											].join(" ")}
											ref={setPortRef("out", node.id, port.id)}
										data-testid={`GraphPort-out-${node.id}-${port.id}`}
										onClick={() => {
											setPendingConnection({
												fromNodeId: node.id,
												fromPortId: port.id,
											});
											onSelectedNodeIdChange?.(node.id);
										}}
									>
										<Paragraph>{port.label}</Paragraph>
										<span className="oak-graph-nodes__dot" aria-hidden="true" />
									</button>
								))}
							</Space>
						</Space>
							{definition.renderBody ? (
							<div className="oak-graph-nodes__body">
								{definition.renderBody({
									node,
									data: node.data,
									selected,
								})}
							</div>
						) : null}
						</Card>
					);
				})}
			</div>
			<div className="oak-graph-nodes__zoom-controls">
				<button
					type="button"
					className="oak-graph-nodes__zoom-button"
					onClick={() => {
						const root = rootRef.current;
						if (!root) return;
						const rect = root.getBoundingClientRect();
						const nextZoom = clamp(zoom + 0.1, 0.4, 1.8);
						zoomAtLocalPoint(rect.width * 0.5, rect.height * 0.5, nextZoom);
					}}
					aria-label="Zoom in"
				>
					+
				</button>
				<button
					type="button"
					className="oak-graph-nodes__zoom-button"
					onClick={() => {
						const root = rootRef.current;
						if (!root) return;
						const rect = root.getBoundingClientRect();
						const nextZoom = clamp(zoom - 0.1, 0.4, 1.8);
						zoomAtLocalPoint(rect.width * 0.5, rect.height * 0.5, nextZoom);
					}}
					aria-label="Zoom out"
				>
					-
				</button>
				<button
					type="button"
					className="oak-graph-nodes__zoom-button"
					onClick={() => {
						setZoom(1);
						setPan({ x: 0, y: 0 });
					}}
					aria-label="Reset view"
				>
					1x
				</button>
			</div>
		</div>
	);
};

export default GraphNodes;
