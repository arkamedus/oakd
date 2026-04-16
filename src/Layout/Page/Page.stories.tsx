import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Page from "./Page";
import Content from "../Content/Content";
import Row from "../Row/Row";
import { Col } from "../Column/Column";
import Paragraph from "../../Atom/Paragraph/Paragraph";
import Space from "../../Atom/Space/Space";
import Title from "../../Atom/Title/Title";
import Select from "../../Atom/Select/Select";
import Input from "../../Atom/Input/Input";
import Card from "../../Atom/Card/Card";
import Button from "../../Atom/Button/Button";
import Tabs, { Tab } from "../../Atom/Tabs/Tabs";
import Pagination from "../../Atom/Pagination/Pagination";
import MultiLineChart from "../../Atom/MultiLineChart/MultiLineChart";
import StackedBreakdownChart from "../../Atom/StackedBreakdownChart/StackedBreakdownChart";
import EmbeddingHeatmap from "../../Atom/EmbeddingHeatmap/EmbeddingHeatmap";
import LabelBars from "../../Atom/LabelBars/LabelBars";
import CodeArea from "../../Atom/CodeArea/CodeArea";

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

const chatContactCard = (
	name: string,
	status: string,
	preview: string,
	active = false,
) => (
	<Card pad wide type={active ? "active" : "default"}>
		<Space direction="vertical" gap wide>
			<Space justify="between" align="center" wide>
				<Paragraph>
					<strong>{name}</strong>
				</Paragraph>
				<Paragraph>{status}</Paragraph>
			</Space>
			<Paragraph>{preview}</Paragraph>
		</Space>
	</Card>
);

const chatBubble = (
	message: string,
	time: string,
	side: "left" | "right" = "left",
) => (
	<Space justify={side === "right" ? "end" : "start"} wide>
		<Card
			pad
			style={{
				maxWidth: "76%",
			}}
			type={side === "right" ? "active" : "default"}
		>
			<Space direction="vertical" gap>
				<Paragraph>{message}</Paragraph>
				<Paragraph>{time}</Paragraph>
			</Space>
		</Card>
	</Space>
);

const viewportStyle = { minHeight: "440pt" } as const;
const scrollPanelStyle = { minHeight: 0, overflowY: "auto" as const } as const;
const bodyHostStyle = { minHeight: 0, overflow: "hidden" as const } as const;

const sqlRules = [
	{
		className: "tok-keyword",
		regex:
			/\b(select|from|where|group by|order by|limit|join|left join|inner join|as|and|or|desc|asc|count|sum|avg|date_trunc)\b/gi,
	},
	{
		className: "tok-string",
		regex: /'([^'\\]|\\.)*'/g,
	},
	{
		className: "tok-number",
		regex: /\b\d+(\.\d+)?\b/g,
	},
	{
		className: "tok-comment",
		regex: /--.*$/gm,
	},
];

const dataRowCard = (
	cells: [string, string, string, string],
	active = false,
) => (
	<Card pad wide type={active ? "active" : "default"}>
		<Row gap>
			<Col xs={24} md={7}>
				<Paragraph>{cells[0]}</Paragraph>
			</Col>
			<Col xs={24} md={7}>
				<Paragraph>{cells[1]}</Paragraph>
			</Col>
			<Col xs={24} md={5}>
				<Paragraph>{cells[2]}</Paragraph>
			</Col>
			<Col xs={24} md={5}>
				<Paragraph>{cells[3]}</Paragraph>
			</Col>
		</Row>
	</Card>
);

export const Default: Story = {
	args: {
		gap: false,
	},
	render: (args) => (
		<Content fill pad style={viewportStyle}>
			<Page {...args} fill>
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
		</Content>
	),
};

export const WithGap: Story = {
	args: {
		gap: true,
	},
	render: (args) => (
		<Content fill pad style={viewportStyle}>
			<Page {...args} fill>
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
		</Content>
	),
};

export const WorkspaceSlice: Story = {
	render: () => (
		<Content fill pad style={viewportStyle}>
			<Page gap fill>
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
		</Content>
	),
};

export const FixedHeaderWithGrowBody: Story = {
	render: () => (
		<Content fill pad style={viewportStyle}>
			<Page gap fill>
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
		</Content>
	),
};

export const ScrollableOperationsPage: Story = {
	render: () => (
		<Content fill pad style={viewportStyle}>
			<Page gap fill>
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
		</Content>
	),
};

