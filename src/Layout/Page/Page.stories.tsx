import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Page from "./Page";
import Content from "../Content/Content";
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
import MultiLineChart from "../../Atom/MultiLineChart/MultiLineChart";
import StackedBreakdownChart from "../../Atom/StackedBreakdownChart/StackedBreakdownChart";
import EmbeddingHeatmap from "../../Atom/EmbeddingHeatmap/EmbeddingHeatmap";
import LabelBars from "../../Atom/LabelBars/LabelBars";

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

const queueItems = [
	{
		title: "Invoice mismatch",
		body: "The customer attached two invoices showing different tax handling between March and April.",
	},
	{
		title: "Provisioning retry",
		body: "Support needs confirmation that yesterday’s workspace sync completed before closing the ticket.",
	},
	{
		title: "Renewal approval",
		body: "Finance wants one last review of the export permissions before the amendment is countersigned.",
	},
	{
		title: "Sandbox handoff",
		body: "The solutions team asked for an updated workspace with the new webhook scopes enabled by noon.",
	},
	{
		title: "Usage spike review",
		body: "Analytics flagged an unexpected export increase in one enterprise workspace after the backfill completed.",
	},
	{
		title: "Customer follow-up",
		body: "The billing owner is waiting on confirmation that the corrected invoice was received and approved.",
	},
];

const guideItems = [
	{
		title: "Authentication setup",
		body: "Explains token creation, callback validation, and safe secret rotation.",
	},
	{
		title: "Webhook troubleshooting",
		body: "Summarizes retry timing, signature mismatches, and failed delivery checks.",
	},
	{
		title: "SSO provisioning notes",
		body: "Covers attribute mapping, stale identity links, and first-login recovery steps.",
	},
	{
		title: "Bulk export behavior",
		body: "Documents pagination, retries, and how to resume interrupted exports safely.",
	},
	{
		title: "Sandbox verification",
		body: "Lists the checks the support team should complete before promoting a workspace configuration.",
	},
	{
		title: "Launch-day playbook",
		body: "Defines the release sequence, owner handoff, and rollback verification checkpoints.",
	},
];

const updateItems = [
	{
		title: "April changes",
		body: "Added a retained-events export example and clarified refresh token behavior.",
	},
	{
		title: "March changes",
		body: "Updated the bulk export pagination examples and the sandbox screenshots.",
	},
	{
		title: "February changes",
		body: "Expanded the rollback notes and added a support-ready launch checklist.",
	},
	{
		title: "January changes",
		body: "Documented the new invoice reconciliation flow for enterprise workspaces.",
	},
];

const noteCard = (title: string, body: string) => (
	<Card pad wide>
		<Space direction="vertical" gap>
			<Paragraph>
				<strong>{title}</strong>
			</Paragraph>
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
				<Content>
					<Space direction="vertical" gap>
						<Title>Simple page</Title>
						<Paragraph>
							Use `Page` as the outer shell, then place sections inside with
							`Content`.
						</Paragraph>
					</Space>
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
				<Content>
					<Title>Header</Title>
				</Content>
				<Content>
					<Paragraph>
						`gap` separates stacked page sections without extra wrapper spacing.
					</Paragraph>
				</Content>
				<Content>
					<Card pad wide>
						<Paragraph>Body section</Paragraph>
					</Card>
				</Content>
			</Page>
		</Aspect>
	),
};

export const WorkspaceSlice: Story = {
	render: () => (
		<Aspect ratio="21x9">
			<Page gap>
				<Content>
					<Space justify="between" align="center" wide>
						<Space direction="vertical" gap>
							<Title>Customer workspace</Title>
							<Paragraph>
								Review active work and move the next account forward.
							</Paragraph>
						</Space>
						<Button variant="primary">Create task</Button>
					</Space>
				</Content>
				<Content>
					<Row gap>
						<Col xs={24} md={16}>
							{noteCard(
								"Today’s focus",
								"Two enterprise accounts are waiting on rollout confirmation before billing can close.",
							)}
						</Col>
						<Col xs={24} md={8}>
							{noteCard(
								"Owner",
								"Sergio is handling approvals while Maya validates the invoice changes.",
							)}
						</Col>
					</Row>
				</Content>
				<Content>
					<Row gap>
						<Col xs={24} md={12}>
							{noteCard(
								"Billing",
								"One corrected invoice is ready to send once the tax note is approved.",
							)}
						</Col>
						<Col xs={24} md={12}>
							{noteCard(
								"Support",
								"Two workspaces still need confirmation that the provisioning retry completed.",
							)}
						</Col>
					</Row>
				</Content>
			</Page>
		</Aspect>
	),
};

