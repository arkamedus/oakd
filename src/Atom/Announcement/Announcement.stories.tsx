import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import Announcement from "./Announcement";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";
import Card from "../Card/Card";
import Title from "../Title/Title";
import Button from "../Button/Button";
import Icon from "../../Icon/Icon";

const meta: Meta<typeof Announcement> = {
	title: "Design System/Atomic/Announcement",
	component: Announcement,
};

export default meta;

type Story = StoryObj<typeof Announcement>;

export const Default: Story = {
	args: {
		variant: "default",
		closable: true,
		wide: true,
		children: (
			<Paragraph>
				It gets better! <a href="https://example.com">Eventually</a>...
			</Paragraph>
		),
	},
};

export const WithCloseButton: Story = {
	render: () => {
		const [open, setOpen] = useState(true);
		return open ? (
			<Announcement
				variant="primary"
				wide
				closable
				onClose={() => setOpen(false)}
			>
				<Paragraph>
					<strong>Deployment notice</strong> | The billing migration starts in
					15 minutes.
				</Paragraph>
			</Announcement>
		) : (
			<Button variant="default" onClick={() => setOpen(true)}>
				<Paragraph>Show announcement</Paragraph>
			</Button>
		);
	},
};

export const VariantGallery: Story = {
	render: () => (
		<Space direction="vertical" gap wide>
			{(
				["default", "primary", "active", "warning", "danger", "ghost"] as const
			).map((variant) => (
				<Announcement key={variant} variant={variant} wide>
					<Paragraph>
						<strong>{variant}</strong> announcement
					</Paragraph>
				</Announcement>
			))}
		</Space>
	),
};

export const ResultSuccess: Story = {
	render: () => (
		<Card pad wide>
			<Space direction="vertical" gap align="center" wide>
				<Title>
					<Space gap align="center" justify="center" wide>
						<Icon name="Check" />
						<span>Successfully Purchased</span>
					</Space>
				</Title>
				<Paragraph>Order number: 123456789</Paragraph>
				<Announcement variant="active" wide icon="Check">
					<Paragraph>
						Your order is confirmed and the receipt has been emailed.
					</Paragraph>
				</Announcement>
				<Button variant="primary">
					<Paragraph>Go to Dashboard</Paragraph>
				</Button>
			</Space>
		</Card>
	),
};

export const ResultError: Story = {
	render: () => (
		<Card pad wide>
			<Space direction="vertical" gap align="center" wide>
				<Title>
					<Space gap align="center" justify="center" wide>
						<Icon name="X" />
						<span>Failure in Action...</span>
					</Space>
				</Title>
				<Paragraph>Order number: 123456789</Paragraph>
				<Announcement variant="warning" wide icon="X">
					<Paragraph>
						The capture completed, but payment confirmation is still pending.
					</Paragraph>
				</Announcement>
				<Button variant="warning">
					<Paragraph>Go to Dashboard</Paragraph>
				</Button>
			</Space>
		</Card>
	),
};
