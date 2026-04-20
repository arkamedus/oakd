import React, { useMemo, useRef, useState } from "react";
import Space from "./Atom/Space/Space";
import Title from "./Atom/Title/Title";
import Paragraph from "./Atom/Paragraph/Paragraph";
import Content from "./Layout/Content/Content";
import Card from "./Atom/Card/Card";
import DebugLayer from "./Atom/DebugLayer/DebugLayer";
import Button, { ButtonGroup } from "./Atom/Button/Button";
import {
	CoreIconNameType,
	IconDots,
	IconHome,
	IconTypes,
} from "./Icon/Icons.bin";
import Icon from "./Icon/Icon";
import Row from "./Layout/Row/Row";
import Column, { Col } from "./Layout/Column/Column";
import Input from "./Atom/Input/Input";
import Select from "./Atom/Select/Select";
import Collapsible from "./Atom/Collapsible/Collapsible";
import CodeArea from "./Atom/CodeArea/CodeArea";
import Dropdown from "./Atom/Dropdown/Dropdown";
import Breadcrumb from "./Atom/Breadcrumb/Breadcrumb";
import { ButtonType } from "./Core/Core.types";
import Pagination from "./Atom/Pagination/Pagination";
import MultiLineChart from "./Atom/MultiLineChart/MultiLineChart";
import StackedBreakdownChart from "./Atom/StackedBreakdownChart/StackedBreakdownChart";
import Announcement from "./Atom/Announcement/Announcement";
import Tree from "./Atom/Tree/Tree";
import { TreeItem } from "./Atom/Tree/Tree.types";

const createWelcomeTree = (): TreeItem[] => [
	{
		id: "welcome-root",
		label: <Paragraph>workspace</Paragraph>,
		expanded: true,
		children: [
			{
				id: "welcome-design",
				label: <Paragraph>design</Paragraph>,
				expanded: true,
				children: [
					{
						id: "welcome-banner",
						label: <Paragraph>launch-banner.png</Paragraph>,
						icon: "Picture",
					},
					{
						id: "welcome-copy",
						label: <Paragraph>homepage-copy.md</Paragraph>,
						icon: "Bookmark",
					},
				],
			},
			{
				id: "welcome-notes",
				label: <Paragraph>notes</Paragraph>,
				expanded: true,
				children: [
					{
						id: "welcome-review",
						label: <Paragraph>review-checklist.txt</Paragraph>,
						icon: "File",
					},
				],
			},
		],
	},
];

const removeWelcomeNode = (
	items: TreeItem[],
	id: string,
	depth = 0,
): TreeItem[] =>
	items
		.map((item) => {
			if (item.id === id) {
				return depth === 0 ? item : null;
			}
			if (item.children) {
				return {
					...item,
					children: removeWelcomeNode(item.children, id, depth + 1),
				};
			}
			return item;
		})
		.filter(Boolean) as TreeItem[];

const appendWelcomeChild = (
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
			return {
				...item,
				children: appendWelcomeChild(item.children, id, nextChild),
			};
		}
		return item;
	});

