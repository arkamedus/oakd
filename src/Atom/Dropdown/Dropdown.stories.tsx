import React from "react";
import { Meta } from "@storybook/react";
import Dropdown from "./Dropdown";
import Paragraph from "../Paragraph/Paragraph";
import Aspect from "../../Layout/Aspect/Aspect";

const meta: Meta<typeof Dropdown> = {
	title: "Design System/Atomic/Dropdown",
	component: Dropdown,
	argTypes: {
		/* ... */
	},
};
export default meta;

export const Default = () => <Dropdown />;

export const WithBaz = () => (
	<Dropdown>
		<Paragraph>Child Text</Paragraph>
	</Dropdown>
);
export const Positioned = () => (
	<Aspect ratio={"21x9"}>
		{" "}
		<Dropdown direction={"bottom-right"}>
			<Paragraph>Child Text</Paragraph>
		</Dropdown>
	</Aspect>
);
