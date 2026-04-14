import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Pagination from "./Pagination";
import Card from "../Card/Card";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Title from "../Title/Title";

const meta: Meta<typeof Pagination> = {
	title: "Design System/Atomic/Pagination",
	component: Pagination,
	tags: ["!autodocs"],
	argTypes: {
		maxPage: { control: "number" },
		currentPage: { control: "number" },
		count: { control: "number" },
		onPageChange: { action: "page changed" },
	},
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
	args: {
		maxPage: 10,
		currentPage: 2,
		count: 5,
		showPreviousNext: true,
		showNumbers: true,
		showEllipsis: true,
		size: "small",
	},
};

export const WithSearchResultsContext: Story = {
	args: {
		maxPage: 48,
		currentPage: 6,
		count: 5,
		showPreviousNext: true,
		showNumbers: true,
		showEllipsis: true,
		size: "small",
	},
	render: (args) => (
		<Card pad wide style={{ maxWidth: 720 }}>
			<Space direction="vertical" gap>
				<Title>Customer search results</Title>
				<Paragraph>
					Showing 126-150 of 1,184 matching customers for "renewal overdue".
				</Paragraph>
				<Pagination {...args} />
			</Space>
		</Card>
	),
};

export const WithManyPages: Story = {
	args: {
		maxPage: 100,
		currentPage: 52,
		count: 5,
		showPreviousNext: true,
		showNumbers: true,
		showEllipsis: true,
		size: "small",
	},
};

export const WithoutPreviousNext: Story = {
	args: {
		maxPage: 20,
		currentPage: 4,
		count: 5,
		showPreviousNext: false,
		showNumbers: true,
		showEllipsis: false,
	},
};