export const AnalyticsWorkspace: Story = {
	render: () => (
		<Content fill pad style={viewportStyle}>
			<Page gap fill>
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
									<Content grow fill wide>
										<Card wide fill>
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
												fill
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
		</Content>
	),
};

export const KnowledgeBaseWorkspace: Story = {
	render: () => (
		<Content fill pad style={viewportStyle}>
			<Page gap fill>
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
		</Content>
	),
};

export const ChatWorkspace: Story = {
	render: () => (
		<Content fill pad style={viewportStyle}>
			<Page gap fill>
				<Content>
					<Space justify="between" align="center" wide>
						<Space direction="vertical" gap>
							<Title>Chat workspace</Title>
							<Paragraph>
								A contacts rail on the left and a live conversation on the
								right.
							</Paragraph>
						</Space>
						<Space gap align="center">
							<Button variant="ghost">New chat</Button>
							<Button variant="primary">Invite</Button>
						</Space>
					</Space>
				</Content>
				<Content grow fill style={bodyHostStyle}>
					<Row gap fill>
						<Col xs={24} md={6}>
							<Card pad wide>
								<Space direction="vertical" gap wide align="stretch">
									<Space justify="between" align="center" wide>
										<Paragraph>
											<strong>Contacts</strong>
										</Paragraph>
										<Paragraph>12 online</Paragraph>
									</Space>
									<Space gap wide>
										<Button variant="active">All</Button>
										<Button variant="ghost">Unread</Button>
										<Button variant="ghost">Pinned</Button>
									</Space>
									{chatContactCard(
										"Jordan Lee",
										"Today",
										"Can you review the updated launch checklist before we post the note?",
										true,
									)}
									{chatContactCard(
										"Maya Chen",
										"8m",
										"The invoice correction is ready after the billing diff review.",
									)}
									{chatContactCard(
										"Sergio Patel",
										"21m",
										"We can close the rollback note once the export retry passes.",
									)}
									{chatContactCard(
										"Billing Ops",
										"1h",
										"Confirmed the renewal adjustment and sent the revised totals.",
									)}
								</Space>
							</Card>
						</Col>
						<Col xs={24} md={18}>
							<Card pad wide fill>
								<Space direction="vertical" gap wide fill align="stretch">
									<Space justify="between" align="center" wide>
										<Space direction="vertical" gap>
											<Paragraph>
												<strong>Jordan Lee</strong>
											</Paragraph>
											<Paragraph>Design review · online now</Paragraph>
										</Space>
										<Space gap align="center">
											<Button variant="ghost">Files</Button>
											<Button variant="ghost">Details</Button>
										</Space>
									</Space>
									<Content grow fill wide style={{ minHeight: 0 }}>
										<Content fill style={scrollPanelStyle}>
											<Space direction="vertical" gap wide fill align="stretch">
												{chatBubble(
													"I pulled the latest workspace notes into the review queue. The launch checklist still needs one last pass.",
													"9:14 AM",
													"left",
												)}
												{chatBubble(
													"Looks good. Keep the invoice correction and the support handoff in the same thread so the customer team can follow it.",
													"9:16 AM",
													"right",
												)}
												{chatBubble(
													"I’ll attach the billing diff and pin the approvals so the final summary stays easy to scan.",
													"9:18 AM",
													"left",
												)}
												{chatBubble(
													"Perfect. I’m sending the final review request once the export note is updated.",
													"9:19 AM",
													"right",
												)}
												{chatBubble(
													"The support team confirmed the retry window and the correction is ready to close.",
													"9:24 AM",
													"left",
												)}
												{chatBubble(
													"I added the revised totals to the thread and marked the invoice for one last approval.",
													"9:27 AM",
													"right",
												)}
												{chatBubble(
													"Great. I’m keeping this open until the launch note is published and the owner is notified.",
													"9:31 AM",
													"left",
												)}
											</Space>
										</Content>
									</Content>
									<Space gap wide align="center">
										<Input grow placeholder="Write a reply..." />
										<Button variant="primary">Send</Button>
									</Space>
								</Space>
							</Card>
						</Col>
					</Row>
				</Content>
			</Page>
		</Content>
	),
};

