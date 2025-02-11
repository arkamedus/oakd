import React from "react";
import { Meta } from "@storybook/react";
import Select from "./Select";
import Paragraph from "../Paragraph/Paragraph";

const meta: Meta<typeof Select> = {
	title: "Select",
	component: Select,
	argTypes: {
		placeholder: {
			control: "text",
			description: "Placeholder when no selection is made",
		},
		type: {
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
			description: "Button type for the select trigger",
			defaultValue: "ghost",
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
			{
				value: "b",
				element: <Paragraph>Banana</Paragraph>,
				category: "Fruits",
			},
			{
				value: "c",
				element: <Paragraph>Carrot</Paragraph>,
				category: "Vegetables",
			},
		]}
		onSelected={(val) => console.log(val)}
		categorize={{ property: "category", order: ["Fruits", "Vegetables"] }}
		placeholder="Choose an option"
	/>
);
