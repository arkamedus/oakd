import React from "react";
import { Meta } from "@storybook/react";

import Title from "./Title";
import { IconFolder } from "../../Icon/Icons.bin";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";

const meta: Meta<typeof Title> = {
	title: "Design System/Atomic/Typography/Title",
	component: Title,
	argTypes: {
		size: {
			control: { type: "select" },
			options: ["default", "small", "large", "huge"],
		},
	},
};
export default meta;

export const Default = () => <Title>Quarterly planning</Title>;
export const Multiline = () => (
	<Title>
		Design review
		<br />
		notes
	</Title>
);
export const Large = () => (
	<Title size={"large"}>Infrastructure migration</Title>
);
export const Huge = () => (
	<Title size={"huge"}>Launch readiness dashboard</Title>
);

export const WithIcon = () => (
	<Space direction="vertical" gap>
		<Title>
			Assets <IconFolder size={"large"} />
		</Title>
		<Paragraph>
			Use titles to anchor sections and orient the reader quickly.
		</Paragraph>
	</Space>
);
