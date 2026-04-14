import React from "react";
import { Meta } from "@storybook/react";
import Content from "./Content";
import DebugLayer from "../../Atom/DebugLayer/DebugLayer";
import Paragraph from "../../Atom/Paragraph/Paragraph";
import Space from "../../Atom/Space/Space";
import Title from "../../Atom/Title/Title";

const meta: Meta<typeof Content> = {
	title: "Design System/Atomic/Content",
	component: Content,
};
export default meta;

export const Default = () => (
	<Content>
		<Space direction="vertical" gap>
			<Title>Overview</Title>
			<Paragraph>
				Content provides predictable inner spacing for grouped UI.
			</Paragraph>
		</Space>
	</Content>
);

export const WithPadding = () => (
	<DebugLayer label={"DebugLayer"}>
		<Content pad>
			<Paragraph>Paragraph text.</Paragraph>
		</Content>
	</DebugLayer>
);

export const WithPaddingHorizontal = () => (
	<DebugLayer label={"DebugLayer"}>
		<Content pad={"horizontal"}>
			<Paragraph>Paragraph text.</Paragraph>
		</Content>
	</DebugLayer>
);

export const WithPaddingVertical = () => (
	<DebugLayer label={"DebugLayer"}>
		<Content pad={"vertical"}>
			<Paragraph>Paragraph text.</Paragraph>
		</Content>
	</DebugLayer>
);