export const AssetReviewWorkspace: Story = {
	render: () => (
		<Content fill pad style={viewportStyle}>
			<Page gap fill>
				<Content>
					<Space justify="between" align="center" wide>
						<Space direction="vertical" gap>
							<Title>Asset review workspace</Title>
							<Paragraph>
								A centered review surface with controls above and actions below.
							</Paragraph>
						</Space>
						<Space gap align="center">
							<Select
								options={[
									{ value: "review", element: <Paragraph>Review</Paragraph> },
									{
										value: "approved",
										element: <Paragraph>Approved</Paragraph>,
									},
									{
										value: "needs-work",
										element: <Paragraph>Needs work</Paragraph>,
									},
								]}
								onChange={() => undefined}
								placeholder="Status"
							/>
							<Button variant="primary">Publish</Button>
						</Space>
					</Space>
				</Content>
				<Content grow fill style={bodyHostStyle}>
					<Row gap fill style={{ minHeight: 0 }}>
						<Col xs={24} md={5}>
							<Card pad wide fill>
								<Space direction="vertical" gap wide fill align="stretch">
									<Paragraph>
										<strong>Queue</strong>
									</Paragraph>
									{chatContactCard(
										"Launch banner",
										"1m",
										"Needs a final contrast check before publishing.",
										true,
									)}
									{chatContactCard(
										"Homepage hero",
										"8m",
										"The approved crop is ready for signoff.",
									)}
									{chatContactCard(
										"Billing screenshot",
										"14m",
										"Waiting on the updated caption and metadata.",
									)}
								</Space>
							</Card>
						</Col>
						<Col xs={24} md={14}>
							<Card pad wide fill grow>
								<Space direction="vertical" gap wide fill align="stretch">
									<Space justify="between" align="center" wide>
										<Space direction="vertical" gap>
											<Paragraph>
												<strong>Preview</strong>
											</Paragraph>
											<Paragraph>
												The review surface stays centered while the surrounding
												controls remain compact.
											</Paragraph>
										</Space>
										<Space gap align="center">
											<Button variant="ghost">Crop</Button>
											<Button variant="ghost">Annotate</Button>
										</Space>
									</Space>
									<Content grow fill wide>
										<Card pad wide fill>
											<Space
												direction="vertical"
												gap
												wide
												fill
												align="center"
												justify="center"
											>
												<Title>Approved banner</Title>
												<Paragraph>Centered preview pane</Paragraph>
												<Paragraph>
													Use this view for crop validation, copy checks, and
													final approval.
												</Paragraph>
											</Space>
										</Card>
									</Content>
									<Space justify="between" align="center" wide>
										<Paragraph>Reviewed by Maya · 2 approvals</Paragraph>
										<Space gap align="center">
											<Button variant="ghost">Reject</Button>
											<Button variant="active">Approve</Button>
										</Space>
									</Space>
								</Space>
							</Card>
						</Col>
						<Col xs={24} md={5}>
							<Card pad wide fill>
								<Space direction="vertical" gap wide fill align="stretch">
									<Paragraph>
										<strong>Details</strong>
									</Paragraph>
									{noteCard(
										"Owner",
										"Design ops owns the final publish checklist for this asset.",
									)}
									{noteCard(
										"Target",
										"This banner will ship on the launch page and the support portal.",
									)}
									{noteCard(
										"Notes",
										"The approved crop should keep the logo clear of the top edge.",
									)}
								</Space>
							</Card>
						</Col>
					</Row>
				</Content>
			</Page>
		</Content>
	),
};

