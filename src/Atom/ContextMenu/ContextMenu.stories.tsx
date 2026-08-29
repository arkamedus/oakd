import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import ContextMenu from "./ContextMenu";
import Card from "../Card/Card";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import ActionList, { ActionListItem } from "../ActionList/ActionList";
import Row from "../../Layout/Row/Row";
import Col from "../../Layout/Column/Column";
import {
	IconClipboard,
	IconCopy,
	IconLayers,
	IconOpenExternal,
	IconPencil,
	IconTrash,
} from "../../Icon/Icons.bin";

const meta: Meta<typeof ContextMenu> = {
	title: "Design System/Atomic/ContextMenu",
	component: ContextMenu,
};

export default meta;

type Story = StoryObj<typeof ContextMenu>;

const menuActions = (
	<ActionList role="presentation" divided={false}>
		<ActionListItem
			role="menuitem"
			leading={<IconCopy size="small" />}
			title={<Paragraph>Copy</Paragraph>}
			trailing={<Paragraph>Ctrl+C</Paragraph>}
			onClick={() => undefined}
		/>
		<ActionListItem
			role="menuitem"
			leading={<IconClipboard size="small" />}
			title={<Paragraph>Paste</Paragraph>}
			trailing={<Paragraph>Ctrl+V</Paragraph>}
			disabled
			onClick={() => undefined}
		/>
		<ActionListItem
			role="menuitem"
			leading={<IconLayers size="small" />}
			title={<Paragraph>Duplicate</Paragraph>}
			onClick={() => undefined}
		/>
		<ActionListItem
			role="menuitem"
			leading={<IconPencil size="small" />}
			title={<Paragraph>Rename</Paragraph>}
			onClick={() => undefined}
		/>
		<ActionListItem
			role="menuitem"
			leading={<IconTrash size="small" />}
			title={<Paragraph>Delete</Paragraph>}
			onClick={() => undefined}
		/>
	</ActionList>
);

export const Default: Story = {
	render: () => (
		<ContextMenu content={menuActions}>
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
				<ActionList role="presentation" divided={false}>
					<ActionListItem
						role="menuitem"
						leading={<IconOpenExternal size="small" />}
						title={<Paragraph>Open asset</Paragraph>}
						description={<Paragraph>Open in the asset editor</Paragraph>}
						onClick={() => undefined}
					/>
					<ActionListItem
						role="menuitem"
						leading={<IconCopy size="small" />}
						title={<Paragraph>Copy link</Paragraph>}
						onClick={() => undefined}
					/>
				</ActionList>
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

export const MultipleTargets: Story = {
	render: () => (
		<Space direction="vertical" gap wide>
			{Array.from({ length: 4 }, (_, index) => (
				<ContextMenu key={index} content={menuActions}>
					<Card pad wide>
						<Paragraph>Right click row {index + 1}</Paragraph>
					</Card>
				</ContextMenu>
			))}
		</Space>
	),
};

export const NearViewportEdge: Story = {
	render: () => (
		<Row>
			<Col xs={18} />
			<Col xs={6}>
				<ContextMenu content={menuActions}>
					<Card pad wide>
						<Paragraph>Right click near the edge.</Paragraph>
					</Card>
				</ContextMenu>
			</Col>
		</Row>
	),
};
