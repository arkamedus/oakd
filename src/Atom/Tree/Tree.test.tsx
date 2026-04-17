import React, { useMemo, useState } from "react";
import {
	createEvent,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
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
		fireEvent.click(screen.getByLabelText("Expand folder"));
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
		const targetRow = screen.getByTestId("TreeRow-folder-1");
		Object.defineProperty(targetRow, "getBoundingClientRect", {
			value: () => ({ top: 0, height: 40 }),
		});
		fireEvent.dragOver(targetRow, { dataTransfer, clientY: 30 });
		fireEvent.drop(screen.getByTestId("TreeRow-folder-1"), { dataTransfer });

		expect(onChange).toHaveBeenCalled();
	});

	it("marks the dragged row and shows a folder drop highlight", () => {
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
		const targetRow = screen.getByTestId("TreeRow-folder-1");
		Object.defineProperty(targetRow, "getBoundingClientRect", {
			value: () => ({ top: 0, height: 40 }),
		});
		const dragOverEvent = createEvent.dragOver(targetRow, { dataTransfer });
		Object.defineProperty(dragOverEvent, "clientY", { value: 20 });
		fireEvent(targetRow, dragOverEvent);

		expect(screen.getByTestId("TreeRow-leaf-2")).toHaveClass("is-dragging");
		expect(screen.getByTestId("TreeRow-folder-1")).toHaveClass("drop-into");
	});

	it("highlights a folder row when dropping into the folder body", () => {
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

		const targetRow = screen.getByTestId("TreeRow-folder-1");
		Object.defineProperty(targetRow, "getBoundingClientRect", {
			value: () => ({ top: 0, height: 40 }),
		});

		fireEvent.dragStart(screen.getByTestId("TreeRow-leaf-2"), { dataTransfer });
		const dragOverEvent = createEvent.dragOver(targetRow, { dataTransfer });
		Object.defineProperty(dragOverEvent, "clientY", { value: 20 });
		fireEvent(targetRow, dragOverEvent);

		expect(targetRow).toHaveClass("drop-into");
		expect(targetRow).not.toHaveClass("drop-before");
		expect(targetRow).not.toHaveClass("drop-after");
	});

	it("treats the middle of a folder row as an into-folder drop zone", () => {
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

		const targetRow = screen.getByTestId("TreeRow-folder-1");
		Object.defineProperty(targetRow, "getBoundingClientRect", {
			value: () => ({ top: 0, height: 40 }),
		});

		fireEvent.dragStart(screen.getByTestId("TreeRow-leaf-2"), { dataTransfer });
		const dragOverEvent = createEvent.dragOver(targetRow, { dataTransfer });
		Object.defineProperty(dragOverEvent, "clientY", { value: 20 });
		fireEvent(targetRow, dragOverEvent);

		expect(targetRow).toHaveClass("drop-into");
		expect(targetRow).not.toHaveClass("drop-before");
		expect(targetRow).not.toHaveClass("drop-after");
	});

	it("still allows dropping between folders from the row edge", () => {
		const Harness = () => {
			const [items, setItems] = useState<TreeItem[]>([
				{
					id: "folder-a",
					label: "folder-a",
					expanded: true,
					children: [],
				},
				{
					id: "folder-b",
					label: "folder-b",
					expanded: true,
					children: [],
				},
				{ id: "leaf", label: "leaf" },
			]);

			return <Tree items={items} onChange={setItems} />;
		};

		render(<Harness />);

		const dataTransfer = {
			data: {} as Record<string, string>,
			setData(type: string, value: string) {
				this.data[type] = value;
			},
			getData(type: string) {
				return this.data[type];
			},
		};

		const folderBRow = screen.getByTestId("TreeRow-folder-b");
		Object.defineProperty(folderBRow, "getBoundingClientRect", {
			value: () => ({ top: 0, height: 40 }),
		});

		fireEvent.dragStart(screen.getByTestId("TreeRow-leaf"), { dataTransfer });
		const dragOverEvent = createEvent.dragOver(folderBRow, { dataTransfer });
		Object.defineProperty(dragOverEvent, "clientY", { value: 2 });
		fireEvent(folderBRow, dragOverEvent);

		expect(folderBRow).toHaveClass("drop-before");
		expect(folderBRow).not.toHaveClass("drop-into");

		fireEvent.drop(folderBRow, { dataTransfer });

		const labels = screen
			.getAllByText(/^folder-[ab]$|^leaf$/)
			.map((node) => node.textContent);
		expect(labels).toEqual(["folder-a", "leaf", "folder-b"]);
	});

	it("uses the first child slot as the first position in an expanded folder", async () => {
		const Harness = () => {
			const [items, setItems] = useState<TreeItem[]>([
				{
					id: "folder",
					label: "folder",
					expanded: true,
					children: [
						{ id: "child-a", label: "child-a" },
						{ id: "child-b", label: "child-b" },
					],
				},
				{ id: "leaf", label: "leaf" },
			]);

			return <Tree items={items} onChange={setItems} />;
		};

		render(<Harness />);

		const dataTransfer = {
			data: {} as Record<string, string>,
			setData(type: string, value: string) {
				this.data[type] = value;
			},
			getData(type: string) {
				return this.data[type];
			},
		};

		const folderRow = screen.getByTestId("TreeRow-folder");
		fireEvent.dragStart(screen.getByTestId("TreeRow-leaf"), { dataTransfer });
		const firstChildRow = screen.getByTestId("TreeRow-child-a");
		Object.defineProperty(firstChildRow, "getBoundingClientRect", {
			value: () => ({ top: 0, height: 40 }),
		});
		const dragOverEvent = createEvent.dragOver(firstChildRow, { dataTransfer });
		Object.defineProperty(dragOverEvent, "clientY", { value: 5 });
		fireEvent(firstChildRow, dragOverEvent);

		expect(screen.getByTestId("TreeRow-folder")).toHaveClass(
			"drop-destination-folder",
		);
		expect(firstChildRow).toHaveClass("drop-before");

		fireEvent.drop(firstChildRow, { dataTransfer });

		await waitFor(() => {
			const labels = screen
				.getAllByText(/^folder$|^child-a$|^child-b$|^leaf$/)
				.map((node) => node.textContent);
			expect(labels).toEqual(["folder", "leaf", "child-a", "child-b"]);
		});
	});

	it("renders without onChange and shows a built-in empty folder state", async () => {
		render(
			<Tree
				items={[
					{
						id: "folder",
						label: "folder",
						expanded: true,
						children: [],
					},
				]}
			/>,
		);

		expect(screen.getByText("No items in this folder.")).toBeInTheDocument();
		expect(screen.getByText("folder")).toBeInTheDocument();
	});

	it("drops into the exact slot shown by the indicator within the same group", () => {
		const Harness = () => {
			const [items, setItems] = useState<TreeItem[]>([
				{
					id: "root",
					label: "root",
					expanded: true,
					children: [
						{ id: "a", label: "a" },
						{ id: "b", label: "b" },
						{ id: "c", label: "c" },
					],
				},
			]);

			return <Tree items={items} onChange={setItems} />;
		};

		render(<Harness />);

		const dataTransfer = {
			data: {} as Record<string, string>,
			setData(type: string, value: string) {
				this.data[type] = value;
			},
			getData(type: string) {
				return this.data[type];
			},
		};

		const rowC = screen.getByTestId("TreeRow-c");
		Object.defineProperty(rowC, "getBoundingClientRect", {
			value: () => ({ top: 0, height: 40 }),
		});

		fireEvent.dragStart(screen.getByTestId("TreeRow-a"), { dataTransfer });
		const dragOverEvent = createEvent.dragOver(rowC, { dataTransfer });
		Object.defineProperty(dragOverEvent, "clientY", { value: 5 });
		fireEvent(rowC, dragOverEvent);
		expect(rowC).toHaveClass("drop-before");
		fireEvent.drop(rowC, { dataTransfer });

		const labels = screen
			.getAllByText(/^[abc]$/)
			.map((node) => node.textContent);
		expect(labels).toEqual(["b", "a", "c"]);
	});

	it("highlights the destination folder while keeping the insertion line on the slot row", () => {
		const Harness = () => {
			const [items, setItems] = useState<TreeItem[]>([
				{
					id: "root",
					label: "root",
					expanded: true,
					children: [
						{
							id: "folder",
							label: "folder",
							expanded: true,
							children: [
								{ id: "a", label: "a" },
								{ id: "b", label: "b" },
							],
						},
						{ id: "leaf", label: "leaf" },
					],
				},
			]);

			return <Tree items={items} onChange={setItems} />;
		};

		render(<Harness />);

		const dataTransfer = {
			data: {} as Record<string, string>,
			setData(type: string, value: string) {
				this.data[type] = value;
			},
			getData(type: string) {
				return this.data[type];
			},
		};

		const rowB = screen.getByTestId("TreeRow-b");
		Object.defineProperty(rowB, "getBoundingClientRect", {
			value: () => ({ top: 0, height: 40 }),
		});

		fireEvent.dragStart(screen.getByTestId("TreeRow-leaf"), { dataTransfer });
		const dragOverEvent = createEvent.dragOver(rowB, { dataTransfer });
		Object.defineProperty(dragOverEvent, "clientY", { value: 5 });
		fireEvent(rowB, dragOverEvent);

		expect(rowB).toHaveClass("drop-before");
		expect(rowB).not.toHaveClass("drop-destination-folder");
		expect(screen.getByTestId("TreeRow-folder")).toHaveClass(
			"drop-destination-folder",
		);
	});

	it("does not leave a dead zone between child rows", () => {
		const Harness = () => {
			const [items, setItems] = useState<TreeItem[]>([
				{
					id: "folder",
					label: "folder",
					expanded: true,
					children: [
						{ id: "a", label: "a" },
						{ id: "b", label: "b" },
					],
				},
				{ id: "leaf", label: "leaf" },
			]);

			return <Tree items={items} onChange={setItems} />;
		};

		render(<Harness />);

		const dataTransfer = {
			data: {} as Record<string, string>,
			setData(type: string, value: string) {
				this.data[type] = value;
			},
			getData(type: string) {
				return this.data[type];
			},
		};

		const rowA = screen.getByTestId("TreeRow-a");
		const rowB = screen.getByTestId("TreeRow-b");
		Object.defineProperty(rowA, "getBoundingClientRect", {
			value: () => ({ top: 40, height: 20 }),
		});
		Object.defineProperty(rowB, "getBoundingClientRect", {
			value: () => ({ top: 68, height: 20 }),
		});

		fireEvent.dragStart(screen.getByTestId("TreeRow-leaf"), { dataTransfer });
		const gapEvent = createEvent.dragOver(screen.getByTestId("TreeChildren-folder"), {
			dataTransfer,
		});
		Object.defineProperty(gapEvent, "clientY", { value: 64 });
		fireEvent(screen.getByTestId("TreeChildren-folder"), gapEvent);

		expect(rowB).toHaveClass("drop-before");
		expect(screen.getByTestId("TreeRow-folder")).toHaveClass(
			"drop-destination-folder",
		);
	});

	it("shows and supports a last-position drop slot in a group", async () => {
		const Harness = () => {
			const [items, setItems] = useState<TreeItem[]>([
				{
					id: "folder",
					label: "folder",
					expanded: true,
					children: [
						{ id: "a", label: "a" },
						{ id: "b", label: "b" },
					],
				},
				{ id: "leaf", label: "leaf" },
			]);

			return <Tree items={items} onChange={setItems} />;
		};

		render(<Harness />);

		const dataTransfer = {
			data: {} as Record<string, string>,
			setData(type: string, value: string) {
				this.data[type] = value;
			},
			getData(type: string) {
				return this.data[type];
			},
		};

		const endSlot = screen.getByTestId("TreeEndSlot-folder");

		fireEvent.dragStart(screen.getByTestId("TreeRow-leaf"), { dataTransfer });
		fireEvent.dragOver(endSlot, { dataTransfer });

		expect(endSlot).toHaveClass("drop-after");
		expect(screen.getByTestId("TreeRow-folder")).toHaveClass(
			"drop-destination-folder",
		);

		fireEvent.drop(endSlot, { dataTransfer });

		await waitFor(() => {
			const labels = screen
				.getAllByText(/^folder$|^a$|^b$|^leaf$/)
				.map((node) => node.textContent);
			expect(labels).toEqual(["folder", "a", "b", "leaf"]);
		});
	});

	it("can drop into an empty folder placeholder", () => {
		const Harness = () => {
			const [items, setItems] = useState<TreeItem[]>([
				{
					id: "root",
					label: "root",
					expanded: true,
					children: [
						{
							id: "folder",
							label: "folder",
							expanded: true,
							children: [],
						},
						{ id: "leaf", label: "leaf" },
					],
				},
			]);

			return <Tree items={items} onChange={setItems} />;
		};

		render(<Harness />);

		const dataTransfer = {
			data: {} as Record<string, string>,
			setData(type: string, value: string) {
				this.data[type] = value;
			},
			getData(type: string) {
				return this.data[type];
			},
		};

		fireEvent.dragStart(screen.getByTestId("TreeRow-leaf"), { dataTransfer });
		fireEvent.dragOver(screen.getByText("No items in this folder."), {
			dataTransfer,
		});
		fireEvent.drop(screen.getByText("No items in this folder."), {
			dataTransfer,
		});

		expect(screen.queryByText("No items in this folder.")).toBeNull();
		const folderRow = screen.getByTestId("TreeRow-folder").closest(".tree__node");
		expect(folderRow).toHaveTextContent("leaf");
	});

	it("drops into a folder when hovering the folder body", async () => {
		const Harness = () => {
			const [items, setItems] = useState<TreeItem[]>([
				{
					id: "root",
					label: "root",
					expanded: true,
					children: [
						{
							id: "folder",
							label: "folder",
							expanded: true,
							children: [{ id: "child", label: "child" }],
						},
						{ id: "leaf", label: "leaf" },
					],
				},
			]);

			return <Tree items={items} onChange={setItems} />;
		};

		render(<Harness />);

		const dataTransfer = {
			data: {} as Record<string, string>,
			setData(type: string, value: string) {
				this.data[type] = value;
			},
			getData(type: string) {
				return this.data[type];
			},
		};

		const folderRow = screen.getByTestId("TreeRow-folder");
		Object.defineProperty(folderRow, "getBoundingClientRect", {
			value: () => ({ top: 0, height: 40 }),
		});

		fireEvent.dragStart(screen.getByTestId("TreeRow-leaf"), { dataTransfer });
		const dragOverEvent = createEvent.dragOver(folderRow, { dataTransfer });
		Object.defineProperty(dragOverEvent, "clientY", { value: 20 });
		fireEvent(folderRow, dragOverEvent);
		fireEvent.drop(folderRow, { dataTransfer });

		await waitFor(() => {
			const folderNode = screen.getByTestId("TreeRow-folder").closest(".tree__node");
			expect(folderNode).toHaveTextContent("child");
			expect(folderNode).toHaveTextContent("leaf");
		});
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
