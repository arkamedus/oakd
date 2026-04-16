import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import ContextMenu from "./ContextMenu";
import Card from "../Card/Card";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Button from "../Button/Button";
import Content from "../../Layout/Content/Content";
import { IconClipboard, IconLayers, IconTrash } from "../../Icon/Icons.bin";

const meta: Meta<typeof ContextMenu> = {
	title: "Design System/Atomic/ContextMenu",
	component: ContextMenu,
};

export default meta;

type Story = StoryObj<typeof ContextMenu>;

const menuCard = (
	<Card pad wide>
		<Space direction="vertical" gap wide>
			<Paragraph className={"muted"}>
				<strong>Context Menu</strong>
			</Paragraph>
			<Space wide justify={"between"}>
				<Paragraph>Copy</Paragraph>
				<IconClipboard size={"small"} />
			</Space>
			<Space wide justify={"between"}>
				<Paragraph>Clone</Paragraph>
				<IconLayers size={"small"} />
			</Space>
			<Button variant="ghost" size={"small"}>
				<Paragraph>Rename</Paragraph>
			</Button>
			<Button variant="ghost" size={"small"}>
				<Paragraph>Duplicate</Paragraph>
			</Button>
			<Button variant="danger" size={"small"}>
				<Paragraph>Delete</Paragraph>
			</Button>
		</Space>
	</Card>
);

export const Default: Story = {
	render: () => (
		<ContextMenu content={menuCard}>
			<Card pad wide>
				<Paragraph>Right click this card.</Paragraph>
			</Card>
		</ContextMenu>
	),
};

export const WithCardLinks: Story = {
	render: () => (
		<ContextMenu
			content={
				<Card pad wide>
					<Space direction="vertical" gap wide>
						<Button variant="ghost">
							<Paragraph>Open asset</Paragraph>
						</Button>
						<Button variant="ghost">
							<Paragraph>Copy link</Paragraph>
						</Button>
					</Space>
				</Card>
			}
		>
			<Card pad wide>
				<Paragraph>
					Open a contextual action set for this project surface.
				</Paragraph>
			</Card>
		</ContextMenu>
	),
};

export const WithinScrollablePanel: Story = {
	render: () => (
		<Card pad wide style={{ height: 240 }}>
			<Content fill style={{ overflowY: "auto" }}>
				<Space direction="vertical" gap wide>
					{Array.from({ length: 8 }, (_, index) => (
						<ContextMenu key={index} content={menuCard}>
							<Card pad wide>
								<Paragraph>Right click row {index + 1}</Paragraph>
							</Card>
						</ContextMenu>
					))}
				</Space>
			</Content>
		</Card>
	),
};

export const NearViewportEdge: Story = {
	render: () => (
		<Space justify="end" wide>
			<ContextMenu content={menuCard}>
				<Card pad style={{ width: 220 }}>
					<Paragraph>Right click near the edge.</Paragraph>
				</Card>
			</ContextMenu>
		</Space>
	),
};
