import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Card from "../../Atom/Card/Card";
import Paragraph from "../../Atom/Paragraph/Paragraph";
import Space from "../../Atom/Space/Space";
import Title from "../../Atom/Title/Title";
import Page from "../Page/Page";
import ContentRail from "./ContentRail";
const meta: Meta<typeof ContentRail> = {
	title: "Design System/Layout/ContentRail",
	component: ContentRail,
};
export default meta;
type Story = StoryObj<typeof ContentRail>;
export const WidthsAndGutters: Story = {
	render: () => (
		<Page gap>
			<Space direction="vertical" gap wide>
				{(["sm", "md", "lg", "xl", "full"] as const).map((size) => (
					<ContentRail key={size} size={size} gutter={size !== "full"}>
						<Card pad>
							<Title size="small">{size}</Title>
							<Paragraph>
								{size === "full"
									? "Full width without gutters"
									: "Centered rail with responsive gutters"}
							</Paragraph>
						</Card>
					</ContentRail>
				))}
			</Space>
		</Page>
	),
};
