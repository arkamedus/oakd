import React from "react";
import { TreeItem, TreeProps } from "./Tree.types";
import "./Tree.css";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Button from "../Button/Button";
import Icon from "../../Icon/Icon";
import ContextMenu from "../ContextMenu/ContextMenu";
import { decode__padding } from "../../Core/Core.types";
import Content from "../../Layout/Content/Content";

const containsId = (items: TreeItem[], id: string): boolean =>
	items.some((item) => item.id === id || containsId(item.children ?? [], id));

const removeItem = (
	items: TreeItem[],
	id: string,
): { item: TreeItem | null; items: TreeItem[] } => {
	let removed: TreeItem | null = null;
	const next = items
		.map((item) => {
			if (item.id === id) {
				removed = item;
				return null;
			}
			if (item.children?.length) {
				const result = removeItem(item.children, id);
				if (result.item) {
					removed = result.item;
					return { ...item, children: result.items };
				}
			}
			return item;
		})
		.filter(Boolean) as TreeItem[];

	return { item: removed, items: next };
};

const insertItem = (
	items: TreeItem[],
	targetId: string,
	dragged: TreeItem,
): TreeItem[] => {
	const next: TreeItem[] = [];

	for (const item of items) {
		if (item.id === targetId) {
			if (item.children) {
				next.push({
					...item,
					expanded: true,
					children: [...item.children, dragged],
				});
			} else {
				next.push(item, dragged);
			}
			continue;
		}

		if (item.children?.length && containsId(item.children, targetId)) {
			next.push({
				...item,
				children: insertItem(item.children, targetId, dragged),
			});
			continue;
		}

		next.push(item);
	}

	return next;
};

const toggleExpanded = (items: TreeItem[], id: string): TreeItem[] =>
	items.map((item) => {
		if (item.id === id) {
			return { ...item, expanded: !item.expanded };
		}
		if (item.children?.length) {
			return { ...item, children: toggleExpanded(item.children, id) };
		}
		return item;
	});

const moveItem = (
	items: TreeItem[],
	draggedId: string,
	targetId: string,
): TreeItem[] => {
	if (draggedId === targetId) return items;
	const removal = removeItem(items, draggedId);
	if (!removal.item) return items;
	if (containsId(removal.item.children ?? [], targetId)) return items;
	return insertItem(removal.items, targetId, removal.item);
};

const renderIcon = (icon?: TreeItem["icon"], fallback?: string) => {
	if (typeof icon === "string") return <Icon name={icon as any} />;
	if (icon) return icon;
	if (fallback) return <Icon name={fallback as any} />;
	return null;
};

const isFolder = (item: TreeItem) => Array.isArray(item.children);

const TreeNode: React.FC<{
	item: TreeItem;
	depth: number;
	onChange: (nextItems: TreeItem[]) => void;
	rootItems: TreeItem[];
	draggedId: string | null;
	dropTargetId: string | null;
	onDraggedIdChange: (next: string | null) => void;
	onDropTargetIdChange: (next: string | null) => void;
}> = ({
	item,
	depth,
	onChange,
	rootItems,
	draggedId,
	dropTargetId,
	onDraggedIdChange,
	onDropTargetIdChange,
}) => {
	const isRootNode = depth === 0 && item.id === "root";
	const folder = isFolder(item);
	const row = (
		<Space
			className={[
				"oakd",
				"tree__row",
				draggedId === item.id ? "is-dragging" : "",
			]
				.filter(Boolean)
				.join(" ")}
			style={{ ["--tree-depth" as any]: depth }}
			data-testid={`TreeRow-${item.id}`}
			draggable={!isRootNode}
			align="center"
			wide
			noWrap
			onDragStart={(event) => {
				if (isRootNode) {
					event.preventDefault();
					return;
				}
				onDraggedIdChange(item.id);
				event.dataTransfer.setData("text/plain", item.id);
			}}
			onDragEnd={() => {
				onDraggedIdChange(null);
				onDropTargetIdChange(null);
			}}
			onDragOver={(event) => {
				event.preventDefault();
				if (draggedId && draggedId !== item.id) {
					onDropTargetIdChange(item.id);
				}
			}}
			onDrop={(event) => {
				event.preventDefault();
				const draggedId = event.dataTransfer.getData("text/plain");
				onChange(moveItem(rootItems, draggedId, item.id));
				onDraggedIdChange(null);
				onDropTargetIdChange(null);
			}}
			onDragLeave={(event) => {
				if (event.currentTarget.contains(event.relatedTarget as Node | null))
					return;
				if (dropTargetId === item.id) {
					onDropTargetIdChange(null);
				}
			}}
		>
			<Content className="tree__toggle">
				{folder && (
					<Icon
						//variant="ghost"
						aria-label={item.expanded ? "Collapse folder" : "Expand folder"}
						onClick={() => onChange(toggleExpanded(rootItems, item.id))}
						name="Angle"
						rotation={item.expanded ? 90 : 0}
					/>
				)}
			</Content>
			<Content className="tree__icon">
				{renderIcon(item.icon, folder ? "Folder" : "Cube")}
			</Content>
			<Content className="tree__label" grow>
				{typeof item.label === "string" ? (
					<Paragraph>{item.label}</Paragraph>
				) : (
					item.label
				)}
			</Content>
			{item.leaf ? <Content className="tree__leaf">{item.leaf}</Content> : null}
		</Space>
	);

	return (
		<Content
			className={[
				"tree__node",
				dropTargetId === item.id && draggedId !== item.id ? "drop-target" : "",
			]
				.filter(Boolean)
				.join(" ")}
			style={{ ["--tree-depth" as any]: depth }}
		>
			{item.menuContent ? (
				<ContextMenu content={item.menuContent}>{row}</ContextMenu>
			) : (
				row
			)}
			{folder && item.expanded ? (
				item.children.length ? (
					<Content className="tree__children">
						{(item.children ?? []).map((child) => (
							<TreeNode
								key={child.id}
								item={child}
								depth={depth + 1}
								onChange={onChange}
								rootItems={rootItems}
								draggedId={draggedId}
								dropTargetId={dropTargetId}
								onDraggedIdChange={onDraggedIdChange}
								onDropTargetIdChange={onDropTargetIdChange}
							/>
						))}
					</Content>
				) : (
					<Content className="tree__children">Empty.</Content>
				)
			) : null}
		</Content>
	);
};

const Tree: React.FC<TreeProps> = ({
	items,
	onChange,
	className = "",
	style,
	wide,
	pad,
	...rest
}) => {
	const [draggedId, setDraggedId] = React.useState<string | null>(null);
	const [dropTargetId, setDropTargetId] = React.useState<string | null>(null);

	return (
		<Content
			{...rest}
			data-testid="Tree"
			className={[
				"oakd",
				"tree",
				wide ? "wide" : "",
				pad ? decode__padding(pad) : "",
				className,
			]
				.filter(Boolean)
				.join(" ")}
			style={style}
			wide={wide}
		>
			<Space direction="vertical" gap wide className="tree__list">
				{items.map((item) => (
					<TreeNode
						key={item.id}
						item={item}
						depth={0}
						onChange={onChange}
						rootItems={items}
						draggedId={draggedId}
						dropTargetId={dropTargetId}
						onDraggedIdChange={setDraggedId}
						onDropTargetIdChange={setDropTargetId}
					/>
				))}
			</Space>
		</Content>
	);
};

export default Tree;
