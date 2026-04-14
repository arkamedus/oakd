import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Row from "./Row";
import Col from "../Column/Column";
import DebugLayer from "../../Atom/DebugLayer/DebugLayer";

const meta: Meta<typeof Row> = {
	title: "Design System/Layout/Row",
	component: Row,
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

export const WithColumnsGap = Template.bind({});
WithColumnsGap.args = { pastel: true, gap: true };

export const AnalyticsLayout = () => (
	<Row gap>
		<Col xs={24}>
			<DebugLayer label={"Top summary"} />
		</Col>
		<Col xs={24} md={12}>
			<DebugLayer label={"Channel breakdown"} />
		</Col>
		<Col xs={24} md={12}>
			<DebugLayer label={"Recent activity"} />
		</Col>
	</Row>
);
