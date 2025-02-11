import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Pagination from "./Pagination";
import DebugLayer from "../DebugLayer/DebugLayer";
import Space from "../Space/Space";
import { IconMagnify, IconList, IconStar } from "../../Icon/Icons.bin";

const meta: Meta<typeof Pagination> = {
	title: "Design System/Atomic/Pagination",
	component: Pagination,
	tags: ["!autodocs"],
	argTypes: {
		maxPage: { control: "number" },
		currentPage: { control: "number" },
	},
};
export default meta;

const Template: StoryFn<typeof Pagination> = (args) => <Pagination {...args} />;

export const DefaultPagination = Template.bind({});
DefaultPagination.args = {
	maxPage: 100,
	currentPage: 2,
	showPreviousNext: true,
	showNumbers: true,
	showEllipsis: true,
	size: "small",
};

export const InTheMiddle = Template.bind({});
InTheMiddle.args = {
	maxPage: 100,
	currentPage: 52,
	showPreviousNext: true,
	showNumbers: true,
	showEllipsis: true,
	size: "small",
};

export const ReducedFunctionalityPagination = Template.bind({});
ReducedFunctionalityPagination.args = {
	maxPage: 20,
	currentPage: 4,
	showPreviousNext: false,
	showNumbers: true,
	showEllipsis: false,
};

export const LimitedPagesVariation = Template.bind({});
LimitedPagesVariation.args = {
	maxPage: 10,
	currentPage: 1,
};

export const DebugLayerPagination = () => (
	<DebugLayer label={"DebugLayer inside Pagination"}>
		<Pagination
			currentPage={1}
			maxPage={10}
			showPreviousNext={true}
			showNumbers={true}
			showEllipsis={true}
		/>
	</DebugLayer>
);
