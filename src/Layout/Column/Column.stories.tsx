import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Column from "./Column";
import DebugLayer from "../../Atom/DebugLayer/DebugLayer";
import Row from "../Row/Row";
import Aspect from "../Aspect/Aspect";

const meta: Meta<typeof Column> = {
	title: "Design System/Layout/Column",
	component: Column,
	argTypes: {
		xs: {
			control: { type: "number", min: 1, max: 24 },
			description: "Grid width on extra small screens",
		},
		sm: {
			control: { type: "number", min: 1, max: 24 },
			description: "Grid width on small screens",
		},
		md: {
			control: { type: "number", min: 1, max: 24 },
			description: "Grid width on medium screens",
		},
		lg: {
			control: { type: "number", min: 1, max: 24 },
			description: "Grid width on large screens",
		},
		xl: {
			control: { type: "number", min: 1, max: 24 },
			description: "Grid width on extra-large screens",
		},
		xls: {
			control: { type: "number", min: 1, max: 24 },
			description: "Grid width on extra-extra-large screens",
		},
	},
};
export default meta;

const Template: StoryFn<typeof Column> = (args) => (
	<Column {...args}>
		<DebugLayer label="Responsive column" />
	</Column>
);

export const Default = Template.bind({});
Default.args = { xs: 24, md: 12, lg: 8 };

export const DashboardGrid = () => (
	<Row gap>
		<Column xs={24}>
			<DebugLayer label={"Header panel"} />
		</Column>
		<Column xs={24} md={12}>
			<Aspect ratio={"16x9"}>
				<DebugLayer label={"Traffic chart"} style={{ height: "100%" }} />
			</Aspect>
		</Column>
		<Column xs={24} md={12}>
			<DebugLayer label={"Conversion summary"} />
		</Column>
	</Row>
);
