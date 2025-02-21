import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Tabs, { Tab } from "./Tabs";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Divider from "../Divider/Divider";
import Content from "../../Layout/Content/Content";
import Title from "../Title/Title";
import {
	IconLayers,
	IconStar,
	IconTriangle,
	IconUser,
} from "../../Icon/Icons.bin";
import Card from "../Card/Card";

const meta: Meta<typeof Tabs> = {
	title: "Design System/Atomic/Tabs",
	component: Tabs,
	argTypes: {
		orientation: {
			control: { type: "select" },
			options: ["horizontal", "vertical"],
			description: "Set the orientation of the Tabs",
			defaultValue: "horizontal",
		},
	},
};
export default meta;

const Template: StoryFn<typeof Tabs> = (args) => (
	<Tabs {...args}>
		<Tab key="1" label="Overview" icon={<IconLayers />} />
		<Tab key="2" label="Settings" icon={<IconStar />} />
		<Tab key="3" label="Profile" icon={<IconUser />} />
	</Tabs>
);

export const Default = Template.bind({});
Default.args = {
	orientation: "horizontal",
};

export const Vertical = Template.bind({});
Vertical.args = {
	orientation: "vertical",
};

// Tabs.stories.tsx
export const WithContent = () => (
	<Tabs orientation="horizontal" defaultActiveKey="1">
		<Tab key="1" label="Overview" icon={<IconLayers />}>
			<Card pad wide>
				Overview Content
			</Card>
		</Tab>
		<Tab key="2" label="Settings" icon={<IconTriangle />}>
			<Card pad wide>
				Settings Content
			</Card>
		</Tab>
		<Tab key="3" label="Profile" icon={<IconUser />}>
			<Card pad wide>
				Profile Content
			</Card>
		</Tab>
	</Tabs>
);

export const WithContentExample = () => (
	<Space direction="horizontal" gap>
		<Tabs orientation="vertical" defaultActiveKey="1">
			<Tab key="1" label="Overview" icon={<IconLayers />}>
				<Title>Overview Content</Title>
			</Tab>
			<Tab key="2" label="Settings" icon={<IconTriangle />}>
				<Title>Settings Content</Title>
			</Tab>
			<Tab key="3" label="Profile" icon={<IconUser />}>
				<Title>Profile Content</Title>
			</Tab>
		</Tabs>
	</Space>
);
