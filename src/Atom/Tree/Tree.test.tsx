import React, { useMemo, useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Tree from "./Tree";
import { TreeItem } from "./Tree.types";
import Button from "../Button/Button";
import Paragraph from "../Paragraph/Paragraph";

const baseItems = (): TreeItem[] => [
	{
		id: "folder-1",
		label: "folder-1",
		expanded: false,
		children: [{ id: "leaf-1", label: "leaf-1" }],
	},
	{ id: "leaf-2", label: "leaf-2", leaf: <span data-testid="LeafBadge">badge</span> },
];

describe("Tree Component", () => {
	it("renders folders and leaves", () => {
		render(<Tree items={baseItems()} onChange={() => undefined} />);
		expect(screen.getByText("folder-1")).toBeInTheDocument();
		expect(screen.getByText("leaf-2")).toBeInTheDocument();
	});

	it("toggles expanded state through controlled updates", async () => {
		const Harness = () => {
			const [items, setItems] = useState(baseItems());
			return <Tree items={items} onChange={setItems} />;
		};

		render(<Harness />);
		expect(screen.queryByText("leaf-1")).toBeNull();
		fireEvent.click(screen.getByRole("button", { name: "Expand folder" }));
		expect(await screen.findByText("leaf-1")).toBeInTheDocument();
	});

	it("renders custom leaf elements", () => {
		render(<Tree items={baseItems()} onChange={() => undefined} />);
		expect(screen.getByTestId("LeafBadge")).toBeInTheDocument();
	});

	it("supports drag and drop reorder through onChange", () => {
		const onChange = jest.fn();
		render(<Tree items={baseItems()} onChange={onChange} />);

		const dataTransfer = {
			data: {} as Record<string, string>,
			setData(type: string, value: string) {
				this.data[type] = value;
			},
			getData(type: string) {
				return this.data[type];
			},
		};

		fireEvent.dragStart(screen.getByTestId("TreeRow-leaf-2"), { dataTransfer });
		fireEvent.dragOver(screen.getByTestId("TreeRow-folder-1"), { dataTransfer });
		fireEvent.drop(screen.getByTestId("TreeRow-folder-1"), { dataTransfer });

		expect(onChange).toHaveBeenCalled();
	});

	it("marks the dragged row and shows a drop target indicator", () => {
		render(<Tree items={baseItems()} onChange={() => undefined} />);

		const dataTransfer = {
			data: {} as Record<string, string>,
			setData(type: string, value: string) {
				this.data[type] = value;
			},
			getData(type: string) {
				return this.data[type];
			},
		};

		fireEvent.dragStart(screen.getByTestId("TreeRow-leaf-2"), { dataTransfer });
		fireEvent.dragOver(screen.getByTestId("TreeRow-folder-1"), { dataTransfer });

		expect(screen.getByTestId("TreeRow-leaf-2")).toHaveClass("is-dragging");
		expect(screen.getByTestId("TreeRow-folder-1").closest(".tree__node")).toHaveClass(
			"drop-target",
		);
	});

	it("opens a context menu on right click", async () => {
		const Harness = () => {
			const [items] = useState<TreeItem[]>([
				{
					id: "leaf",
					label: "leaf",
					menuContent: (
						<Button variant="ghost">
							<Paragraph>Delete</Paragraph>
						</Button>
					),
				},
			]);
			return <Tree items={items} onChange={() => undefined} />;
		};

		render(<Harness />);
		fireEvent.contextMenu(screen.getByTestId("TreeRow-leaf"), {
			clientX: 100,
			clientY: 100,
		});

		expect(await screen.findByText("Delete")).toBeInTheDocument();
	});

	it("supports add and delete flows in a controlled harness", async () => {
		const Harness = () => {
			const [items, setItems] = useState<TreeItem[]>([
				{
					id: "folder",
					label: "folder",
					expanded: true,
					menuContent: null,
				},
			]);

			const bindMenus = (nodes: TreeItem[]): TreeItem[] =>
				nodes.map((node) => ({
					...node,
					menuContent: (
						<>
							<Button
								variant="ghost"
								onClick={() =>
									setItems((current) =>
										current.flatMap((item) => (item.id === node.id ? [] : [item])),
									)
								}
							>
								<Paragraph>Delete</Paragraph>
							</Button>
							<Button
								variant="ghost"
								onClick={() =>
									setItems((current) =>
										current.map((item) =>
											item.id === node.id
												? {
														...item,
														children: [
															...(item.children ?? []),
															{ id: "child", label: "child" },
														],
														expanded: true,
												  }
												: item,
										),
									)
								}
							>
								<Paragraph>Add child</Paragraph>
							</Button>
						</>
					),
				}));

			const bound = useMemo(() => bindMenus(items), [items]);
			return <Tree items={bound} onChange={setItems} />;
		};

		render(<Harness />);
		fireEvent.contextMenu(screen.getByTestId("TreeRow-folder"), {
			clientX: 80,
			clientY: 80,
		});
		fireEvent.click(await screen.findByText("Add child"));
		await waitFor(() => expect(screen.getByText("child")).toBeInTheDocument());

		fireEvent.contextMenu(screen.getByTestId("TreeRow-folder"), {
			clientX: 80,
			clientY: 80,
		});
		fireEvent.click(await screen.findByText("Delete"));
		await waitFor(() => expect(screen.queryByText("folder")).toBeNull());
	});

	it("keeps a group when its last child is removed", async () => {
		const Harness = () => {
			const [items, setItems] = useState<TreeItem[]>([
				{
					id: "root",
					label: "root",
					expanded: true,
					children: [
						{
							id: "group",
							label: "group",
							expanded: true,
							children: [{ id: "child", label: "child" }],
						},
					],
				},
			]);

			const removeNode = (nodes: TreeItem[], id: string, depth = 0): TreeItem[] =>
				nodes
					.map((node) => {
						if (node.id === id) {
							return depth === 0 ? node : null;
						}
						if (node.children) {
							return {
								...node,
								children: removeNode(node.children, id, depth + 1),
							};
						}
						return node;
					})
					.filter(Boolean) as TreeItem[];

			const bindMenus = (nodes: TreeItem[]): TreeItem[] =>
				nodes.map((node) => ({
					...node,
					menuContent:
						node.id === "child" ? (
							<Button
								variant="ghost"
								onClick={() => setItems((current) => removeNode(current, "child"))}
							>
								<Paragraph>Delete</Paragraph>
							</Button>
						) : null,
					children: node.children ? bindMenus(node.children) : undefined,
				}));

			const bound = useMemo(() => bindMenus(items), [items]);
			return <Tree items={bound} onChange={setItems} />;
		};

		render(<Harness />);
		fireEvent.contextMenu(screen.getByTestId("TreeRow-child"), {
			clientX: 80,
			clientY: 80,
		});
		fireEvent.click(await screen.findByText("Delete"));

		await waitFor(() => {
			expect(screen.queryByText("child")).toBeNull();
			expect(screen.getByText("group")).toBeInTheDocument();
			const groupRow = screen.getByTestId("TreeRow-group");
			expect(groupRow).toBeInTheDocument();
			expect(groupRow.querySelector("[aria-label='Collapse folder']")).not.toBeNull();
		});
	});

	it("does not make the root node draggable", () => {
		render(
			<Tree
				items={[
					{
						id: "root",
						label: "root",
						expanded: true,
						children: [{ id: "child", label: "child" }],
					},
				]}
				onChange={() => undefined}
			/>
		);

		expect(screen.getByTestId("TreeRow-root")).toHaveAttribute("draggable", "false");
	});
});
