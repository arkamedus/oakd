import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Breadcrumb from "./Breadcrumb";
import { IconMagnify } from "../../Icon/Icons.bin";
import Paragraph from "../Paragraph/Paragraph";

const meta: Meta<typeof Breadcrumb> = {
	title: "Design System/Atomic/Breadcrumb",
	component: Breadcrumb,
	argTypes: {
		separator: {
			control: { type: "select" },
			options: ["default", "dot", "slash", "backslash"],
			description: "Select the separator style",
		},
		className: {
			control: { type: "text" },
			description: "Additional class name for the breadcrumb",
		},
	},
};

export default meta;

const Template: StoryFn<typeof Breadcrumb> = (args) => <Breadcrumb {...args} />;

export const Default = Template.bind({});
Default.args = {
	items: [
		{ text: <Paragraph>Home</Paragraph>, href: "/" },
		{ text: <Paragraph>Library</Paragraph>, href: "/library" },
		{ text: <Paragraph>Data</Paragraph>, href: "/library/data" },
	],
	separator: "default",
};

export const WithSlashSeparator = Template.bind({});
WithSlashSeparator.args = {
	items: [
		{ text: <Paragraph>Home</Paragraph>, href: "/" },
		{ text: <Paragraph>Library</Paragraph>, href: "/library" },
		{ text: <Paragraph>Data</Paragraph>, href: "/library/data" },
	],
	separator: "slash",
};

export const WithBackslashSeparator = Template.bind({});
WithBackslashSeparator.args = {
	items: [
		{ text: <Paragraph>Home</Paragraph>, href: "/" },
		{ text: <Paragraph>Library</Paragraph>, href: "/library" },
		{ text: <Paragraph>Data</Paragraph>, href: "/library/data" },
	],
	separator: "backslash",
};

export const WithDotSeparator = Template.bind({});
WithDotSeparator.args = {
	items: [
		{ text: <Paragraph>Home</Paragraph>, href: "/" },
		{ text: <Paragraph>Library</Paragraph>, href: "/library" },
		{ text: <Paragraph>Data</Paragraph>, href: "/library/data" },
	],
	separator: "dot",
};

export const CustomIconSeparator = Template.bind({});
CustomIconSeparator.args = {
	items: [
		{ text: <IconMagnify size="small" />, href: "/" },
		{ text: <Paragraph>Library</Paragraph>, href: "/library" },
		{ text: <Paragraph>Data</Paragraph>, href: "/library/data" },
	],
	separator: "slash",
};

export const CustomItems = () => (
	<Breadcrumb
		items={[
			{ text: <IconMagnify />, href: "/" },
			{ text: <Paragraph>Controller</Paragraph>, href: "/library" },
			{ text: <Paragraph>View</Paragraph>, href: "/library/data" },
			{ text: <Paragraph>Analytics</Paragraph>, href: "/library/analytics" },
		]}
		separator="default"
	/>
);

export const MixedContent = () => (
	<Breadcrumb
		items={[
			{ text: <Paragraph>Home</Paragraph>, href: "/" },
			{ text: <Paragraph>Library</Paragraph>, href: "/library" },
			{
				text: (
					<Paragraph>
						<strong>Data</strong>
					</Paragraph>
				),
				href: "/library/data",
			},
			{ text: <Paragraph>Reports</Paragraph> },
			{ text: <Paragraph>Analytics</Paragraph>, href: "/library/analytics" },
		]}
		separator="dot"
	/>
);