export const Welcome = () => {
	const [treeItems, setTreeItems] = useState<TreeItem[]>(createWelcomeTree);
	const nextTreeId = useRef(1);

	const takeTreeId = (prefix: string) => `${prefix}-${nextTreeId.current++}`;

	const boundTreeItems = useMemo(() => {
		const bindMenus = (nodes: TreeItem[], depth = 0): TreeItem[] =>
			nodes.map((node) => {
				const isFolder = node.children !== undefined;
				const canDelete = depth > 0;

				return {
					...node,
					menuContent: (
						<Card pad wide>
							<Space direction="vertical" gap wide>
								<Paragraph className={"muted"}>
									<strong>Tree actions</strong>
								</Paragraph>
								{isFolder && (
									<Button
										variant="ghost"
										size="small"
										onClick={() =>
											setTreeItems((current) =>
												appendWelcomeChild(current, node.id, {
													id: takeTreeId("folder"),
													label: <Paragraph>new-folder</Paragraph>,
													expanded: true,
													children: [],
												}),
											)
										}
									>
										<Paragraph>Add folder</Paragraph>
									</Button>
								)}
								{isFolder && (
									<Button
										variant="ghost"
										size="small"
										onClick={() =>
											setTreeItems((current) =>
												appendWelcomeChild(current, node.id, {
													id: takeTreeId("leaf"),
													label: <Paragraph>new-item</Paragraph>,
												}),
											)
										}
									>
										<Paragraph>Add leaf</Paragraph>
									</Button>
								)}
								{canDelete && (
									<Button
										variant="danger"
										size="small"
										onClick={() =>
											setTreeItems((current) =>
												removeWelcomeNode(current, node.id),
											)
										}
									>
										<Paragraph>Delete</Paragraph>
									</Button>
								)}
							</Space>
						</Card>
					),
					children: node.children
						? bindMenus(node.children, depth + 1)
						: undefined,
				};
			});

		return bindMenus(treeItems);
	}, [treeItems]);

	return (
		<div
			className="welcome__container"
			style={{
				position: "absolute",
				top: "0",
				left: "0",
				width: "100vw",
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "flex-start",
				overflowY: "auto",
				background: "linear-gradient(rgb(236 249 245), rgb(244 247 236))",
				color: "#fff",
				textAlign: "center",
				padding: "40px 0",
			}}
		>
			<Content pad>
				<Space gap>
					<Title>oakd</Title>
					<Paragraph>
						<em>v2.0.0</em>
						<br />
						by <strong>Gordon Goodrum</strong>
					</Paragraph>
				</Space>
				<Space
					direction="vertical"
					style={{ maxWidth: "720pt", width: "100%" }}
					gap
				>
					<Paragraph>
						<em>OakFrame Interactive Design & Component Library</em>
					</Paragraph>
					<Paragraph>
						Welcome to <strong>oakd</strong>, a modern and scalable TypeScript
						React component library designed for performance, flexibility, and
						accessibility. Explore our extensive suite of components and get
						started building better user interfaces today.
					</Paragraph>
					<Space direction="horizontal" gap>
						<a
							href="https://github.com/arkamedus/oakd"
							target="_blank"
							style={{
								color: "#007a88",
								textDecoration: "none",
								borderBottom: "2px solid #007bff",
								fontWeight: "500",
								fontSize: "80%",
							}}
						>
							GitHub Repo →
						</a>
					</Space>

					<Card wide>
						<DebugLayer label={"oakd | oakframe.org"}>
							<Content pad>
								<Space gap direction={"vertical"} wide>
									<Space direction={"vertical"} gap wide>
										<Paragraph>buttons</Paragraph>
										<Space gap wide>
											{["default", "primary", "warning", "danger"]
												.slice(0, 16)
												.map((type: ButtonType, idx) => {
													return (
														<Button
															key={`button-${idx}`}
															icon={"Star"}
															size={"small"}
															variant={type}
														>
															<Paragraph>{type}</Paragraph>
														</Button>
													);
												})}
											<ButtonGroup>
												<Button
													variant={"default"}
													size={"small"}
													icon={"Layers"}
												/>
												<Button
													variant={"ghost"}
													size={"small"}
													icon={"Triangle"}
												>
													<Paragraph>groups</Paragraph>
												</Button>
												<Button
													variant={"warning"}
													size={"small"}
													icon={"Trash"}
												/>
											</ButtonGroup>
										</Space>
									</Space>

									<Space direction={"vertical"} gap wide>
										<Paragraph>inputs</Paragraph>
										<Space gap wide>
											<Input
												icon={"User"}
												placeholder={"text"}
												type={"text"}
												variant={"default"}
											/>
											<Input
												icon={"Star"}
												placeholder={"password"}
												type={"password"}
												variant={"default"}
											/>
											<Input
												icon={"List"}
												placeholder={"errored"}
												type={"number"}
												variant={"default"}
												error
												defaultValue={-1}
											/>
										</Space>
									</Space>

									<Space direction={"vertical"} gap wide>
										<Paragraph>extended inputs</Paragraph>
										<Space
											style={{ width: "100%" }}
											wide
											gap
											justify={"between"}
										>
											<Select
												options={[
													{
														value: "a",
														element: <Paragraph>Apple</Paragraph>,
														category: "Fruits",
													},
													{
														value: "b",
														element: <Paragraph>Banana</Paragraph>,
														category: "Fruits",
													},
													{
														value: "c",
														element: <Paragraph>Carrot</Paragraph>,
														category: "Vegetables",
													},
												]}
												onChange={(val) => console.log(val)}
												categoryOrder={["Fruits", "Vegetables"]}
												placeholder={<Paragraph>Choose an option</Paragraph>}
											/>
											<Dropdown
												label={<IconDots size={"small"} />}
												direction={"bottom-right"}
											>
												<Paragraph>This is the content.</Paragraph>
											</Dropdown>
										</Space>
										<CodeArea
											grow
											lineNumbers
											errorLines={[3]}
											highlightCurrentLine
											style={{ textAlign: "left" }}
											defaultValue={
												"// javascript syntax highlighting\nconst name = `oakd`;\n// with configurable line support!"
											}
										/>
									</Space>

									<Collapsible
										title={
											<Paragraph>
												<strong>Collapsible</strong> Click to open
											</Paragraph>
										}
									>
										<Content pad>
											<Paragraph>This was hidden</Paragraph>
										</Content>
									</Collapsible>

									<Space direction={"vertical"} gap>
										<Paragraph>small utils</Paragraph>
										<Breadcrumb
											items={[
												{
													text: (
														<Paragraph>
															<IconHome size={"small"} /> Root
														</Paragraph>
													),
												},
												{ text: <Paragraph>Category</Paragraph> },
												{
													text: (
														<Paragraph>
															<strong>Section</strong>
														</Paragraph>
													),
												},
											]}
										/>
										<Space
											direction={"vertical"}
											gap
											style={{ width: "100%", textAlign: "left" }}
										>
											<Pagination
												maxPage={21}
												currentPage={5}
												showPreviousNext
												showNumbers
												showEllipsis
												size={"small"}
											/>
										</Space>
										<Announcement variant={"primary"} closable>
											This is a dismissible primary Announcement!
										</Announcement>
										<Row
											gap
											wide
											//justify={"stretch"}
											//align={"stretch"}
										>
											<Col xs={24} md={12}>
												<Card pad>
													<Space align={"center"} justify={"center"}>
														<Paragraph>
															This is a Card!
															<br />
															It has multiple lines or text centered
														</Paragraph>
													</Space>
												</Card>
											</Col>
											<Col xs={12} md={6}>
												<Card pad fill variant={"ghost"}>
													<Space align={"end"} justify={"center"} fill>
														<Title>42</Title>
														<Paragraph>tk/s</Paragraph>
													</Space>
												</Card>
											</Col>
											<Col xs={12} md={6}>
												<Card pad fill>
													<Space align={"center"} justify={"center"} fill>
														<Card pad variant={"ghost"}>
															<Paragraph>Centered Card</Paragraph>
														</Card>
													</Space>
												</Card>
											</Col>
										</Row>
										<Paragraph>svg icons</Paragraph>
										<Space wide gap justify={"between"}>
											{IconTypes.slice(0, 152).map(
												(icon: CoreIconNameType, idx: number) => {
													return (
														<Paragraph>
															<Icon
																key={`icon-${idx}`}
																name={icon}
																size="small"
															/>
														</Paragraph>
													);
												},
											)}
											<Paragraph>
												<em>and more!</em>
											</Paragraph>
										</Space>
									</Space>

									<Space direction={"vertical"} gap wide>
										<Paragraph>data displays</Paragraph>
										<Row gap>
											<Column xs={24} md={12}>
												<Card pad wide fill>
													<Space
														direction={"vertical"}
														gap
														wide
														fill
														align={"stretch"}
													>
														<Paragraph>
															<strong>multi line graphs</strong>
														</Paragraph>
														<Content grow fill wide>
															<MultiLineChart
																lines={[
																	{
																		label: "Signups",
																		values: [
																			{ x: "2026-04-01", y: 18 },
																			{ x: "2026-04-02", y: 24 },
																			{ x: "2026-04-03", y: 28 },
																			{ x: "2026-04-04", y: 31 },
																			{ x: "2026-04-05", y: 35 },
																		],
																	},
																	{
																		label: "Activations",
																		values: [
																			{ x: "2026-04-01", y: 12 },
																			{ x: "2026-04-02", y: 16 },
																			{ x: "2026-04-03", y: 22 },
																			{ x: "2026-04-04", y: 20 },
																			{ x: "2026-04-05", y: 26 },
																		],
																	},
																	{
																		label: "Retention",
																		values: [
																			{ x: "2026-04-01", y: 8 },
																			{ x: "2026-04-02", y: 11 },
																			{ x: "2026-04-03", y: 13 },
																			{ x: "2026-04-04", y: 14 },
																			{ x: "2026-04-05", y: 18 },
																		],
																	},
																]}
																hoverLabel={"events"}
																fill
																showVerticalTicks
																smooth
															/>
														</Content>
													</Space>
												</Card>
											</Column>

											<Column xs={24} md={12}>
												<Card pad wide fill>
													<Space
														direction={"vertical"}
														gap
														wide
														fill
														align={"stretch"}
													>
														<Paragraph>
															<strong>stacked bar graphs</strong>
														</Paragraph>
														<Content grow fill wide>
															<StackedBreakdownChart
																labels={[
																	"Helpful",
																	"Neutral",
																	"Risky",
																	"Escalated",
																]}
																xLabels={[
																	<Paragraph key={"wk1"}>Week 1</Paragraph>,
																	<Paragraph key={"wk2"}>Week 2</Paragraph>,
																	<Paragraph key={"wk3"}>Week 3</Paragraph>,
																	<Paragraph key={"wk4"}>Week 4</Paragraph>,
																	<Paragraph key={"wk5"}>Week 5</Paragraph>,
																]}
																rows={[
																	{
																		key: "week-1",
																		labelWeights: {
																			Helpful: 0.48,
																			Neutral: 0.27,
																			Risky: 0.17,
																			Escalated: 0.08,
																		},
																	},
																	{
																		key: "week-2",
																		labelWeights: {
																			Helpful: 0.55,
																			Neutral: 0.2,
																			Risky: 0.16,
																			Escalated: 0.09,
																		},
																	},
																	{
																		key: "week-3",
																		labelWeights: {
																			Helpful: 0.58,
																			Neutral: 0.18,
																			Risky: 0.14,
																			Escalated: 0.1,
																		},
																	},
																	{
																		key: "week-4",
																		labelWeights: {
																			Helpful: 0.51,
																			Neutral: 0.24,
																			Risky: 0.15,
																			Escalated: 0.1,
																		},
																	},
																	{
																		key: "week-5",
																		labelWeights: {
																			Helpful: 0.63,
																			Neutral: 0.16,
																			Risky: 0.11,
																			Escalated: 0.1,
																		},
																	},
																]}
															/>
														</Content>
													</Space>
												</Card>
											</Column>

											<Col xs={24} md={12}>
												<Card pad wide>
													<Space
														direction={"vertical"}
														gap
														wide
														align={"stretch"}
													>
														<Paragraph>
															<strong>tree with drag and drop</strong>
														</Paragraph>
														<Paragraph>
															Right click a folder or item to add a child
															folder, add a leaf, or delete the current node.
														</Paragraph>
														<Tree
															items={boundTreeItems}
															onChange={setTreeItems}
														/>
													</Space>
												</Card>
											</Col>
										</Row>
									</Space>
									<Paragraph>row w/ gap & columns</Paragraph>
									<Row gap>
										<Column xs={24}>
											<DebugLayer label={"Col 24"} />
										</Column>
										<Column xs={12}>
											<DebugLayer label={"Col 12"} />
										</Column>
										<Column xs={6}>
											<DebugLayer label={"Col 6"} />
										</Column>

										<Column xs={4}>
											<DebugLayer
												style={{ minWidth: 0, overflowX: "hidden" }}
											/>
										</Column>
										<Column xs={2}>
											<DebugLayer
												style={{ minWidth: 0, overflowX: "hidden" }}
											/>
										</Column>

										{[
											1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
											1, 1, 1, 1, 1,
										].map((col, idx) => {
											return (
												<Column xs={1} key={`col-${idx}`}>
													<DebugLayer
														style={{ minWidth: 0, overflowX: "hidden" }}
													/>
												</Column>
											);
										})}
									</Row>
								</Space>
							</Content>
						</DebugLayer>
					</Card>
				</Space>
			</Content>
		</div>
	);
};
