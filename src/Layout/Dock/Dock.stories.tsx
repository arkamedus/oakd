import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Button from "../../Atom/Button/Button";
import Card from "../../Atom/Card/Card";
import Space from "../../Atom/Space/Space";
import Paragraph from "../../Atom/Paragraph/Paragraph";
import Page from "../Page/Page";
import Dock from "./Dock";
const meta: Meta<typeof Dock> = {
	title: "Design System/Layout/Dock",
	component: Dock,
	parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof Dock>;
export const EdgesAndCorners: Story = {
	render: () => (
		<Page fixed>
			<Dock position="top">
				<Card pad>
					<Paragraph>Top dock</Paragraph>
				</Card>
			</Dock>
			<Dock position="left">
				<Button>
					<Paragraph>Left dock</Paragraph>
				</Button>
			</Dock>
			<Dock position="top-right">
				<Card pad>
					<Space gap>
						<Button>
							<Paragraph>Inspect</Paragraph>
						</Button>
						<Button variant="primary">
							<Paragraph>Apply</Paragraph>
						</Button>
					</Space>
				</Card>
			</Dock>
			<Dock position="bottom-left">
				<Button variant="success">
					<Paragraph>Saved</Paragraph>
				</Button>
			</Dock>
			<Dock position="bottom">
				<Card pad>
					<Paragraph>Bottom dock</Paragraph>
				</Card>
			</Dock>
		</Page>
	),
};
