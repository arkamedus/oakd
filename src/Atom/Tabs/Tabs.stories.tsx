import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Tabs, { Tab } from "./Tabs";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Title from "../Title/Title";
import { IconLayers, IconStar, IconUser } from "../../Icon/Icons.bin";
import Card from "../Card/Card";
import Button from "../Button/Button";

const meta: Meta<typeof Tabs> = {
	title: "Design System/Navigation/Tabs",
	component: Tabs,
	argTypes: {
		orientation: {
			control: { type: "select" },
			options: ["horizontal", "vertical"],
			description: "Set the orientation of the Tabs",
		},
		onChange: { action: "changed" },
	},
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
	args: {
		orientation: "horizontal",
		defaultActiveKey: "overview",
	},
	render: (args) => (
		<Tabs {...args}>
			<Tab key="overview" label="Overview" icon={<IconLayers />}>
				<Card pad wide>
					<Space direction="vertical" gap>
						<Title>Launch overview</Title>
						<Paragraph>
							The release is on track, with QA complete and stakeholder review
							scheduled for Friday morning.
						</Paragraph>
					</Space>
				</Card>
			</Tab>
			<Tab key="activity" label="Activity" icon={<IconStar />}>
				<Card pad wide>
					<Space direction="vertical" gap>
						<Paragraph>3 pull requests merged today.</Paragraph>
						<Paragraph>2 incidents were resolved during validation.</Paragraph>
					</Space>
				</Card>
			</Tab>
			<Tab key="owners" label="Owners" icon={<IconUser />}>
				<Card pad wide>
					<Space direction="vertical" gap>
						<Paragraph>Engineering: Maya Chen</Paragraph>
						<Paragraph>Product: Sergio Diaz</Paragraph>
					</Space>
				</Card>
			</Tab>
		</Tabs>
	),
};

export const WithVerticalOrientation: Story = {
	render: () => (
		<Tabs orientation="vertical" defaultActiveKey="profile">
			<Tab key="profile" label="Profile" icon={<IconUser />}>
				<Card pad wide>
					<Space direction="vertical" gap>
						<Title>Profile preferences</Title>
						<Paragraph>
							Update your public name, timezone, and avatar.
						</Paragraph>
						<Button variant="primary">Save profile</Button>
					</Space>
				</Card>
			</Tab>
			<Tab key="notifications" label="Notifications" icon={<IconStar />}>
				<Card pad wide>
					<Paragraph>
						Route critical alerts to email and send digest updates to Slack.
					</Paragraph>
				</Card>
			</Tab>
			<Tab key="workspace" label="Workspace" icon={<IconLayers />}>
				<Card pad wide>
					<Paragraph>
						Configure shared defaults for reviewers, labels, and deployment
						windows.
					</Paragraph>
				</Card>
			</Tab>
		</Tabs>
	),
};
