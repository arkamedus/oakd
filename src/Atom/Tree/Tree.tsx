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

const findItemMeta = (
	items: TreeItem[],
	id: string,
	parentId: string | null = null,
): { item: TreeItem; parentId: string | null; index: number } | null => {
	for (let index = 0; index < items.length; index++) {
		const item = items[index];
		if (item.id === id) {
			return { item, parentId, index };
		}
		if (item.children?.length) {
			const found = findItemMeta(item.children, id, item.id);
			if (found) return found;
		}
	}

	return null;
};

const removeItem = (
	items: TreeItem[],
	id: string,
): {
	item: TreeItem | null;
	items: TreeItem[];
	parentId: string | null;
	index: number;
} => {
	let removed: TreeItem | null = null;
	let removedParentId: string | null = null;
	let removedIndex = -1;
	const next = items
		.map((item, index) => {
			if (item.id === id) {
				removed = item;
				removedParentId = null;
				removedIndex = index;
				return null;
			}
			if (item.children?.length) {
				const result = removeItem(item.children, id);
				if (result.item) {
					removed = result.item;
					removedParentId = result.parentId ?? item.id;
					removedIndex = result.index;
					return { ...item, children: result.items };
				}
			}
			return item;
		})
		.filter(Boolean) as TreeItem[];

	return {
		item: removed,
		items: next,
		parentId: removedParentId,
		index: removedIndex,
	};
};

const insertItem = (
	items: TreeItem[],
	parentId: string | null,
	index: number,
	dragged: TreeItem,
): TreeItem[] => {
	if (parentId === null) {
		const next = [...items];
		next.splice(index, 0, dragged);
		return next;
	}

	return items.map((item) => {
		if (item.id === parentId) {
			const children = [...(item.children ?? [])];
			children.splice(index, 0, dragged);
			return {
				...item,
				expanded: true,
				children,
			};
		}
		if (item.children?.length) {
			return {
				...item,
				children: insertItem(item.children, parentId, index, dragged),
			};
		}
		return item;
	});
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
	dropTarget: DropTargetState,
): TreeItem[] => {
	if (draggedId === dropTarget.parentId) return items;

	const draggedMeta = findItemMeta(items, draggedId);
	if (!draggedMeta) return items;
	const removal = removeItem(items, draggedId);
	if (!removal.item) return items;
	if (
		dropTarget.parentId &&
		containsId(removal.item.children ?? [], dropTarget.parentId)
	) {
		return items;
	}

	let nextIndex = dropTarget.index;
	if (
		draggedMeta.parentId === dropTarget.parentId &&
		draggedMeta.index < dropTarget.index
	) {
		nextIndex -= 1;
	}

	if (
		draggedMeta.parentId === dropTarget.parentId &&
		draggedMeta.index === nextIndex
	) {
		return items;
	}

	return insertItem(
		removal.items,
		dropTarget.parentId,
		Math.max(0, nextIndex),
		removal.item,
	);
};

const renderIcon = (icon?: TreeItem["icon"], fallback?: string) => {
	if (typeof icon === "string")
		return <Icon name={icon as any} size={"small"} />;
	if (icon) return icon;
	if (fallback) return <Icon name={fallback as any} size={"small"} />;
	return null;
};

const isFolder = (item: TreeItem) => Array.isArray(item.children);

const getClosestInsertionIndex = (
	childRows: HTMLElement[],
	clientY: number,
) => {
	for (let childIndex = 0; childIndex < childRows.length; childIndex++) {
		const bounds = childRows[childIndex].getBoundingClientRect();
		if (clientY <= bounds.top + bounds.height / 2) {
			return childIndex;
		}
	}

	return childRows.length;
};

interface DropTargetState {
	parentId: string | null;
	index: number;
	mode: "before" | "after" | "into";
}

