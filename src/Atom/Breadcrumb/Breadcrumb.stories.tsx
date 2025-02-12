import React from "react";
import { Meta, StoryObj, StoryFn } from "@storybook/react";
import Breadcrumb from "./Breadcrumb";
import { IconMagnify } from "../../Icon/Icons.bin";

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
type Story = StoryObj<typeof Breadcrumb>;

const Template: StoryFn = (args) => <Breadcrumb {...args} />;

export const Default = Template.bind({});
Default.args = {
	items: [
		{ text: "Home", href: "/" },
		{ text: "Library", href: "/library" },
		{ text: "Data", href: "/library/data" },
	],
	separator: "default",
};

export const WithSlashSeparator = Template.bind({});
WithSlashSeparator.args = {
	items: [
		{ text: "Home", href: "/" },
		{ text: "Library", href: "/library" },
		{ text: "Data", href: "/library/data" },
	],
	separator: "slash",
};

export const WithBackslashSeparator = Template.bind({});
WithBackslashSeparator.args = {
	items: [
		{ text: "Home", href: "/" },
		{ text: "Library", href: "/library" },
		{ text: "Data", href: "/library/data" },
	],
	separator: "backslash",
};

export const WithDotSeparator = Template.bind({});
WithDotSeparator.args = {
	items: [
		{ text: "Home", href: "/" },
		{ text: "Library", href: "/library" },
		{ text: "Data", href: "/library/data" },
	],
	separator: "dot",
};

export const CustomIconSeparator = Template.bind({});
CustomIconSeparator.args = {
	items: [
		{ text: "Home", href: "/", icon: <IconMagnify size="small" /> },
		{ text: "Library", href: "/library", icon: <IconMagnify size="small" /> },
		{ text: "Data", href: "/library/data", icon: <IconMagnify size="small" /> },
	],
	separator: "slash",
};

export const CustomItems = () => (
	<Breadcrumb
		items={[
			{ text: <IconMagnify />, href: "/" },
			{ text: "Controller", href: "/library" },
			{ text: "View", href: "/library/data" },
			{ text: "Analytics", href: "/library/analytics" },
		]}
		separator="default"
	/>
);

export const MixedContent = () => (
	<Breadcrumb
		items={[
			{ text: "Home", href: "/" },
			{ text: "Library", href: "/library" },
			{ text: <strong>Data</strong>, href: "/library/data" },
			{ text: "Reports" },
			{ text: "Analytics", href: "/library/analytics" },
		]}
		separator="dot"
	/>
);
