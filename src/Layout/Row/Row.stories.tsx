import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Row from "./Row";
import Col from "../Column/Column";
import DebugLayer from "../../Atom/DebugLayer/DebugLayer";
import Column from "../Column/Column";

const meta: Meta<typeof Row> = {
	title: "Design System/Layout/Row",
	argTypes: {
		pastel: {
			control: "boolean",
			description: "Toggle pastel background colors",
			defaultValue: false,
		},
	},
} as Meta;
export default meta;

const Template: StoryFn<{ pastel: boolean; gap: boolean }> = ({
	pastel,
	gap,
}) => (
	<Row className={pastel ? "pastel-container" : ""} gap={gap}>
		<Col xs={12}>
			<DebugLayer label="DebugLayer (Column xs=12)" />
		</Col>
		<Col xs={12}>
			<DebugLayer label="DebugLayer (Column xs=12)" />
		</Col>
	</Row>
);

export const Default = Template.bind({});
Default.args = { pastel: false, gap: false };

export const withColumnsGap = Template.bind({});
withColumnsGap.args = { pastel: true, gap: true };

export const withResponsiveColumnsGap = () => (
	<Row gap>
		<Column xs={24}>
			<DebugLayer label={"DebugLayer (Column 1)"} />
		</Column>
		<Column xs={24} md={12}>
			<DebugLayer />
		</Column>
		<Column xs={24} md={12}>
			<DebugLayer />
		</Column>
	</Row>
);