const TreeNode: React.FC<{
	item: TreeItem;
	depth: number;
	index: number;
	siblingCount: number;
	parentId: string | null;
	onChange?: (nextItems: TreeItem[]) => void;
	rootItems: TreeItem[];
	draggedId: string | null;
	dropTarget: DropTargetState | null;
	onDraggedIdChange: (next: string | null) => void;
	onDropTargetChange: (next: DropTargetState | null) => void;
}> = ({
	item,
	depth,
	index,
	siblingCount,
	parentId,
	onChange,
	rootItems,
	draggedId,
	dropTarget,
	onDraggedIdChange,
	onDropTargetChange,
}) => {
	const isRootNode = depth === 0 && item.id === "root";
	const folder = isFolder(item);
	const dropBefore =
		dropTarget?.mode === "before" &&
		dropTarget.parentId === parentId &&
		dropTarget.index === index;
	const dropAfter =
		dropTarget?.mode === "after" &&
		dropTarget.parentId === parentId &&
		dropTarget.index === index + 1;
	const hideDropAfterLine =
		dropAfter && parentId !== null && index === siblingCount - 1;
	const dropInto =
		dropTarget?.mode === "into" && dropTarget.parentId === item.id;
	const highlightAsDestinationFolder =
		folder &&
		((dropTarget?.mode === "into" && dropTarget.parentId === item.id) ||
			((dropTarget?.mode === "before" || dropTarget?.mode === "after") &&
				dropTarget.parentId === item.id));
	const row = (
		<Space
			className={[
				"oakd",
				"tree__row",
				draggedId === item.id ? "is-dragging" : "",
				dropBefore ? "drop-before" : "",
				dropAfter ? "drop-after" : "",
				hideDropAfterLine ? "drop-after-hidden" : "",
				dropInto ? "drop-into" : "",
				highlightAsDestinationFolder ? "drop-destination-folder" : "",
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
				onDropTargetChange(null);
			}}
			onDragOver={(event) => {
				event.preventDefault();
				event.stopPropagation();
				if (draggedId && draggedId !== item.id) {
					if (folder) {
						const bounds = event.currentTarget.getBoundingClientRect();
						const offsetY = event.clientY - bounds.top;
						const edgeZone = Math.max(4, Math.min(8, bounds.height * 0.18));
						if (offsetY <= edgeZone) {
							onDropTargetChange({
								parentId,
								index,
								mode: "before",
							});
							return;
						}
						if (offsetY >= bounds.height - edgeZone) {
							onDropTargetChange({
								parentId: item.id,
								index: item.children?.length ?? 0,
								mode: "into",
							});
							return;
						}

						onDropTargetChange({
							parentId: item.id,
							index: item.children?.length ?? 0,
							mode: "into",
						});
						return;
					}

					const bounds = event.currentTarget.getBoundingClientRect();
					const offsetY = event.clientY - bounds.top;
					const nextIndex = offsetY <= bounds.height / 2 ? index : index + 1;
					onDropTargetChange({
						parentId,
						index: nextIndex,
						mode: offsetY <= bounds.height / 2 ? "before" : "after",
					});
				}
			}}
			onDrop={(event) => {
				event.preventDefault();
				event.stopPropagation();
				const currentDraggedId = event.dataTransfer.getData("text/plain");
				if (onChange && dropTarget) {
					onChange(moveItem(rootItems, currentDraggedId, dropTarget));
				}
				onDraggedIdChange(null);
				onDropTargetChange(null);
			}}
			onDragLeave={(event) => {
				if (event.currentTarget.contains(event.relatedTarget as Node | null))
					return;
				if (
					(dropBefore &&
						dropTarget?.parentId === parentId &&
						dropTarget.index === index) ||
					(dropAfter &&
						dropTarget?.parentId === parentId &&
						dropTarget.index === index + 1) ||
					(dropInto && dropTarget?.parentId === item.id)
				) {
					onDropTargetChange(null);
				}
			}}
		>
			<Content className="tree__toggle">
				{folder && (
					<Icon
						//variant="ghost"
						aria-label={item.expanded ? "Collapse folder" : "Expand folder"}
						onClick={() => onChange?.(toggleExpanded(rootItems, item.id))}
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
			className={["tree__node"].filter(Boolean).join(" ")}
			style={{ ["--tree-depth" as any]: depth }}
		>
			{item.menuContent ? (
				<ContextMenu content={item.menuContent}>{row}</ContextMenu>
			) : (
				row
			)}
			{folder && item.expanded ? (
				item.children.length ? (
					<Content
						className="tree__children"
						data-testid={`TreeChildren-${item.id}`}
						onDragOver={(event) => {
							event.preventDefault();
							event.stopPropagation();
							if (!draggedId || draggedId === item.id) return;
							const target = event.target as HTMLElement | null;
							if (target?.closest(".tree__row, .tree__empty")) return;

							const childRows = Array.from(event.currentTarget.children)
								.map(
									(child) =>
										(child as HTMLElement).querySelector(
											".tree__row",
										) as HTMLElement | null,
								)
								.filter(Boolean) as HTMLElement[];
							if (!childRows.length) return;

							const nextIndex = getClosestInsertionIndex(
								childRows,
								event.clientY,
							);

							onDropTargetChange({
								parentId: item.id,
								index: nextIndex,
								mode: nextIndex === childRows.length ? "after" : "before",
							});
						}}
						onDrop={(event) => {
							event.preventDefault();
							event.stopPropagation();
							const target = event.target as HTMLElement | null;
							if (target?.closest(".tree__row, .tree__empty")) return;
							const currentDraggedId = event.dataTransfer.getData("text/plain");
							if (onChange && dropTarget) {
								onChange(moveItem(rootItems, currentDraggedId, dropTarget));
							}
							onDraggedIdChange(null);
							onDropTargetChange(null);
						}}
					>
						{(item.children ?? []).map((child, childIndex) => (
							<TreeNode
								key={child.id}
								item={child}
								depth={depth + 1}
								index={childIndex}
								siblingCount={item.children.length}
								parentId={item.id}
								onChange={onChange}
								rootItems={rootItems}
								draggedId={draggedId}
								dropTarget={dropTarget}
								onDraggedIdChange={onDraggedIdChange}
								onDropTargetChange={onDropTargetChange}
							/>
						))}
						<Content
							className={[
								"tree__end-slot",
								dropTarget?.parentId === item.id &&
								dropTarget.index === item.children.length
									? "drop-after"
									: "",
							]
								.filter(Boolean)
								.join(" ")}
							style={{ ["--tree-depth" as any]: depth + 1 }}
							data-testid={`TreeEndSlot-${item.id}`}
							onDragOver={(event) => {
								event.preventDefault();
								event.stopPropagation();
								if (!draggedId || draggedId === item.id) return;
								onDropTargetChange({
									parentId: item.id,
									index: item.children.length,
									mode: "after",
								});
							}}
							onDrop={(event) => {
								event.preventDefault();
								event.stopPropagation();
								const currentDraggedId =
									event.dataTransfer.getData("text/plain");
								if (onChange) {
									onChange(
										moveItem(rootItems, currentDraggedId, {
											parentId: item.id,
											index: item.children.length,
											mode: "after",
										}),
									);
								}
								onDraggedIdChange(null);
								onDropTargetChange(null);
							}}
						/>
					</Content>
				) : (
					<Content className="tree__children">
						<Content
							className={[
								"tree__empty",
								dropTarget?.parentId === item.id && dropTarget.index === 0
									? "drop-before"
									: "",
							]
								.filter(Boolean)
								.join(" ")}
							style={{ ["--tree-depth" as any]: depth + 1 }}
							onDragOver={(event) => {
								event.preventDefault();
								event.stopPropagation();
								if (draggedId && draggedId !== item.id) {
									onDropTargetChange({
										parentId: item.id,
										index: 0,
										mode: "into",
									});
								}
							}}
							onDragLeave={(event) => {
								if (
									event.currentTarget.contains(
										event.relatedTarget as Node | null,
									)
								)
									return;
								if (
									dropTarget?.parentId === item.id &&
									dropTarget.index === 0
								) {
									onDropTargetChange(null);
								}
							}}
							onDrop={(event) => {
								event.preventDefault();
								event.stopPropagation();
								const currentDraggedId =
									event.dataTransfer.getData("text/plain");
								if (onChange) {
									onChange(
										moveItem(rootItems, currentDraggedId, {
											parentId: item.id,
											index: 0,
											mode: "into",
										}),
									);
								}
								onDraggedIdChange(null);
								onDropTargetChange(null);
							}}
						>
							<Paragraph>No items in this folder.</Paragraph>
						</Content>
					</Content>
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
	const [dropTarget, setDropTarget] = React.useState<DropTargetState | null>(
		null,
	);

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
				{items.map((item, index) => (
					<TreeNode
						key={item.id}
						item={item}
						depth={0}
						index={index}
						siblingCount={items.length}
						parentId={null}
						onChange={onChange}
						rootItems={items}
						draggedId={draggedId}
						dropTarget={dropTarget}
						onDraggedIdChange={setDraggedId}
						onDropTargetChange={setDropTarget}
					/>
				))}
			</Space>
		</Content>
	);
};

export default Tree;
