import React from "react";
import { Meta } from "@storybook/react";
import Dropdown from "./Dropdown";
import Paragraph from "../Paragraph/Paragraph";
import Aspect from "../../Layout/Aspect/Aspect";
import Space from "../Space/Space";
import Button from "../Button/Button";

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
	<Dropdown label="Row actions">
		<Space direction="vertical" gap>
			<Button variant="ghost">Rename</Button>
			<Button variant="ghost">Duplicate</Button>
			<Button variant="danger">Archive</Button>
		</Space>
	</Dropdown>
);

export const WithRichContent = () => (
	<Dropdown label="Project details">
		<Space direction="vertical" gap>
			<Paragraph>
				<strong>Marketing Site</strong>
			</Paragraph>
			<Paragraph>Owner: Growth team</Paragraph>
			<Paragraph>Last updated 2 hours ago</Paragraph>
		</Space>
	</Dropdown>
);
export const Positioned = () => (
	<Aspect ratio={"21x9"}>
		<Space wide fill justify={"end"}>
			<Dropdown direction={"bottom-right"} label="Overflow menu">
				<Space direction="vertical" gap>
					<Button variant="ghost">Share</Button>
					<Button variant="ghost">Move</Button>
					<Button variant="warning">Delete</Button>
				</Space>
			</Dropdown>
		</Space>
	</Aspect>
);