export const FixedHeaderWithGrowBody: Story = {
	render: () => (
		<Aspect ratio="21x9">
			<Page gap fixed>
				<Content>
					<Space justify="between" align="center" wide>
						<Space direction="vertical" gap>
							<Title>Review queue</Title>
							<Paragraph>
								Fixed header, growing body, and footer controls.
							</Paragraph>
						</Space>
						<Select
							options={[
								{
									value: "priority",
									element: <Paragraph>Priority first</Paragraph>,
								},
								{
									value: "recent",
									element: <Paragraph>Most recent</Paragraph>,
								},
							]}
							onChange={() => undefined}
							placeholder="Sort queue"
						/>
					</Space>
				</Content>
				<Content grow>
					<Row gap>
						<Col xs={24} md={15}>
							<Content grow>
								<Space direction="vertical" gap wide>
									{queueItems.slice(0, 4).map((item) => (
										<React.Fragment key={item.title}>
											{noteCard(item.title, item.body)}
										</React.Fragment>
									))}
								</Space>
							</Content>
						</Col>
						<Col xs={24} md={9}>
							<Content grow>
								<Space direction="vertical" gap wide>
									{noteCard(
										"Context",
										"The export permissions fix was deployed last night and should cover both affected accounts.",
									)}
									{noteCard(
										"Next action",
										"Validate the billing diff, then reply with the corrected line items.",
									)}
								</Space>
							</Content>
						</Col>
					</Row>
				</Content>
				<Content>
					<Space justify="between" align="center" wide>
						<Paragraph>Showing 4 queued reviews.</Paragraph>
						<Pagination
							currentPage={1}
							maxPage={5}
							onPageChange={() => undefined}
						/>
					</Space>
				</Content>
			</Page>
		</Aspect>
	),
};

export const ScrollableOperationsPage: Story = {
	render: () => (
		<Aspect ratio="21x9">
			<Page gap fixed>
				<Content>
					<Space justify="between" align="center" wide>
						<Space direction="vertical" gap>
							<Title>Scrollable operations page</Title>
							<Paragraph>
								Fixed header and footer with a long scrollable body between
								them.
							</Paragraph>
						</Space>
						<Button variant="primary">Assign owner</Button>
					</Space>
				</Content>
				<Content grow>
					<Row gap>
						<Col xs={24} md={16}>
							<Content grow>
								<Space direction="vertical" gap wide>
									{queueItems.map((item) => (
										<React.Fragment key={item.title}>
											{noteCard(item.title, item.body)}
										</React.Fragment>
									))}
									{guideItems.slice(0, 4).map((item) => (
										<React.Fragment key={item.title}>
											{noteCard(item.title, item.body)}
										</React.Fragment>
									))}
								</Space>
							</Content>
						</Col>
						<Col xs={24} md={8}>
							<Content grow>
								<Space direction="vertical" gap wide>
									{noteCard(
										"Escalation path",
										"Analytics owns usage spikes, support owns provisioning retries, and finance owns invoice confirmation.",
									)}
									{noteCard(
										"Shift handoff",
										"The evening team should monitor export retries between 6 PM and 8 PM while the backlog clears.",
									)}
									{noteCard(
										"Tomorrow",
										"Plan to roll the webhook scope update after the morning invoice validation completes.",
									)}
									{noteCard(
										"Release note",
										"One enterprise workspace still needs a manual sync after the permission scope change.",
									)}
								</Space>
							</Content>
						</Col>
					</Row>
				</Content>
				<Content>
					<Space justify="between" align="center" wide>
						<Paragraph>
							Showing 10 queue items in the current review window.
						</Paragraph>
						<Pagination
							currentPage={2}
							maxPage={8}
							onPageChange={() => undefined}
						/>
					</Space>
				</Content>
			</Page>
		</Aspect>
	),
};