export const QueryWorkbench: Story = {
	render: () => (
		<Content fill pad style={viewportStyle}>
			<Page gap fill>
				<Content>
					<Space justify="between" align="center" wide>
						<Space direction="vertical" gap>
							<Title>Query workbench</Title>
							<Paragraph>
								Edit a query, inspect visual summaries, and review result rows
								in one bounded workspace.
							</Paragraph>
						</Space>
						<Space gap align="center">
							<Select
								options={[
									{ value: "prod", element: <Paragraph>Production</Paragraph> },
									{ value: "staging", element: <Paragraph>Staging</Paragraph> },
								]}
								onChange={() => undefined}
								placeholder="Dataset"
							/>
							<Button variant="ghost">Format SQL</Button>
							<Button variant="primary">Run query</Button>
						</Space>
					</Space>
				</Content>
				<Content grow fill style={bodyHostStyle}>
					<Row gap fill>
						<Col xs={24} md={10}>
							<Card pad wide fill>
								<Space direction="vertical" gap wide fill align="stretch">
									<Space justify="between" align="center" wide>
										<Paragraph>
											<strong>Editor</strong>
										</Paragraph>
										<Button variant="active">Saved query</Button>
									</Space>
									<CodeArea
										fill
										lineNumbers
										highlightCurrentLine
										rules={sqlRules}
										defaultValue={`-- Daily workspace rollup
select
  date_trunc('day', created_at) as day,
  count(*) as sessions,
  avg(duration_ms) as avg_duration,
  sum(case when status = 'error' then 1 else 0 end) as errors
from workspace_sessions
where created_at >= '2026-04-01'
group by 1
order by 1 desc
limit 14;`}
									/>
									<Space gap wide>
										{noteCard(
											"Result shape",
											"14 daily rows, 4 aggregate columns, and one grouped time dimension.",
										)}
									</Space>
								</Space>
							</Card>
						</Col>
						<Col xs={24} md={14}>
							<Card pad wide fill>
								<Space direction="vertical" gap wide fill align="stretch">
									<Tabs defaultActiveKey="results">
										<Tab key="results" label="Results">
											<Space direction="vertical" gap wide fill align="stretch">
												<Row gap>
													<Col xs={24} md={14}>
														<Card pad wide>
															<MultiLineChart
																lines={[
																	{
																		label: "Sessions",
																		values: [
																			{ x: "2026-04-01", y: 1220 },
																			{ x: "2026-04-02", y: 1384 },
																			{ x: "2026-04-03", y: 1495 },
																			{ x: "2026-04-04", y: 1610 },
																			{ x: "2026-04-05", y: 1552 },
																		],
																	},
																	{
																		label: "Errors",
																		values: [
																			{ x: "2026-04-01", y: 42 },
																			{ x: "2026-04-02", y: 39 },
																			{ x: "2026-04-03", y: 61 },
																			{ x: "2026-04-04", y: 55 },
																			{ x: "2026-04-05", y: 37 },
																		],
																	},
																]}
																hoverLabel="rows"
																showVerticalTicks
																smooth
															/>
														</Card>
													</Col>
													<Col xs={24} md={10}>
														<Card pad wide>
															<LabelBars
																labels={[
																	{ label: "Healthy", prob: 0.73 },
																	{ label: "Watch", prob: 0.19 },
																	{ label: "Critical", prob: 0.08 },
																]}
															/>
														</Card>
													</Col>
												</Row>
												<Card pad wide fill>
													<Space
														direction="vertical"
														gap
														wide
														fill
														align="stretch"
													>
														<Row gap>
															<Col xs={24} md={7}>
																<Paragraph>
																	<strong>Workspace</strong>
																</Paragraph>
															</Col>
															<Col xs={24} md={7}>
																<Paragraph>
																	<strong>Owner</strong>
																</Paragraph>
															</Col>
															<Col xs={24} md={5}>
																<Paragraph>
																	<strong>Sessions</strong>
																</Paragraph>
															</Col>
															<Col xs={24} md={5}>
																<Paragraph>
																	<strong>Status</strong>
																</Paragraph>
															</Col>
														</Row>
														<Content grow fill style={scrollPanelStyle}>
															<Space direction="vertical" gap wide>
																{dataRowCard(
																	[
																		"Northwind",
																		"Maya Chen",
																		"18,440",
																		"Healthy",
																	],
																	true,
																)}
																{dataRowCard([
																	"Atlas Labs",
																	"Jordan Lee",
																	"14,992",
																	"Healthy",
																])}
																{dataRowCard([
																	"Signal Ops",
																	"Sergio Patel",
																	"11,804",
																	"Watch",
																])}
																{dataRowCard([
																	"Vector Retail",
																	"Priya Shah",
																	"9,318",
																	"Healthy",
																])}
																{dataRowCard([
																	"Harbor Health",
																	"Alex King",
																	"8,102",
																	"Critical",
																])}
																{dataRowCard([
																	"Delta Freight",
																	"Imani Cole",
																	"7,885",
																	"Watch",
																])}
															</Space>
														</Content>
													</Space>
												</Card>
											</Space>
										</Tab>
										<Tab key="schema" label="Schema">
											<Row gap>
												<Col xs={24} md={12}>
													{noteCard(
														"workspace_sessions",
														"Fields include created_at, workspace_id, owner_id, duration_ms, and status.",
													)}
												</Col>
												<Col xs={24} md={12}>
													{noteCard(
														"Indexes",
														"created_at desc, workspace_id + created_at, and status for error window checks.",
													)}
												</Col>
											</Row>
										</Tab>
									</Tabs>
								</Space>
							</Card>
						</Col>
					</Row>
				</Content>
				<Content>
					<Space justify="between" align="center" wide>
						<Paragraph>
							Showing 6 workspace rows from the current result set.
						</Paragraph>
						<Pagination
							currentPage={1}
							maxPage={9}
							onPageChange={() => undefined}
						/>
					</Space>
				</Content>
			</Page>
		</Content>
	),
};

