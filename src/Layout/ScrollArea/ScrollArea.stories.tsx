import React, { useRef } from "react";
import { Meta, StoryObj } from "@storybook/react";
import Button from "../../Atom/Button/Button";
import Card from "../../Atom/Card/Card";
import Paragraph from "../../Atom/Paragraph/Paragraph";
import Space from "../../Atom/Space/Space";
import Page from "../Page/Page";
import ScrollArea from "./ScrollArea";
import { ScrollAreaHandle } from "./ScrollArea.types";
const meta: Meta<typeof ScrollArea> = {
	title: "Design System/Layout/ScrollArea",
	component: ScrollArea,
	parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof ScrollArea>;
const Items = () => (
	<Space direction="vertical" gap wide>
		{Array.from({ length: 18 }, (_, index) => (
			<Card key={index} pad>
				<Paragraph>Transcript entry {index + 1}</Paragraph>
			</Card>
		))}
	</Space>
);
export const VerticalNativeAndImperative: Story = {
	render: () => {
		const Demo = () => {
			const ref = useRef<ScrollAreaHandle>(null);
			return (
				<Page fixed>
					<Button onClick={() => ref.current?.scrollToEnd("smooth")}>
						<Paragraph>Scroll to end</Paragraph>
					</Button>
					<ScrollArea
						ref={ref}
						orientation="vertical"
						scrollbar="native"
						stickToEnd
						endThreshold={16}
						grow
					>
						<Items />
					</ScrollArea>
				</Page>
			);
		};
		return <Demo />;
	},
};
export const HiddenHorizontal: Story = {
	render: () => (
		<ScrollArea orientation="horizontal" scrollbar="hidden">
			<Space gap noWrap>
				{Array.from({ length: 12 }, (_, index) => (
					<Card key={index} pad>
						<Paragraph>Column {index + 1}</Paragraph>
					</Card>
				))}
			</Space>
		</ScrollArea>
	),
};
export const BothAxes: Story = {
	args: { orientation: "both", scrollbar: "native", children: <Items /> },
};
