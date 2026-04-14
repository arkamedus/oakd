import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import Select from "./Select";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";
import Card from "../Card/Card";
import Title from "../Title/Title";

const statusOptions = [
	{ value: "draft", element: <Paragraph>Draft</Paragraph>, category: "Open" },
	{
		value: "in_review",
		element: <Paragraph>In review</Paragraph>,
		category: "Open",
	},
	{
		value: "scheduled",
		element: <Paragraph>Scheduled</Paragraph>,
		category: "Planned",
	},
	{
		value: "published",
		element: <Paragraph>Published</Paragraph>,
		category: "Completed",
	},
];

const teammateOptions = [
	{ value: "maya", element: <Paragraph>Maya Chen</Paragraph> },
	{ value: "sergio", element: <Paragraph>Sergio Diaz</Paragraph> },
	{ value: "river", element: <Paragraph>River Patel</Paragraph> },
];

const meta: Meta<typeof Select> = {
	title: "Design System/Atomic/Select",
	component: Select,
	argTypes: {
		placeholder: {
			control: "text",
			description: "Placeholder when no selection is made",
		},
		variant: {
			control: {
				type: "select",
				options: [
					"default",
					"primary",
					"danger",
					"warning",
					"ghost",
					"disabled",
				],
			},
			description: "Visual variant for the select trigger",
		},
		size: {
			control: {
				type: "select",
				options: ["default", "small", "large"],
			},
			description: "Size of the select trigger button",
		},
		onChange: { action: "changed" },
	},
};

export default meta;

type Story = StoryObj<typeof Select>;

export const WorkflowStatusPicker: Story = {
	args: {
		options: statusOptions,
		categoryOrder: ["Open", "Planned", "Completed"],
		placeholder: "Choose a status",
		variant: "ghost",
		size: "default",
	},
};

export const ControlledAssignmentFlow: Story = {
	render: () => {
		const [assignee, setAssignee] = useState<string | undefined>("maya");

		return (
			<Card pad wide style={{ maxWidth: 520 }}>
				<Space direction="vertical" gap>
					<Title>Assign reviewer</Title>
					<Paragraph>
						Pick the teammate who will review the release checklist this
						afternoon.
					</Paragraph>
					<Select
						value={assignee}
						onChange={setAssignee}
						options={teammateOptions}
						placeholder="Select a reviewer"
					/>
					<Paragraph>
						Current reviewer: <strong>{assignee || "Unassigned"}</strong>
					</Paragraph>
				</Space>
			</Card>
		);
	},
};

export const DirectionAndSizing: Story = {
	render: () => (
		<Space gap align="start">
			<Select
				size="small"
				options={teammateOptions}
				placeholder="Small"
				onChange={() => undefined}
			/>
			<Select
				size="default"
				options={teammateOptions}
				placeholder="Default"
				onChange={() => undefined}
			/>
			<Select
				size="large"
				direction="bottom-right"
				options={teammateOptions}
				placeholder="Large / right aligned"
				onChange={() => undefined}
			/>
		</Space>
	),
};