export const MissionControlWorkspace: Story = {
	render: () => (
		<Content fill pad style={viewportStyle}>
			<Page gap fill>
				<Content>
					<Space justify="between" align="center" wide>
						<Space direction="vertical" gap>
							<Title>Mission control workspace</Title>
							<Paragraph>
								A multi-surface control room with a live board, action queue,
								and state summary.
							</Paragraph>
						</Space>
						<Space gap align="center">
							<Button variant="ghost">Standby</Button>
							<Button variant="active">Live</Button>
							<Button variant="primary">Broadcast update</Button>
						</Space>
					</Space>
				</Content>
				<Content grow fill style={bodyHostStyle}>
					<Row gap fill>
						<Col xs={24} md={5}>
							<Card pad wide fill>
								<Space direction="vertical" gap wide fill align="stretch">
									<Paragraph>
										<strong>Action queue</strong>
									</Paragraph>
									{noteCard(
										"Red zone",
										"Confirm rollback readiness before the next traffic shift.",
									)}
									{noteCard(
										"Launch gate",
										"Validate the support macro update and publish the revised note.",
									)}
									{noteCard(
										"Ops owner",
										"Keep the customer queue open until analytics signs off on the retry window.",
									)}
								</Space>
							</Card>
						</Col>
						<Col xs={24} md={12}>
							<Card pad wide fill>
								<Space direction="vertical" gap wide fill align="stretch">
									<Paragraph>
										<strong>Control board</strong>
									</Paragraph>
									<Content grow fill wide>
										<Card pad wide fill>
											<Space direction="vertical" gap wide fill align="stretch">
												<Row gap>
													<Col xs={24} md={8}>
														{noteCard(
															"Traffic",
															"Requests are stable and within the approved target band.",
														)}
													</Col>
													<Col xs={24} md={8}>
														{noteCard(
															"Incidents",
															"One workspace remains in watch mode pending the export verification pass.",
														)}
													</Col>
													<Col xs={24} md={8}>
														{noteCard(
															"Staffing",
															"Support and billing both have named owners covering the current shift.",
														)}
													</Col>
												</Row>
												<StackedBreakdownChart
													labels={["Stable", "Watch", "Blocked"]}
													xLabels={[
														<Paragraph key="q1">08:00</Paragraph>,
														<Paragraph key="q2">10:00</Paragraph>,
														<Paragraph key="q3">12:00</Paragraph>,
														<Paragraph key="q4">14:00</Paragraph>,
													]}
													rows={[
														{
															key: "08",
															labelWeights: {
																Stable: 0.64,
																Watch: 0.23,
																Blocked: 0.13,
															},
														},
														{
															key: "10",
															labelWeights: {
																Stable: 0.58,
																Watch: 0.27,
																Blocked: 0.15,
															},
														},
														{
															key: "12",
															labelWeights: {
																Stable: 0.69,
																Watch: 0.19,
																Blocked: 0.12,
															},
														},
														{
															key: "14",
															labelWeights: {
																Stable: 0.72,
																Watch: 0.17,
																Blocked: 0.11,
															},
														},
													]}
												/>
											</Space>
										</Card>
									</Content>
								</Space>
							</Card>
						</Col>
						<Col xs={24} md={7}>
							<Card pad wide fill>
								<Space direction="vertical" gap wide fill align="stretch">
									<Paragraph>
										<strong>Live state</strong>
									</Paragraph>
									<Card pad wide>
										<EmbeddingHeatmap
											embedding={[
												[0.12, 0.18, 0.31, 0.42, 0.5, 0.61],
												[0.22, 0.36, 0.49, 0.38, 0.24, 0.15],
												[0.41, 0.58, 0.72, 0.63, 0.31, 0.18],
												[0.69, 0.74, 0.62, 0.44, 0.27, 0.14],
											]}
											height={140}
										/>
									</Card>
									<LabelBars
										labels={[
											{ label: "Stable", prob: 0.71 },
											{ label: "Watch", prob: 0.19 },
											{ label: "Blocked", prob: 0.1 },
										]}
									/>
									<Space gap wide>
										<Button variant="ghost">Freeze queue</Button>
										<Button variant="primary">Escalate</Button>
									</Space>
								</Space>
							</Card>
						</Col>
					</Row>
				</Content>
			</Page>
		</Content>
	),
};