export const AnalyticsWorkspace: Story = {
	render: () => (
		<Aspect ratio="21x9">
			<Page gap fixed>
				<Content>
					<Space justify="between" align="center" wide>
						<Space direction="vertical" gap>
							<Title>Analytics workspace</Title>
							<Paragraph>
								Fixed controls, growing primary panel, and a supporting rail.
							</Paragraph>
						</Space>
						<Space gap align="center">
							<Select
								options={[
									{ value: "week", element: <Paragraph>This week</Paragraph> },
									{
										value: "month",
										element: <Paragraph>This month</Paragraph>,
									},
								]}
								onChange={() => undefined}
								placeholder="Time range"
							/>
							<Button variant="primary">Share report</Button>
						</Space>
					</Space>
				</Content>
				<Content grow>
					<Row gap>
						<Col xs={24} md={14}>
							<Content grow>
								<Space direction="vertical" gap wide fill align="stretch">
									<Paragraph>
										<strong>Primary panel</strong>
									</Paragraph>
									<Paragraph>
										The summary stays fixed while the main chart region consumes
										the remaining page height.
									</Paragraph>
									<Content grow wide>
										<Card pad wide fill>
											<MultiLineChart
												lines={[
													{
														label: "Signups",
														values: [
															{ x: "2026-04-01", y: 18 },
															{ x: "2026-04-02", y: 24 },
															{ x: "2026-04-03", y: 28 },
															{ x: "2026-04-04", y: 31 },
														],
													},
													{
														label: "Activations",
														values: [
															{ x: "2026-04-01", y: 12 },
															{ x: "2026-04-02", y: 16 },
															{ x: "2026-04-03", y: 22 },
															{ x: "2026-04-04", y: 20 },
														],
													},
												]}
												hoverLabel="events"
												fillHeight
												showVerticalTicks
												smooth
											/>
										</Card>
									</Content>
								</Space>
							</Content>
						</Col>
						<Col xs={24} md={10}>
							<Content grow>
								<Space direction="vertical" gap wide fill align="stretch">
									<Paragraph>
										<strong>Supporting panels</strong>
									</Paragraph>
									<Paragraph>
										These stack beside the primary chart while still
										participating in the same page layout.
									</Paragraph>
									<StackedBreakdownChart
										labels={["Helpful", "Neutral", "Risky"]}
										xLabels={[
											<Paragraph key="w1">Week 1</Paragraph>,
											<Paragraph key="w2">Week 2</Paragraph>,
											<Paragraph key="w3">Week 3</Paragraph>,
										]}
										rows={[
											{
												key: "week-1",
												labelWeights: {
													Helpful: 0.52,
													Neutral: 0.28,
													Risky: 0.2,
												},
											},
											{
												key: "week-2",
												labelWeights: {
													Helpful: 0.57,
													Neutral: 0.24,
													Risky: 0.19,
												},
											},
											{
												key: "week-3",
												labelWeights: {
													Helpful: 0.61,
													Neutral: 0.21,
													Risky: 0.18,
												},
											},
										]}
									/>
									<EmbeddingHeatmap
										embedding={[
											[0.24, 0.32, 0.41, 0.58],
											[0.62, 0.73, 0.28, 0.11],
											[0.84, 0.67, 0.36, 0.29],
										]}
										height={72}
									/>
									<LabelBars
										labels={[
											{ label: "Helpful", prob: 0.68 },
											{ label: "Neutral", prob: 0.22 },
											{ label: "Risky", prob: 0.1 },
										]}
									/>
								</Space>
							</Content>
						</Col>
					</Row>
				</Content>
				<Content>
					<Space justify="between" align="center" wide>
						<Paragraph>
							Showing 3 supporting panels beside the current trend view.
						</Paragraph>
						<Pagination
							currentPage={1}
							maxPage={4}
							onPageChange={() => undefined}
						/>
					</Space>
				</Content>
			</Page>
		</Aspect>
	),
};

export const KnowledgeBaseWorkspace: Story = {
	render: () => (
		<Aspect ratio="21x9">
			<Page gap fixed>
				<Content>
					<Space justify="between" align="center" wide>
						<Space direction="vertical" gap>
							<Title>Knowledge base workspace</Title>
							<Paragraph>
								Sections, tabs, and a scrollable article area inside one page
								shell.
							</Paragraph>
						</Space>
						<Space gap align="center">
							<Select
								options={[
									{ value: "guides", element: <Paragraph>Guides</Paragraph> },
									{
										value: "playbooks",
										element: <Paragraph>Playbooks</Paragraph>,
									},
								]}
								onChange={() => undefined}
								placeholder="Section"
							/>
							<Button variant="primary">New article</Button>
						</Space>
					</Space>
				</Content>
				<Content grow>
					<Row gap>
						<Col xs={24} md={6}>
							<Card pad wide>
								<Space direction="vertical" gap>
									<Paragraph>
										<strong>Sections</strong>
									</Paragraph>
									<Button variant="default">
										<Paragraph>Integration guides</Paragraph>
									</Button>
									<Button variant="ghost">
										<Paragraph>Release playbooks</Paragraph>
									</Button>
									<Button variant="ghost">
										<Paragraph>Support macros</Paragraph>
									</Button>
									<Button variant="ghost">
										<Paragraph>Change log</Paragraph>
									</Button>
								</Space>
							</Card>
						</Col>
						<Col xs={24} md={18}>
							<Content grow>
								<Tabs defaultActiveKey="guides">
									<Tab key="guides" label="Guides">
										<Space direction="vertical" gap wide>
											<Row gap>
												{guideItems.slice(0, 4).map((item) => (
													<Col key={item.title} xs={24} md={12}>
														{noteCard(item.title, item.body)}
													</Col>
												))}
											</Row>
											<Row gap>
												{guideItems.slice(4).map((item) => (
													<Col key={item.title} xs={24} md={12}>
														{noteCard(item.title, item.body)}
													</Col>
												))}
											</Row>
										</Space>
									</Tab>
									<Tab key="updates" label="Updates">
										<Space direction="vertical" gap wide>
											{updateItems.map((item) => (
												<React.Fragment key={item.title}>
													{noteCard(item.title, item.body)}
												</React.Fragment>
											))}
										</Space>
									</Tab>
								</Tabs>
							</Content>
						</Col>
					</Row>
				</Content>
				<Content>
					<Space justify="between" align="center" wide>
						<Paragraph>Showing 10 articles across 4 sections.</Paragraph>
						<Pagination
							currentPage={2}
							maxPage={6}
							onPageChange={() => undefined}
						/>
					</Space>
				</Content>
			</Page>
		</Aspect>
	),
};
