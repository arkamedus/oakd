import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Page from "./Page";
import Content, { ContentRow } from "../Content/Content";
import DebugLayer from "../../Atom/DebugLayer/DebugLayer";
import Row from "../Row/Row";
import Column, { Col } from "../Column/Column";
import Aspect from "../Aspect/Aspect";
import Paragraph from "../../Atom/Paragraph/Paragraph";
import Space from "../../Atom/Space/Space";
import Title from "../../Atom/Title/Title";

const meta: Meta<typeof Page> = {
	title: "Design System/Layout/Page",
	component: Page,
	argTypes: {
		fixed: {
			control: { type: "boolean" },
			description: "Whether the page is fixed to viewport",
		},
		className: {
			control: { type: "text" },
			description: "Additional class name",
		},
	},
	parameters: { layout: "fullscreen" },
};

export default meta;
const Template: StoryFn<typeof Page> = (args) => <Page {...args} />;

export const Default = Template.bind({});
Default.args = {
	children: <DebugLayer label="Page" />,
};

export const FullPageWithHeader = () => (
	<Aspect ratio="21x9">
		<Page gap>
			<Content>
				<DebugLayer label="Header" />
			</Content>
			<Content grow pad>
				<Aspect
					ratio="1x2"
					style={{
						backgroundImage:
							"radial-gradient(circle, #16d9e3, #30c7ec, #46aef7)",
					}}
				>
					<DebugLayer label="Scrollable Area" />
				</Aspect>
				<Content>
					<DebugLayer label="End of Content" />
				</Content>
			</Content>
		</Page>
	</Aspect>
);

export const PageWithLongContentFullPageScrolling = () => (
	<Aspect ratio="21x9">
		<Page gap>
			<Content>
				<DebugLayer label="Header" />
			</Content>
			<Content pad>
				<Aspect
					ratio="1x2"
					style={{
						backgroundImage:
							"radial-gradient(circle, #16d9e3, #30c7ec, #46aef7)",
					}}
				>
					<DebugLayer label="Scrollable Area" />
				</Aspect>
			</Content>
			<Content>
				<DebugLayer label="Footer" />
			</Content>
		</Page>
	</Aspect>
);

export const FixedTemplateWithScrollingContent = () => (
	<Aspect ratio="21x9">
		<Page gap>
			<Content>
				<DebugLayer label="Header" />
			</Content>
			<Content grow>
				<DebugLayer label={"Scrollable"}>
					<Row>
						<Col xs={12}>
							<Title>Left Column</Title>
						</Col>
						<Col xs={12}>
							<Space gap>
								{Array.from({ length: 14 }).map((_, i) => (
									<Title key={i.toString()}>
										Main scrollable content block #{i + 1}
									</Title>
								))}
							</Space>
						</Col>
					</Row>
				</DebugLayer>
			</Content>
			<Content>
				<DebugLayer label="Footer" />
			</Content>
		</Page>
	</Aspect>
);

export const FixedSidebarTemplateWithScrollingColumnContent = () => (
	<Aspect ratio="21x9">
		<Page fixed gap>
			<Content>
				<DebugLayer label="Header" />
			</Content>
			<ContentRow>
				<Content pad>
					<Title>Sidebar</Title>
					<Paragraph>Sidebar details here.</Paragraph>
				</Content>
				<Content grow>
					<Space gap>
						{Array.from({ length: 14 }).map((_, i) => (
							<Title key={i.toString()}>Main content block #{i + 1}</Title>
						))}
					</Space>
				</Content>
			</ContentRow>
			<Content>
				<DebugLayer label="Footer" />
			</Content>
		</Page>
	</Aspect>
);

export const ScrollingContent = () => (
	<Aspect ratio="21x9">
		<Page gap fixed>
			<Content>
				<DebugLayer label="Header" />
			</Content>
			<Content grow>
				<Space gap>
					{Array.from({ length: 14 }).map((_, i) => (
						<Title key={i.toString()}>Scrollable content block #{i + 1}</Title>
					))}
				</Space>
			</Content>
			<Content>
				<DebugLayer label="Footer" />
			</Content>
		</Page>
	</Aspect>
);

// Generator function for tall content blocks
const generateTallContent = (numBlocks: number = 10) =>
	Array.from({ length: numBlocks }).map((_, i) => (
		<div
			key={i}
			style={{
				height: "200px",
				background: i % 2 === 0 ? "#f0f0f0" : "#e0e0e0",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				marginBottom: "var(--gap-sizing)",
			}}
		>
			<Title>Tall Block {i + 1}</Title>
		</div>
	));

export const GeneratedContentExample = () => (
	<Aspect ratio="16x9">
		<Page gap fixed>
			<Content>
				<DebugLayer label="Header" />
			</Content>
			<Content grow>
				<Space gap>{generateTallContent(10)}</Space>
			</Content>
			<Content>
				<DebugLayer label="Footer" />
			</Content>
		</Page>
	</Aspect>
);
