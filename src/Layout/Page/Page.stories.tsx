import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Page from "./Page";
import Content, { ContentRow } from "../Content/Content";
import Row from "../Row/Row";
import { Col } from "../Column/Column";
import Aspect from "../Aspect/Aspect";
import Paragraph from "../../Atom/Paragraph/Paragraph";
import Space from "../../Atom/Space/Space";
import Title from "../../Atom/Title/Title";
import Select from "../../Atom/Select/Select";
import Card from "../../Atom/Card/Card";
import Button from "../../Atom/Button/Button";
import Tabs, { Tab } from "../../Atom/Tabs/Tabs";
import Pagination from "../../Atom/Pagination/Pagination";

const meta: Meta<typeof Page> = {
	title: "Design System/Layout/Page",
	component: Page,
	argTypes: {
		fixed: {
			control: { type: "boolean" },
			description: "Whether the page is fixed to viewport",
		},
		gap: {
			control: { type: "boolean" },
			description: "Whether page sections should have spacing between them",
		},
		className: {
			control: { type: "text" },
			description: "Additional class name",
		},
	},
	parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof Page>;

const releaseUpdates = [
	"Marketing approved the revised launch copy after the pricing note was added.",
	"Support published a troubleshooting macro for delayed provisioning tickets.",
	"Analytics confirmed the event backfill is complete for enterprise workspaces.",
	"Product moved the onboarding tooltip fix into the current release train.",
];

const activityFeed = [
	{
		title: "Renewal follow-up",
		body: "Sergio reached out to the procurement contact after the contract redlines were returned overnight.",
	},
	{
		title: "Billing verification",
		body: "Maya validated the tax handling fix against three affected accounts and logged the before/after results.",
	},
	{
		title: "Rollout note",
		body: "River added a reminder to pause exports before rotating the webhook secret in production.",
	},
	{
		title: "Customer response",
		body: "The customer success team confirmed the revised invoice layout resolved last week's formatting complaint.",
	},
];

const metricCard = (label: string, value: string, detail: string) => (
	<Card pad wide>
		<Space direction="vertical" gap>
			<Paragraph className="muted-heavy">{label}</Paragraph>
			<Title>{value}</Title>
			<Paragraph>{detail}</Paragraph>
		</Space>
	</Card>
);

const feedCard = (title: string, body: string) => (
	<Card pad wide>
		<Space direction="vertical" gap>
			<Title>{title}</Title>
			<Paragraph>{body}</Paragraph>
		</Space>
	</Card>
);

export const Default: Story = {
	args: {
		gap: false,
	},
	render: (args) => (
		<Aspect ratio="16x9">
			<Page {...args}>
				<Content pad>
					<Title>Simple page</Title>
					<Paragraph>
						Start with `Page` as the outer wrapper, then place your sections
						inside it.
					</Paragraph>
				</Content>
			</Page>
		</Aspect>
	),
};

export const WithGap: Story = {
	args: {
		gap: true,
	},
	render: (args) => (
		<Aspect ratio="16x9">
			<Page {...args}>
				<Content pad>
					<Title>Header</Title>
				</Content>
				<Content pad>
					<Paragraph>
						Gap adds breathing room between stacked page sections.
					</Paragraph>
				</Content>
			</Page>
		</Aspect>
	),
};

export const BasicAppShell: Story = {
	render: () => (
		<Aspect ratio="21x9">
			<Page gap>
				<Content pad>
					<Space justify="between" align="center" wide>
						<Space direction="vertical">
							<Title>Customer Workspace</Title>
							<Paragraph>
								Review open work and act on the most urgent accounts.
							</Paragraph>
						</Space>
						<Button variant="primary">Create task</Button>
					</Space>
				</Content>
				<Content grow pad>
					<Row gap>
						<Col xs={24}>
							<Card pad wide>
								<Paragraph>
									Main content lives inside the page body, whether that body is
									a single panel, a grid, or a full workflow.
								</Paragraph>
							</Card>
						</Col>
					</Row>
				</Content>
			</Page>
		</Aspect>
	),
};

export const AnalyticsDashboard: Story = {
	render: () => (
		<Aspect ratio="21x9">
			<Page gap fixed>
				<Content pad>
					<Space justify="between" align="center" wide>
						<Space direction="vertical">
							<Title>Revenue Dashboard</Title>
							<Paragraph>
								Weekly performance, rollout status, and the latest team notes.
							</Paragraph>
						</Space>
						<Space gap>
							<Select
								options={[
									{
										value: "overview",
										element: <Paragraph>Overview</Paragraph>,
									},
									{
										value: "pipeline",
										element: <Paragraph>Pipeline</Paragraph>,
									},
									{
										value: "retention",
										element: <Paragraph>Retention</Paragraph>,
									},
								]}
								onChange={() => undefined}
								placeholder="Choose a view"
							/>
							<Button variant="primary">Share report</Button>
						</Space>
					</Space>
				</Content>
				<Content grow pad>
					<Space direction="vertical" gap>
						<Row gap>
							<Col xs={24} md={8}>
								{metricCard("Net revenue", "$184,200", "Up 12% from last week")}
							</Col>
							<Col xs={24} md={8}>
								{metricCard(
									"Expansion deals",
									"26",
									"8 are ready for signature",
								)}
							</Col>
							<Col xs={24} md={8}>
								{metricCard("At-risk accounts", "9", "3 need follow-up today")}
							</Col>
						</Row>
						<Row gap>
							<Col xs={24} md={16}>
								{feedCard(
									"Pipeline highlights",
									"Mid-market renewals rebounded after the pricing clarification email. Enterprise deals are still waiting on procurement review.",
								)}
							</Col>
							<Col xs={24} md={8}>
								{feedCard(
									"Team notes",
									"Support flagged a billing mismatch in two accounts. Product confirmed the fix will land in the next release train.",
								)}
							</Col>
						</Row>
						<Row gap>
							<Col xs={24}>
								<Card pad wide>
									<Space direction="vertical" gap>
										<Title>Latest updates</Title>
										{releaseUpdates.map((update) => (
											<Paragraph key={update}>{update}</Paragraph>
										))}
									</Space>
								</Card>
							</Col>
						</Row>
						<Row gap>
							{activityFeed.map((item) => (
								<Col key={item.title} xs={24} md={12}>
									{feedCard(item.title, item.body)}
								</Col>
							))}
						</Row>
					</Space>
				</Content>
				<Content pad>
					<Paragraph>Updated 12 minutes ago by Sergio Diaz.</Paragraph>
				</Content>
			</Page>
		</Aspect>
	),
};

export const SidebarWorkspace: Story = {
	render: () => (
		<Aspect ratio="21x9">
			<Page fixed gap>
				<Content pad>
					<Space justify="between" align="center" wide>
						<Title>Release Operations</Title>
						<Button variant="ghost">Open runbook</Button>
					</Space>
				</Content>
				<ContentRow grow>
					<Content pad style={{ minWidth: 280 }}>
						<Space direction="vertical" gap>
							<Title>Queues</Title>
							<Button variant="primary">Launch checklist</Button>
							<Button variant="ghost">Approvals</Button>
							<Button variant="ghost">Incidents</Button>
							<Button variant="ghost">Post-launch notes</Button>
						</Space>
					</Content>
					<Content grow pad>
						<Space direction="vertical" gap>
							{feedCard(
								"Checklist progress",
								"7 of 9 launch steps are complete. The final sign-off is waiting on analytics verification.",
							)}
							{feedCard(
								"Approvals",
								"Security approved the new webhook scopes. Finance is still reviewing export permissions.",
							)}
							{feedCard(
								"Recent activity",
								"Maya posted a rollback plan, and River attached the release candidate build to the thread.",
							)}
							{feedCard(
								"Escalations",
								"One enterprise workspace still needs a manual sync after the permission scope change.",
							)}
							{feedCard(
								"Shift handoff",
								"The evening team should monitor export delays between 6 PM and 8 PM while the backlog clears.",
							)}
							{feedCard(
								"Next approvals",
								"Finance sign-off and support readiness are the last blockers before the maintenance window starts.",
							)}
						</Space>
					</Content>
				</ContentRow>
			</Page>
		</Aspect>
	),
};

export const KnowledgeBasePage: Story = {
	render: () => (
		<Aspect ratio="21x9">
			<Page gap fixed>
				<Content pad>
					<Space justify="between" align="center" wide>
						<Space direction="vertical">
							<Title>Integration Docs</Title>
							<Paragraph>
								Reference guides, rollout notes, and support-ready examples.
							</Paragraph>
						</Space>
						<Button variant="primary">New article</Button>
					</Space>
				</Content>
				<Content grow pad>
					<Tabs defaultActiveKey="guides">
						<Tab key="guides" label="Guides">
							<Space direction="vertical" gap>
								{feedCard(
									"Authentication setup",
									"Walks through token generation, callback validation, and how to rotate secrets without downtime.",
								)}
								{feedCard(
									"Webhook troubleshooting",
									"Covers signature mismatches, retry timing, and how to inspect failed deliveries.",
								)}
								{feedCard(
									"SSO provisioning notes",
									"Explains attribute mapping, first-login edge cases, and how to recover stale identity links.",
								)}
							</Space>
						</Tab>
						<Tab key="playbooks" label="Playbooks">
							<Space direction="vertical" gap>
								{feedCard(
									"Launch day playbook",
									"A step-by-step sequence for the release captain, support team, and analytics review.",
								)}
								{feedCard(
									"Rollback checklist",
									"Defines the threshold for rollback, who approves it, and what gets verified after recovery.",
								)}
								{feedCard(
									"Support handoff checklist",
									"Summarizes what the support lead should confirm before the release announcement goes out.",
								)}
							</Space>
						</Tab>
						<Tab key="updates" label="Updates">
							<Space direction="vertical" gap>
								{feedCard(
									"April changes",
									"Added a retained-events export example and clarified token refresh behavior.",
								)}
								{feedCard(
									"March changes",
									"Documented the new pagination behavior for bulk exports and updated the sandbox screenshots.",
								)}
								{feedCard(
									"February changes",
									"Expanded the API examples to show both webhook retries and idempotent reconciliation flows.",
								)}
							</Space>
						</Tab>
					</Tabs>
				</Content>
				<Content pad>
					<Space justify="between" align="center" wide>
						<Paragraph>Showing 6 articles across 3 sections.</Paragraph>
						<Pagination
							currentPage={2}
							maxPage={8}
							onPageChange={() => undefined}
							size="small"
						/>
					</Space>
				</Content>
			</Page>
		</Aspect>
	),
};
