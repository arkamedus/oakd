import React from "react";
import { Meta } from "@storybook/react";
import Dropdown from "./Dropdown";
import Paragraph from "../Paragraph/Paragraph";
import Aspect from "../../Layout/Aspect/Aspect";
import Space from "../Space/Space";
import ActionList, { ActionListItem } from "../ActionList/ActionList";
import Content from "../../Layout/Content/Content";
import {
	IconCopy,
	IconLayers,
	IconPencil,
	IconTrash,
} from "../../Icon/Icons.bin";

const meta: Meta<typeof Dropdown> = {
	title: "Design System/Navigation/Dropdown",
	component: Dropdown,
	argTypes: {
		direction: {
			control: { type: "select" },
			options: ["bottom-left", "bottom-right", "top-left", "top-right"],
		},
	},
};
export default meta;

export const Default = () => (
	<Dropdown label="Row actions" closeOnSelect>
		<ActionList role="menu" divided={false}>
			<ActionListItem
				role="menuitem"
				leading={<IconPencil size="small" />}
				title={<Paragraph>Rename</Paragraph>}
				onClick={() => undefined}
			/>
			<ActionListItem
				role="menuitem"
				leading={<IconCopy size="small" />}
				title={<Paragraph>Duplicate</Paragraph>}
				onClick={() => undefined}
			/>
			<ActionListItem
				role="menuitem"
				leading={<IconTrash size="small" />}
				title={<Paragraph>Archive</Paragraph>}
				onClick={() => undefined}
			/>
		</ActionList>
	</Dropdown>
);

export const WithRichContent = () => (
	<Dropdown label="Project details">
		<Content pad>
			<Space direction="vertical" gap>
				<Paragraph>
					<strong>Marketing Site</strong>
				</Paragraph>
				<Paragraph>Owner: Growth team</Paragraph>
				<Paragraph>Last updated 2 hours ago</Paragraph>
			</Space>
		</Content>
	</Dropdown>
);
export const Positioned = () => (
	<Aspect ratio={"21x9"}>
		<Space wide fill justify={"end"}>
			<Dropdown direction={"bottom-right"} label="Overflow menu" closeOnSelect>
				<ActionList role="menu" divided={false}>
					<ActionListItem
						role="menuitem"
						leading={<IconCopy size="small" />}
						title={<Paragraph>Share</Paragraph>}
						onClick={() => undefined}
					/>
					<ActionListItem
						role="menuitem"
						leading={<IconLayers size="small" />}
						title={<Paragraph>Move</Paragraph>}
						onClick={() => undefined}
					/>
					<ActionListItem
						role="menuitem"
						leading={<IconTrash size="small" />}
						title={<Paragraph>Delete</Paragraph>}
						onClick={() => undefined}
					/>
				</ActionList>
			</Dropdown>
		</Space>
	</Aspect>
);
