import React from "react";
import { Meta } from "@storybook/react";
import Card from "./Card";
import Space from "../Space/Space";
import Title from "../Title/Title";
import Paragraph from "../Paragraph/Paragraph";
import DebugLayer from "../DebugLayer/DebugLayer";
import Button from "../Button/Button";
import Divider from "../Divider/Divider";
import Content from "../../Layout/Content/Content";

const meta: Meta<typeof Card> = {
	title: "Design System/Atomic/Card",
	component: Card,
	argTypes: {},
};
export default meta;

export const Default = () => (
	<Card pad>
		<Space direction="vertical" gap>
			<Title>Team workspace</Title>
			<Paragraph>
				A lightweight surface for grouping related information and actions.
			</Paragraph>
		</Space>
	</Card>
);

export const WithContent = () => (
	<Card>
		<Content pad>
			<Space direction="vertical" gap>
				<Title>Release overview</Title>
				<Paragraph>
					Share the launch summary, important callouts, and the next decision a
					teammate should make.
				</Paragraph>
			</Space>
		</Content>
	</Card>
);

export const WithContentActions = () => (
	<Card>
		<Content pad>
			<Space direction="vertical" gap>
				<Title>Card with Actions</Title>
				<Paragraph>Some content inside the card.</Paragraph>
				<Divider />
				<Space justify="end" gap wide>
					<Button icon="Check" variant="primary">
						<Paragraph>Accept</Paragraph>
					</Button>
					<Button icon="X" variant="danger">
						<Paragraph>Decline</Paragraph>
					</Button>
				</Space>
			</Space>
		</Content>
	</Card>
);

export const VariantGallery = () => (
	<Space gap>
		<Card>
			<Content pad>
				<Title>Default</Title>
				<Paragraph>Neutral surface for everyday content.</Paragraph>
			</Content>
		</Card>
		<Card type={"active"}>
			<Content pad>
				<Title>Active</Title>
				<Paragraph>Used to show the currently selected panel.</Paragraph>
			</Content>
		</Card>
		<Card type={"primary"}>
			<Content pad>
				<Title>Primary</Title>
				<Paragraph>Emphasized card for featured information.</Paragraph>
			</Content>
		</Card>
		<Card type={"ghost"}>
			<Content pad>
				<Title>Ghost</Title>
				<Paragraph>Subtle treatment for low-emphasis groupings.</Paragraph>
			</Content>
		</Card>
		<Card type={"warning"}>
			<Content pad>
				<Title>Warning</Title>
				<Paragraph>Calls attention to an action that needs review.</Paragraph>
			</Content>
		</Card>
		<Card type={"danger"}>
			<Content pad>
				<Title>Danger</Title>
				<Paragraph>Critical states or destructive flows.</Paragraph>
			</Content>
		</Card>
		<Card type={"disabled"}>
			<Content pad>
				<Title>Disabled</Title>
				<Paragraph>Unavailable or locked content.</Paragraph>
			</Content>
		</Card>
	</Space>
);

export const EmptyState = () => (
	<Card>
		<Content pad>
			<Space direction="vertical" gap align="center" wide>
				<Title>No items yet</Title>
				<Paragraph>
					This workspace is empty. Add a source, import a dataset, or create a
					new record to begin.
				</Paragraph>
				<Button variant="primary">
					<Paragraph>Create first item</Paragraph>
				</Button>
			</Space>
		</Content>
	</Card>
);

export const SuccessState = () => (
	<Card type="active">
		<Content pad>
			<Space direction="vertical" gap align="center" wide>
				<Title>Successfully Purchased</Title>
				<Paragraph>Order number: 123456789</Paragraph>
				<Button variant="primary">
					<Paragraph>Go to Dashboard</Paragraph>
				</Button>
			</Space>
		</Content>
	</Card>
);

export const ErrorState = () => (
	<Card type="warning">
		<Content pad>
			<Space direction="vertical" gap align="center" wide>
				<Title>Failure in Action...</Title>
				<Paragraph>Order number: 123456789</Paragraph>
				<Button variant="warning">
					<Paragraph>Review issue</Paragraph>
				</Button>
			</Space>
		</Content>
	</Card>
);

export const CompactStatus = () => (
	<Card pad>
		<Space gap justify="between" wide align="center">
			<Space direction="vertical" gap>
				<Paragraph>
					<strong>Render queue</strong>
				</Paragraph>
				<Paragraph>3 scenes still processing.</Paragraph>
			</Space>
			<Button variant="active">
				<Paragraph>Live</Paragraph>
			</Button>
		</Space>
	</Card>
);

export const ActionSummary = () => (
	<Card>
		<Content pad>
			<Space direction="vertical" gap>
				<Title>Approve campaign assets</Title>
				<Paragraph>
					The revised landing page set is ready for review and can be handed to
					the launch team.
				</Paragraph>
				<Divider />
				<Space justify="end" gap wide>
					<Button variant="ghost">
						<Paragraph>Request changes</Paragraph>
					</Button>
					<Button variant="primary">
						<Paragraph>Approve</Paragraph>
					</Button>
				</Space>
			</Space>
		</Content>
	</Card>
);
