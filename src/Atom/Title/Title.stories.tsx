import React from "react";
import { Meta } from "@storybook/react";

import Title from "./Title";
import { IconFolder } from "../../Icon/Icons.bin";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";

const TitleSizes = (props: React.ComponentProps<typeof Title>) => (
  <Space direction="vertical" gap>
    {(["small", "default", "large", "huge"] as const).map(size => <Title {...props} key={size} size={size} />)}
  </Space>
);

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

export const Default = () => <TitleSizes>Quarterly planning</TitleSizes>;
export const Multiline = () => (
	<TitleSizes>
		Design review
		<br />
		notes
	</TitleSizes>
);
export const WithIcon = () => (
	<Space direction="vertical" gap>
		<TitleSizes>
			Assets <IconFolder size={"large"} />
		</TitleSizes>
		<Paragraph>
			Use titles to anchor sections and orient the reader quickly.
		</Paragraph>
	</Space>
);
