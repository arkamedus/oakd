import React from "react";
import Space from "./Atom/Space/Space";
import Title from "./Atom/Title/Title";
import Paragraph from "./Atom/Paragraph/Paragraph";
import Content from "./Layout/Content/Content";
import Card from "./Atom/Card/Card";
import DebugLayer from "./Atom/DebugLayer/DebugLayer";
import Button, {ButtonGroup} from "./Atom/Button/Button";
import { CoreIconNameType, IconSliders, IconTypes } from "./Icon/Icons.bin";
import Icon from "./Icon/Icon";
import { ButtonType } from "./Atom/Button/Button.types";
import Row from "./Layout/Row/Row";
import Column from "./Layout/Column/Column";
import Input from "./Atom/Input/Input";
import Select from "./Atom/Select/Select";
import Collapsible from "./Atom/Collapsible/Collapsible";

export const Welcome = () => {
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
				justifyContent: "center",
				background: "linear-gradient(rgb(236 249 245), rgb(244 247 236))",
				color: "#fff",
				textAlign: "center",
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
				<Space direction="vertical" style={{ maxWidth: "720px" }} gap>
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
							href="https://github.com/arkamedus/components"
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

					<Card style={{ width: "100%" }}>
						<DebugLayer label={"oakd | oakframe.org"}>
							<Content pad>
								<Space gap direction={"vertical"} style={{ width: "100%" }}>
									<Space direction={"vertical"} gap style={{ width: "100%" }}>
										<Paragraph>buttons</Paragraph>
										<Space gap justify={"between"} style={{ width: "100%" }}>
											{["default", "primary", "warning", "danger"]
												.slice(0, 16)
												.map((type: ButtonType, idx) => {
													return (
														<Button
															key={`button-${idx}`}
															icon={"Star"}
															size={"small"}
															type={type}
														>
															<Paragraph>{type}</Paragraph>
														</Button>
													);
												})}
											<ButtonGroup>
												<Button type={"default"} size={"small"} icon={"Layers"} />
												<Button type={"ghost"} size={"small"} icon={"Triangle"}>
													<Paragraph>groups</Paragraph>
												</Button>
												<Button type={"warning"} size={"small"} icon={"Trash"} />
											</ButtonGroup>
										</Space>
									</Space>

									<Space direction={"vertical"} gap style={{ width: "100%" }}>
										<Paragraph>inputs</Paragraph>
										<Space style={{ width: "100%" }} gap justify={"between"}>
											<Input
												icon={"User"}
												placeholder={"text"}
												type={"text"}
												inputType={"default"}
											/>
											<Input
												icon={"Star"}
												placeholder={"password"}
												type={"password"}
												inputType={"default"}
											/>
											<Input
												icon={"List"}
												placeholder={"errored"}
												type={"number"}
												inputType={"default"}
												error
												defaultValue={-1}
											/>
										</Space>
									</Space>

									<Space direction={"vertical"} gap style={{ width: "100%" }}>
										<Paragraph>extended inputs</Paragraph>
										<Space style={{ width: "100%" }} gap justify={"between"}>
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
												onSelected={(val) => console.log(val)}
												categorize={{
													property: "category",
													order: ["Fruits", "Vegetables"],
												}}
												placeholder={<Paragraph>Choose an option</Paragraph>}
											/>
										</Space>
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
										<Paragraph>svg icons</Paragraph>
										<Space style={{ width: "100%" }} gap justify={"between"}>
											{IconTypes.slice(0, 21).map(
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
