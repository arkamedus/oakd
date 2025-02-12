import React from "react";
import { Meta } from "@storybook/react";
import Select from "./Select";
import Paragraph from "../Paragraph/Paragraph";

const meta: Meta<typeof Select> = {
	title: "Design System/Atomic/Select",
	component: Select,
	argTypes: {
		placeholder: {
			control: "text",
			description: "Placeholder when no selection is made",
		},
		type: {
			control: {
				type: "select",
				options: ["default", "primary", "danger", "warning", "ghost", "disabled"],
			},
			description: "Button type for the select trigger",
			defaultValue: "ghost",
		},
		size: {
			control: {
				type: "select",
				options: ["default", "small", "large"],
			},
			description: "Size of the select trigger button",
			defaultValue: "default",
		},
	},
};
export default meta;

export const Default = () => (
	<Select
		options={[
			{ value: "1", element: <Paragraph>Option 1</Paragraph> },
			{ value: "2", element: <Paragraph>Option 2</Paragraph> },
		]}
		onSelected={(val) => console.log(val)}
		placeholder="Default placeholder"
	/>
);

export const WithCategories = () => (
	<Select
		options={[
			{ value: "a", element: <Paragraph>Apple</Paragraph>, category: "Fruits" },
			{ value: "b", element: <Paragraph>Banana</Paragraph>, category: "Fruits" },
			{ value: "c", element: <Paragraph>Carrot</Paragraph>, category: "Vegetables" },
		]}
		onSelected={(val) => console.log(val)}
		categorize={{ property: "category", order: ["Fruits", "Vegetables"] }}
		placeholder="Choose an option"
	/>
);

export const LongOptions = () => (
	<Select
		options={[
			{ value: "x", element: <Paragraph>Very long option text that might overflow</Paragraph> },
			{ value: "y", element: <Paragraph>Another long option text that should be handled correctly</Paragraph> },
		]}
		onSelected={(val) => console.log(val)}
		placeholder="Select a long option"
	/>
);

export const NoOptions = () => (
	<Select
		options={[]}
		onSelected={(val) => console.log(val)}
		placeholder="No options available"
	/>
);