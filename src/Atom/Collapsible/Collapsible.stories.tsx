import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Collapsible from "./Collapsible";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Title from "../Title/Title";
import Content from "../../Layout/Content/Content";

const meta: Meta<typeof Collapsible> = {
	title: "Design System/Atomic/Collapsible",
	component: Collapsible,
	argTypes: {
		defaultOpen: { control: "boolean" },
		onToggle: { action: "toggled" },
	},
};

export default meta;

type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
	args: {
		title: (
			<Paragraph>
				<strong>Deployment summary</strong>
			</Paragraph>
		),
		defaultOpen: false,
		children: (
			<Content pad>
				<Space direction="vertical" gap>
					<Paragraph>
						API error rate returned to baseline after rollback.
					</Paragraph>
					<Paragraph>
						The database migration has been postponed to the next maintenance
						window.
					</Paragraph>
				</Space>
			</Content>
		),
	},
};

export const WithDefaultOpen: Story = {
	args: {
		title: (
			<Paragraph>
				<strong>Authentication checklist</strong>
			</Paragraph>
		),
		defaultOpen: true,
		children: (
			<Content pad>
				<Paragraph>
					Confirm the callback URL, rotate stale credentials, and validate
					refresh token expiry before launch.
				</Paragraph>
			</Content>
		),
	},
};

export const WithCustomTitleText: Story = {
	args: {
		title: <Title>Release Readiness</Title>,
		children: (
			<Content pad>
				<Paragraph>
					Using a larger title component should still preserve the toggle
					layout, icon alignment, and content spacing.
				</Paragraph>
			</Content>
		),
	},
};

export const MultipleCollapsibles: Story = {
	render: () => (
		<Space direction="vertical" gap style={{ maxWidth: 720 }}>
			<Title>Implementation Notes</Title>
			<Collapsible
				title={
					<Paragraph>
						<strong>Authentication checklist</strong>
					</Paragraph>
				}
				defaultOpen
			>
				<Content pad>
					<Paragraph>
						Confirm the callback URL, rotate stale credentials, and validate
						refresh token expiry before launch.
					</Paragraph>
				</Content>
			</Collapsible>
			<Collapsible
				title={
					<Paragraph>
						<strong>Known rollout risks</strong>
					</Paragraph>
				}
			>
				<Content pad>
					<Paragraph>
						Teams with older SSO mappings may need a manual resync after the
						first production login.
					</Paragraph>
				</Content>
			</Collapsible>
			<Collapsible
				title={
					<Paragraph>
						<strong>Support handoff notes</strong>
					</Paragraph>
				}
			>
				<Content pad>
					<Paragraph>
						The evening team should watch webhook retries and confirm export
						jobs complete before the maintenance window closes.
					</Paragraph>
				</Content>
			</Collapsible>
		</Space>
	),
};
