import React, { useMemo, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import Tree from "./Tree";
import { TreeItem } from "./Tree.types";
import Paragraph from "../Paragraph/Paragraph";
import Card from "../Card/Card";
import Space from "../Space/Space";
import Button from "../Button/Button";

const meta: Meta<typeof Tree> = {
	title: "Design System/Atomic/Tree",
	component: Tree,
};

export default meta;

type Story = StoryObj<typeof Tree>;

const baseItems = (): TreeItem[] => [
	{
		id: "root",
		label: "root",
		expanded: true,
		children: [
			{
				id: "grp-axes",
				label: "grp_axes",
				expanded: true,
				children: [
					{
						id: "axis-x",
						label: "axis_x",
						leaf: (
							<Card style={{ width: 20, height: 20, background: "#ff4343" }} />
						),
					},
					{
						id: "axis-y",
						label: "axis_y",
						leaf: (
							<Card style={{ width: 20, height: 20, background: "#31e52b" }} />
						),
					},
				],
			},
			{
				id: "grp-nested",
				label: "grp_nestedA",
				expanded: true,
				children: [
					{
						id: "nested-cube",
						label: "nestedA_cube",
						leaf: (
							<Card style={{ width: 20, height: 20, background: "#d8d8d8" }} />
						),
					},
				],
			},
		],
	},
];

export const Default: Story = {
	render: () => {
		const [items, setItems] = useState(baseItems());
		return <Tree items={items} onChange={setItems} />;
	},
};

export const WithCustomLeafElements: Story = {
	render: () => {
		const [items, setItems] = useState(baseItems());
		return <Tree items={items} onChange={setItems} />;
	},
};

export const WithAddDeleteAndContextMenu: Story = {
	render: () => {
		const [items, setItems] = useState(baseItems());

		const bindMenus = (nodes: TreeItem[]): TreeItem[] =>
			nodes.map((node) => ({
				...node,
				menuContent: (
					<Card pad wide>
						<Space direction="vertical" gap wide>
							<Button
								variant="ghost"
								onClick={() =>
									setItems((current) => {
										const removal = removeNode(current, node.id);
										return removal;
									})
								}
							>
								<Paragraph>Delete</Paragraph>
							</Button>
							<Button
								variant="ghost"
								onClick={() =>
									setItems((current) =>
										appendChild(current, node.id, {
											id: `${node.id}-new-${Date.now()}`,
											label: "new_item",
										}),
									)
								}
							>
								<Paragraph>Add child</Paragraph>
							</Button>
						</Space>
					</Card>
				),
				children: node.children ? bindMenus(node.children) : undefined,
			}));

		const bound = useMemo(() => bindMenus(items), [items]);
		return <Tree items={bound} onChange={setItems} />;
	},
};

export const WithDragAndDropReorder: Story = {
	render: () => {
		const [items, setItems] = useState(baseItems());
		return <Tree items={items} onChange={setItems} />;
	},
};

const removeNode = (items: TreeItem[], id: string, depth = 0): TreeItem[] =>
	items
		.map((item) => {
			if (item.id === id) {
				return depth === 0 ? item : null;
			}
			if (item.children) {
				return { ...item, children: removeNode(item.children, id, depth + 1) };
			}
			return item;
		})
		.filter(Boolean) as TreeItem[];

const appendChild = (
	items: TreeItem[],
	id: string,
	nextChild: TreeItem,
): TreeItem[] =>
	items.map((item) => {
		if (item.id === id) {
			return {
				...item,
				expanded: true,
				children: [...(item.children ?? []), nextChild],
			};
		}
		if (item.children) {
			return { ...item, children: appendChild(item.children, id, nextChild) };
		}
		return item;
	});
