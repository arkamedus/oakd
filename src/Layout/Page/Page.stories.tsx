import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import ActionList, { ActionListItem } from "../../Atom/ActionList/ActionList";
import Button, { ButtonGroup } from "../../Atom/Button/Button";
import Card from "../../Atom/Card/Card";
import Checkbox from "../../Atom/Checkbox/Checkbox";
import CodeArea from "../../Atom/CodeArea/CodeArea";
import ColorField from "../../Atom/ColorField/ColorField";
import DataTable from "../../Atom/DataTable/DataTable";
import { DataTableColumn } from "../../Atom/DataTable/DataTable.types";
import Divider from "../../Atom/Divider/Divider";
import EmbeddingHeatmap from "../../Atom/EmbeddingHeatmap/EmbeddingHeatmap";
import Input from "../../Atom/Input/Input";
import LabelBars from "../../Atom/LabelBars/LabelBars";
import MultiLineChart from "../../Atom/MultiLineChart/MultiLineChart";
import Paragraph from "../../Atom/Paragraph/Paragraph";
import Pill from "../../Atom/Pill/Pill";
import Select from "../../Atom/Select/Select";
import Space from "../../Atom/Space/Space";
import StackedBreakdownChart from "../../Atom/StackedBreakdownChart/StackedBreakdownChart";
import Tabs, { Tab } from "../../Atom/Tabs/Tabs";
import ThumbnailGrid from "../../Atom/ThumbnailGrid/ThumbnailGrid";
import Title from "../../Atom/Title/Title";
import VectorField from "../../Atom/VectorField/VectorField";
import Icon from "../../Icon/Icon";
import Aspect from "../Aspect/Aspect";
import Col from "../Column/Column";
import Content from "../Content/Content";
import ContentRail from "../ContentRail/ContentRail";
import Dock from "../Dock/Dock";
import Row from "../Row/Row";
import ScrollArea from "../ScrollArea/ScrollArea";
import Page from "./Page";

const meta: Meta<typeof Page> = {
  title: "Design System/Layout/Page",
  component: Page,
  argTypes: {
    fixed: {
      control: { type: "boolean" },
      description: "Fix the page to the viewport",
    },
    fill: {
      control: { type: "boolean" },
      description: "Fill the available parent height",
    },
    gap: {
      control: { type: "boolean" },
      description: "Space page sections with oakd tokens",
    },
  },
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof Page>;

type WorkItem = {
  id: number;
  name: string;
  owner: string;
  status: "Ready" | "Review" | "Blocked";
  updated: string;
};

const workItems: WorkItem[] = [
  {
    id: 1,
    name: "Billing reconciliation",
    owner: "Maya",
    status: "Ready",
    updated: "4m",
  },
  {
    id: 2,
    name: "Provisioning retry",
    owner: "Sergio",
    status: "Review",
    updated: "12m",
  },
  {
    id: 3,
    name: "Export permission audit",
    owner: "Jordan",
    status: "Blocked",
    updated: "28m",
  },
  {
    id: 4,
    name: "Launch checklist",
    owner: "Priya",
    status: "Ready",
    updated: "43m",
  },
  {
    id: 5,
    name: "Support handoff",
    owner: "Maya",
    status: "Review",
    updated: "1h",
  },
  {
    id: 6,
    name: "Renewal approval",
    owner: "Sergio",
    status: "Ready",
    updated: "2h",
  },
];

const workColumns: DataTableColumn<WorkItem>[] = [
  {
    id: "name",
    header: <Paragraph>Work item</Paragraph>,
    render: (row) => <Paragraph>{row.name}</Paragraph>,
    getSortValue: (row) => row.name,
    sortable: true,
    xs: 24,
    md: 9,
  },
  {
    id: "owner",
    header: <Paragraph>Owner</Paragraph>,
    render: (row) => <Paragraph>{row.owner}</Paragraph>,
    xs: 8,
    md: 5,
  },
  {
    id: "status",
    header: <Paragraph>Status</Paragraph>,
    render: (row) => (
      <Pill
        size="small"
        variant={
          row.status === "Blocked"
            ? "danger"
            : row.status === "Review"
              ? "warning"
              : "success"
        }
      >
        {row.status}
      </Pill>
    ),
    xs: 8,
    md: 6,
  },
  {
    id: "updated",
    header: <Paragraph>Updated</Paragraph>,
    render: (row) => <Paragraph>{row.updated}</Paragraph>,
    xs: 8,
    md: 4,
    align: "end",
  },
];

const Header = ({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: React.ReactNode;
}) => (
  <Content pad wide>
    <Space align="center" justify="between" gap wide noWrap>
      <Space direction="vertical" gap grow>
        <Title>{title}</Title>
        <Paragraph>{description}</Paragraph>
      </Space>
      {actions ? (
        <Space align="center" gap noWrap>
          {actions}
        </Space>
      ) : null}
    </Space>
  </Content>
);

const SummaryCard = ({
  title,
  value,
  detail,
  variant = "default",
}: {
  title: string;
  value: string;
  detail: string;
  variant?: "default" | "success" | "warning" | "danger";
}) => (
  <Card pad wide variant={variant}>
    <Space direction="vertical" gap wide>
      <Paragraph>{title}</Paragraph>
      <Title size="small">{value}</Title>
      <Paragraph>{detail}</Paragraph>
    </Space>
  </Card>
);

const QueueItem = ({
  title,
  description,
  status,
  selected = false,
}: {
  title: string;
  description: string;
  status: string;
  selected?: boolean;
}) => (
  <ActionListItem
    aria-selected={selected}
    title={<Paragraph>{title}</Paragraph>}
    description={<Paragraph>{description}</Paragraph>}
    trailing={<Pill size="small">{status}</Pill>}
    onClick={() => undefined}
  />
);

const sqlRules = [
  {
    className: "tok-keyword",
    regex:
      /\b(select|from|where|group by|order by|limit|as|and|desc|count|avg)\b/gi,
  },
  { className: "tok-string", regex: /'([^'\\]|\\.)*'/g },
  { className: "tok-number", regex: /\b\d+(\.\d+)?\b/g },
  { className: "tok-comment", regex: /--.*$/gm },
];

const chatMessage = (message: string, time: string, side: "left" | "right") => (
  <Row gap>
    {side === "right" ? <Col xs={4} md={8} /> : null}
    <Col xs={20} md={16}>
      <Card pad wide variant={side === "right" ? "active" : "default"}>
        <Space direction="vertical" gap wide>
          <Paragraph>{message}</Paragraph>
          <Paragraph>{time}</Paragraph>
        </Space>
      </Card>
    </Col>
  </Row>
);

export const Default: Story = {
  render: () => (
    <Page fixed gap>
      <Header
        title="Project overview"
        description="A full-height page with bounded content and one owned scroll region."
        actions={
          <Button variant="primary" icon="Plus">
            <Paragraph>New project</Paragraph>
          </Button>
        }
      />
      <ScrollArea orientation="vertical" grow fill wide>
        <ContentRail size="huge">
          <Content pad wide>
            <Space direction="vertical" gap wide>
              <Row gap>
                <Col xs={24} md={8}>
                  <SummaryCard
                    title="Open work"
                    value="18"
                    detail="Six items need review today."
                  />
                </Col>
                <Col xs={24} md={8}>
                  <SummaryCard
                    title="On track"
                    value="92%"
                    detail="Delivery confidence this week."
                    variant="success"
                  />
                </Col>
                <Col xs={24} md={8}>
                  <SummaryCard
                    title="At risk"
                    value="3"
                    detail="Owners have been notified."
                    variant="warning"
                  />
                </Col>
              </Row>
              <Card pad wide>
                <DataTable
                  title="Recent work"
                  columns={workColumns}
                  rows={workItems}
                  getRowId={(row) => row.id}
                  defaultPageSize={4}
                  pageSizeOptions={[4, 6]}
                />
              </Card>
            </Space>
          </Content>
        </ContentRail>
      </ScrollArea>
    </Page>
  ),
};

export const WithGap: Story = {
  render: () => (
    <Page fixed gap>
      <Header
        title="Release planning"
        description="Page gap separates the header, summary, and delivery plan."
        actions={
          <Pill variant="success" icon="Check">
            On schedule
          </Pill>
        }
      />
      <Content pad wide>
        <Row gap>
          <Col xs={24} md={12}>
            <SummaryCard
              title="Target"
              value="August 29"
              detail="Production rollout at 10:00 AM."
            />
          </Col>
          <Col xs={24} md={12}>
            <SummaryCard
              title="Readiness"
              value="16 / 18"
              detail="Two validation checks remain."
              variant="warning"
            />
          </Col>
        </Row>
      </Content>
      <Content pad grow fill>
        <Card pad grow fill wide>
          <Space direction="vertical" gap wide fill>
            <Title size="small">Delivery plan</Title>
            <ScrollArea orientation="vertical" grow fill wide>
              <ActionList>
                <QueueItem
                  title="Package verification"
                  description="Validate exports and source maps."
                  status="Complete"
                />
                <QueueItem
                  title="Accessibility review"
                  description="Confirm keyboard and focus behavior."
                  status="In review"
                  selected
                />
                <QueueItem
                  title="Documentation publish"
                  description="Release the migration and API notes."
                  status="Ready"
                />
                <QueueItem
                  title="Production rollout"
                  description="Promote, observe, and confirm rollback readiness."
                  status="Scheduled"
                />
              </ActionList>
            </ScrollArea>
          </Space>
        </Card>
      </Content>
    </Page>
  ),
};

export const WorkspaceSlice: Story = {
  render: () => (
    <Page fixed gap>
      <Header
        title="Customer operations"
        description="Account health, assigned work, and the next customer action."
        actions={
          <>
            <Select searchable fixed
              options={[
                { value: "northwind", element: "Northwind" },
                { value: "atlas", element: "Atlas Labs" },
                { value: "signal", element: "Signal Ops" },
              ]}
              defaultValue="northwind"
            />
            <Button variant="primary">
              <Paragraph>Create task</Paragraph>
            </Button>
          </>
        }
      />
      <Content pad grow fill>
        <Row gap grow fill>
          <Col xs={24} md={7}>
            <Card pad grow fill wide>
              <Space direction="vertical" gap wide fill>
                <Space align="center" justify="between" wide>
                  <Title size="small">Northwind</Title>
                  <Pill variant="success">Healthy</Pill>
                </Space>
                <ActionList divided={false}>
                  <ActionListItem
                    title={<Paragraph>Plan</Paragraph>}
                    trailing={<Paragraph>Enterprise</Paragraph>}
                  />
                  <ActionListItem
                    title={<Paragraph>Renewal</Paragraph>}
                    trailing={<Paragraph>Oct 14</Paragraph>}
                  />
                  <ActionListItem
                    title={<Paragraph>Owner</Paragraph>}
                    trailing={<Paragraph>Maya Chen</Paragraph>}
                  />
                </ActionList>
                <LabelBars
                  labels={[
                    { label: "Adoption", prob: 0.82 },
                    { label: "Coverage", prob: 0.68 },
                  ]}
                />
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={17}>
            <Card pad grow fill wide>
              <DataTable
                title="Assigned work"
                columns={workColumns}
                rows={workItems.slice(0, 4)}
                getRowId={(row) => row.id}
                defaultPageSize={4}
                pageSizeOptions={[4]}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Page>
  ),
};

export const FixedHeaderWithGrowBody: Story = {
  render: () => (
    <Page fixed gap>
      <Header
        title="Review queue"
        description="The header and footer stay fixed while the queue owns scrolling."
        actions={
          <Button variant="primary">
            <Paragraph>Assign reviewer</Paragraph>
          </Button>
        }
      />
      <Content pad grow fill>
        <Row gap grow fill>
          <Col xs={24} md={16}>
            <Card grow fill wide>
              <ScrollArea orientation="vertical" grow fill>
                <ActionList>
                  {workItems.map((item, index) => (
                    <QueueItem
                      key={item.id}
                      title={item.name}
                      description={`${item.owner} owns the next review step.`}
                      status={item.status}
                      selected={index === 1}
                    />
                  ))}
                </ActionList>
              </ScrollArea>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card pad grow fill wide>
              <Space direction="vertical" gap wide>
                <Title size="small">Provisioning retry</Title>
                <Pill variant="warning">Needs review</Pill>
                <Paragraph>
                  Confirm yesterday’s workspace sync before closing the support
                  ticket.
                </Paragraph>
                <Button variant="primary" wide>
                  <Paragraph>Open review</Paragraph>
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Content>
      <Content pad wide>
        <Space align="center" justify="between" wide>
          <Paragraph>6 reviews · 1 blocked</Paragraph>
          <Paragraph>Updated moments ago</Paragraph>
        </Space>
      </Content>
    </Page>
  ),
};

export const ScrollableOperationsPage: Story = {
  render: () => (
    <Page fixed gap>
      <Header
        title="Operations queue"
        description="Two bounded rails with deliberate, independent scroll ownership."
        actions={
          <Button variant="primary">
            <Paragraph>New escalation</Paragraph>
          </Button>
        }
      />
      <Content pad grow fill>
        <Row gap grow fill>
          <Col xs={24} md={16}>
            <Card grow fill wide>
              <Content pad wide>
                <Title size="small">Active work</Title>
              </Content>
              <ScrollArea orientation="vertical" grow fill>
                <ActionList>
                  {[...workItems, ...workItems].map((item, index) => (
                    <QueueItem
                      key={`${item.id}-${index}`}
                      title={item.name}
                      description={`${item.owner} · updated ${item.updated} ago`}
                      status={item.status}
                      selected={index === 2}
                    />
                  ))}
                </ActionList>
              </ScrollArea>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card grow fill wide>
              <Content pad wide>
                <Title size="small">Shift brief</Title>
              </Content>
              <ScrollArea orientation="vertical" grow fill>
                <ActionList>
                  <QueueItem
                    title="Escalation path"
                    description="Analytics owns usage spikes; support owns retries."
                    status="Reference"
                  />
                  <QueueItem
                    title="Evening coverage"
                    description="Monitor export retries between 6 PM and 8 PM."
                    status="Assigned"
                  />
                  <QueueItem
                    title="Tomorrow"
                    description="Roll the webhook scope update after validation."
                    status="Planned"
                  />
                  <QueueItem
                    title="Release note"
                    description="One workspace still requires a manual sync."
                    status="Draft"
                  />
                </ActionList>
              </ScrollArea>
            </Card>
          </Col>
        </Row>
      </Content>
    </Page>
  ),
};

export const AnalyticsWorkspace: Story = {
  render: () => (
    <Page fixed gap>
      <Header
        title="Analytics workspace"
        description="A growing primary chart with a compact supporting rail."
        actions={
          <>
            <Select searchable fixed
              options={[
                { value: "week", element: "This week" },
                { value: "month", element: "This month" },
              ]}
              defaultValue="week"
            />
            <Button variant="primary">
              <Paragraph>Share report</Paragraph>
            </Button>
          </>
        }
      />
      <Content pad grow fill>
        <Row gap grow fill>
          <Col xs={24} md={14}>
            <Card pad grow fill wide>
              <Space direction="vertical" gap wide fill>
                <Space align="center" justify="between" wide>
                  <Title size="small">Activation trend</Title>
                  <Pill variant="success">+12.4%</Pill>
                </Space>
                <Content grow fill wide>
                  <MultiLineChart
                    lines={[
                      {
                        label: "Signups",
                        values: [
                          { x: "2026-08-20", y: 18 },
                          { x: "2026-08-21", y: 24 },
                          { x: "2026-08-22", y: 28 },
                          { x: "2026-08-23", y: 31 },
                        ],
                      },
                      {
                        label: "Activations",
                        values: [
                          { x: "2026-08-20", y: 12 },
                          { x: "2026-08-21", y: 16 },
                          { x: "2026-08-22", y: 22 },
                          { x: "2026-08-23", y: 20 },
                        ],
                      },
                    ]}
                    hoverLabel="events"
                    fill
                    showVerticalTicks
                    smooth
                  />
                </Content>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={10}>
            <Card pad grow fill wide>
              <Space direction="vertical" gap wide fill>
                <Title size="small">Cohort health</Title>
                <StackedBreakdownChart
                  labels={["Helpful", "Neutral", "Risky"]}
                  xLabels={[
                    <Paragraph key="w1">Week 1</Paragraph>,
                    <Paragraph key="w2">Week 2</Paragraph>,
                    <Paragraph key="w3">Week 3</Paragraph>,
                  ]}
                  rows={[
                    {
                      key: "w1",
                      labelWeights: {
                        Helpful: 0.52,
                        Neutral: 0.28,
                        Risky: 0.2,
                      },
                    },
                    {
                      key: "w2",
                      labelWeights: {
                        Helpful: 0.57,
                        Neutral: 0.24,
                        Risky: 0.19,
                      },
                    },
                    {
                      key: "w3",
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
            </Card>
          </Col>
        </Row>
      </Content>
    </Page>
  ),
};

export const KnowledgeBaseWorkspace: Story = {
  render: () => (
    <Page fixed gap>
      <Header
        title="Knowledge base"
        description="Navigation stays static while the selected article collection scrolls."
        actions={
          <Button variant="primary">
            <Paragraph>New article</Paragraph>
          </Button>
        }
      />
      <Content pad grow fill>
        <Row gap grow fill>
          <Col xs={24} md={6}>
            <Card grow fill wide>
              <Content pad wide>
                <Title size="small">Sections</Title>
              </Content>
              <ActionList role="listbox" divided={false}>
                <ActionListItem
                  role="option"
                  aria-selected
                  title={<Paragraph>Integration guides</Paragraph>}
                  leading={<Icon name="Note" />}
                  onClick={() => undefined}
                />
                <ActionListItem
                  role="option"
                  aria-selected={false}
                  title={<Paragraph>Release playbooks</Paragraph>}
                  leading={<Icon name="Calendar" />}
                  onClick={() => undefined}
                />
                <ActionListItem
                  role="option"
                  aria-selected={false}
                  title={<Paragraph>Support macros</Paragraph>}
                  leading={<Icon name="Message" />}
                  onClick={() => undefined}
                />
              </ActionList>
            </Card>
          </Col>
          <Col xs={24} md={18}>
            <Card pad grow fill wide>
              <Tabs defaultActiveKey="published">
                <Tab key="published" label="Published">
                  <ScrollArea orientation="vertical" grow fill>
                    <ActionList>
                      <QueueItem
                        title="Authentication setup"
                        description="Token creation, callbacks, and secret rotation."
                        status="Updated"
                      />
                      <QueueItem
                        title="Webhook troubleshooting"
                        description="Retry timing, signatures, and delivery checks."
                        status="Popular"
                      />
                      <QueueItem
                        title="SSO provisioning"
                        description="Attribute mapping and first-login recovery."
                        status="Updated"
                      />
                      <QueueItem
                        title="Bulk exports"
                        description="Pagination, retries, and safe resume behavior."
                        status="Stable"
                      />
                      <QueueItem
                        title="Sandbox verification"
                        description="Checks to complete before promotion."
                        status="Draft"
                      />
                    </ActionList>
                  </ScrollArea>
                </Tab>
                <Tab key="drafts" label="Drafts">
                  <Space direction="vertical" gap wide>
                    <Title size="small">Two drafts need review</Title>
                    <Paragraph>
                      Complete owner and rollout details before publishing.
                    </Paragraph>
                  </Space>
                </Tab>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </Content>
    </Page>
  ),
};

export const ChatWorkspace: Story = {
  render: () => (
    <Page fixed gap>
      <Header
        title="Team inbox"
        description="Contacts and messages scroll independently; the composer remains fixed."
        actions={
          <Button variant="primary">
            <Paragraph>New conversation</Paragraph>
          </Button>
        }
      />
      <Content pad grow fill>
        <Row gap grow fill>
          <Col xs={24} md={7}>
            <Card grow fill wide>
              <Content pad wide>
                <Space align="center" justify="between" wide>
                  <Title size="small">Contacts</Title>
                  <Pill variant="success">12 online</Pill>
                </Space>
              </Content>
              <ScrollArea orientation="vertical" grow fill>
                <ActionList>
                  <QueueItem
                    title="Jordan Lee"
                    description="Can you review the launch checklist?"
                    status="Now"
                    selected
                  />
                  <QueueItem
                    title="Maya Chen"
                    description="The invoice correction is ready."
                    status="8m"
                  />
                  <QueueItem
                    title="Sergio Patel"
                    description="The rollback note can close."
                    status="21m"
                  />
                  <QueueItem
                    title="Billing Ops"
                    description="Renewal totals are confirmed."
                    status="1h"
                  />
                  <QueueItem
                    title="Support lead"
                    description="Customer summary is ready."
                    status="2h"
                  />
                </ActionList>
              </ScrollArea>
            </Card>
          </Col>
          <Col xs={24} md={17}>
            <Card pad grow fill wide>
              <Space direction="vertical" gap wide fill>
                <Space align="center" justify="between" wide>
                  <Space direction="vertical" gap>
                    <Title size="small">Jordan Lee</Title>
                    <Paragraph>Design review · online now</Paragraph>
                  </Space>
                  <Button variant="ghost">
                    <Paragraph>Details</Paragraph>
                  </Button>
                </Space>
                <ScrollArea orientation="vertical" grow fill stickToEnd>
                  <Space direction="vertical" gap wide>
                    {chatMessage(
                      "I pulled the latest workspace notes into the review queue.",
                      "9:14 AM",
                      "left",
                    )}
                    {chatMessage(
                      "Keep the invoice correction and support handoff in the same thread.",
                      "9:16 AM",
                      "right",
                    )}
                    {chatMessage(
                      "I attached the billing diff and pinned the approvals.",
                      "9:18 AM",
                      "left",
                    )}
                    {chatMessage(
                      "Perfect. I’ll send the final review request now.",
                      "9:19 AM",
                      "right",
                    )}
                  </Space>
                </ScrollArea>
                <Space align="center" gap wide noWrap>
                  <Input grow placeholder="Write a reply…" />
                  <Button variant="primary">
                    <Paragraph>Send</Paragraph>
                  </Button>
                </Space>
              </Space>
            </Card>
          </Col>
        </Row>
      </Content>
    </Page>
  ),
};

const assets = [
  {
    id: "banner",
    value: "banner",
    title: <Paragraph>Launch banner</Paragraph>,
    preview: <Icon name="Image" size="large" />,
  },
  {
    id: "hero",
    value: "hero",
    title: <Paragraph>Homepage hero</Paragraph>,
    preview: <Icon name="Scene" size="large" />,
  },
  {
    id: "billing",
    value: "billing",
    title: <Paragraph>Billing capture</Paragraph>,
    preview: <Icon name="Table" size="large" />,
  },
];

export const AssetReviewWorkspace: Story = {
  render: () => (
    <Page fixed gap>
      <Header
        title="Asset review"
        description="A queue, growing preview, and metadata rail form one review slice."
        actions={
          <Button variant="primary">
            <Paragraph>Publish</Paragraph>
          </Button>
        }
      />
      <Content pad grow fill>
        <Row gap grow fill>
          <Col xs={24} md={6}>
            <Card pad grow fill wide>
              <Space direction="vertical" gap wide>
                <Title size="small">Queue</Title>
                <ThumbnailGrid items={assets} value="banner" columns={1} />
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card pad grow fill wide>
              <Space direction="vertical" gap wide fill>
                <Space align="center" justify="between" wide>
                  <Title size="small">Preview</Title>
                  <Pill variant="warning">Needs review</Pill>
                </Space>
                <Card grow fill wide variant="ghost">
                  <Space
                    direction="vertical"
                    align="center"
                    justify="center"
                    gap
                    wide
                    fill
                  >
                    <Icon name="Image" size="large" />
                    <Title>Launch banner</Title>
                    <Paragraph>
                      Validate crop, contrast, and final copy.
                    </Paragraph>
                  </Space>
                </Card>
                <Space align="center" justify="between" wide>
                  <Paragraph>2 approvals</Paragraph>
                  <Space gap>
                    <Button variant="ghost">
                      <Paragraph>Reject</Paragraph>
                    </Button>
                    <Button variant="active">
                      <Paragraph>Approve</Paragraph>
                    </Button>
                  </Space>
                </Space>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card pad grow fill wide>
              <Space direction="vertical" gap wide>
                <Title size="small">Details</Title>
                <ActionList divided={false}>
                  <ActionListItem
                    title={<Paragraph>Owner</Paragraph>}
                    description={<Paragraph>Design operations</Paragraph>}
                  />
                  <ActionListItem
                    title={<Paragraph>Placement</Paragraph>}
                    description={
                      <Paragraph>Launch page and support portal</Paragraph>
                    }
                  />
                  <ActionListItem
                    title={<Paragraph>Dimensions</Paragraph>}
                    description={<Paragraph>2400 × 1200</Paragraph>}
                  />
                </ActionList>
              </Space>
            </Card>
          </Col>
        </Row>
      </Content>
    </Page>
  ),
};

export const QueryWorkbench: Story = {
  render: () => (
    <Page fixed gap>
      <Header
        title="Query workbench"
        description="The editor and result table share a bounded, full-height workspace."
        actions={
          <>
            <Button variant="ghost">
              <Paragraph>Format SQL</Paragraph>
            </Button>
            <Button variant="primary">
              <Paragraph>Run query</Paragraph>
            </Button>
          </>
        }
      />
      <Content pad grow fill>
        <Row gap grow fill>
          <Col xs={24} md={9}>
            <Card pad grow fill wide>
              <Space direction="vertical" gap wide fill>
                <Space align="center" justify="between" wide>
                  <Title size="small">Editor</Title>
                  <Pill variant="success">Saved</Pill>
                </Space>
                <Content grow fill wide>
                  <CodeArea
                    fill
                    lineNumbers
                    highlightCurrentLine
                    rules={sqlRules}
                    defaultValue={`-- Daily workspace rollup
select
  owner,
  count(*) as sessions,
  avg(duration_ms) as avg_duration
from workspace_sessions
where created_at >= '2026-08-01'
group by 1
order by 2 desc
limit 20;`}
                  />
                </Content>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={15}>
            <Card pad grow fill wide>
              <ScrollArea orientation="vertical" grow fill>
                <Space direction="vertical" gap wide>
                  <Row gap>
                    <Col xs={24} md={15}>
                      <Card pad wide>
                        <MultiLineChart
                          lines={[
                            {
                              label: "Sessions",
                              values: [
                                { x: "Mon", y: 1220 },
                                { x: "Tue", y: 1384 },
                                { x: "Wed", y: 1495 },
                                { x: "Thu", y: 1610 },
                              ],
                            },
                          ]}
                          hoverLabel="rows"
                          showVerticalTicks
                          smooth
                        />
                      </Card>
                    </Col>
                    <Col xs={24} md={9}>
                      <Card pad fill wide>
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
                  <DataTable
                    title="Results"
                    columns={workColumns}
                    rows={workItems}
                    getRowId={(row) => row.id}
                    defaultPageSize={3}
                    pageSizeOptions={[3, 6]}
                  />
                </Space>
              </ScrollArea>
            </Card>
          </Col>
        </Row>
      </Content>
    </Page>
  ),
};

export const MissionControlWorkspace: Story = {
  render: () => (
    <Page fixed gap>
      <Header
        title="Mission control"
        description="A live board with equal-height action, telemetry, and state rails."
        actions={
          <>
            <Pill variant="success" icon="Check">
              Live
            </Pill>
            <Button variant="primary">
              <Paragraph>Broadcast update</Paragraph>
            </Button>
          </>
        }
      />
      <Content pad grow fill>
        <Row gap grow fill>
          <Col xs={24} md={6}>
            <Card grow fill wide>
              <Content pad wide>
                <Title size="small">Action queue</Title>
              </Content>
              <ScrollArea orientation="vertical" grow fill>
                <ActionList>
                  <QueueItem
                    title="Traffic shift"
                    description="Confirm rollback readiness."
                    status="Now"
                    selected
                  />
                  <QueueItem
                    title="Launch gate"
                    description="Publish the revised support note."
                    status="Next"
                  />
                  <QueueItem
                    title="Customer queue"
                    description="Wait for analytics signoff."
                    status="Watching"
                  />
                </ActionList>
              </ScrollArea>
            </Card>
          </Col>
          <Col xs={24} md={11}>
            <Card pad grow fill wide>
              <Space direction="vertical" gap wide fill>
                <Title size="small">Control board</Title>
                <Space align="center" justify="between" gap wide noWrap>
                  <Pill variant="success" icon="Check">
                    Traffic stable
                  </Pill>
                  <Pill variant="warning">1 incident</Pill>
                  <Pill icon="User">4 owners on shift</Pill>
                </Space>
                <Content grow fill wide>
                  <StackedBreakdownChart
                    fill
                    labels={["Stable", "Watch", "Blocked"]}
                    xLabels={[
                      <Paragraph key="8">08:00</Paragraph>,
                      <Paragraph key="10">10:00</Paragraph>,
                      <Paragraph key="12">12:00</Paragraph>,
                      <Paragraph key="14">14:00</Paragraph>,
                    ]}
                    rows={[
                      {
                        key: "8",
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
                </Content>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={7}>
            <Card pad grow fill wide>
              <Space direction="vertical" gap wide>
                <Title size="small">Live state</Title>
                <EmbeddingHeatmap
                  embedding={[
                    [0.12, 0.18, 0.31, 0.42, 0.5, 0.61],
                    [0.22, 0.36, 0.49, 0.38, 0.24, 0.15],
                    [0.41, 0.58, 0.72, 0.63, 0.31, 0.18],
                  ]}
                  height={120}
                />
                <LabelBars
                  labels={[
                    { label: "Stable", prob: 0.71 },
                    { label: "Watch", prob: 0.19 },
                    { label: "Blocked", prob: 0.1 },
                  ]}
                />
                <Button variant="primary" wide>
                  <Paragraph>Escalate</Paragraph>
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Content>
    </Page>
  ),
};

const objectEditorPrefabs = [
  {
    id: "cube",
    value: "cube",
    title: <Paragraph>Cube</Paragraph>,
    preview: <Icon name="Cube" size="large" />,
  },
  {
    id: "sphere",
    value: "sphere",
    title: <Paragraph>Sphere</Paragraph>,
    preview: <Icon name="Sphere" size="large" />,
  },
];

const ObjectEditorPage = () => {
  const [enabled, setEnabled] = React.useState(true);
  const [position, setPosition] = React.useState({ x: 0, y: 1, z: 0 });
  const [color, setColor] = React.useState({
    r: 79 / 255,
    g: 128 / 255,
    b: 192 / 255,
  });
  const [prefab, setPrefab] = React.useState("cube");

  return (
    <Page fixed gap>
      <Content pad wide>
        <Space align="center" justify="between" gap wide noWrap>
          <Space direction="vertical" gap grow>
            <Space align="center" gap>
              <Title>Scene editor</Title>
              <Pill variant="success">Saved</Pill>
            </Space>
            <Paragraph>
              Edit the selected object while the canvas consumes the remaining
              workspace.
            </Paragraph>
          </Space>
          <Button variant="primary" icon="Check">
            <Paragraph>Save scene</Paragraph>
          </Button>
        </Space>
      </Content>
      <Content pad grow fill wide>
        <Row gap grow fill>
          <Col xs={24} md={8}>
            <Card grow fill wide>
              <Content pad wide>
                <Space align="center" justify="between" gap wide>
                  <Space direction="vertical" gap grow>
                    <Title size="small">Object inspector</Title>
                    <Paragraph>Oak tree · selected</Paragraph>
                  </Space>
                  <Space align="center" gap noWrap>
                    <Checkbox
                      aria-label="Object enabled"
                      checked={enabled}
                      onChange={(event) =>
                        setEnabled(event.currentTarget.checked)
                      }
                    />
                    <Button
                      variant="ghost"
                      icon="Broom"
                      aria-label="Reset object"
                    />
                  </Space>
                </Space>
              </Content>
              <Divider />
              <ScrollArea orientation="vertical" grow fill>
                <Content pad wide>
                  <Space direction="vertical" gap wide>
                    <Space direction="vertical" gap wide>
                      <Title size="small">Transform</Title>
                      <Paragraph>Name</Paragraph>
                      <Input defaultValue="Oak tree" wide disabled={!enabled} />
                      <VectorField
                        label="Position"
                        value={position}
                        onChange={setPosition}
                        disabled={!enabled}
                        layout="toolbar"
                        showActions={false}
                      />
                    </Space>
                    <Divider />
                    <Space direction="vertical" gap wide>
                      <Title size="small">Appearance</Title>
                      <ColorField
                        value={color}
                        onChange={setColor}
                        disabled={!enabled}
                        wide
                      />
                    </Space>
                    <Divider />
                    <Space direction="vertical" gap wide>
                      <Title size="small">Prefab</Title>
                      <ThumbnailGrid
                        items={objectEditorPrefabs}
                        value={prefab}
                        onChange={setPrefab}
                        columns={2}
                      />
                    </Space>
                    <Divider />
                    <Space direction="vertical" gap wide>
                      <Space align="center" justify="between" wide>
                        <Title size="small">Scene budget</Title>
                        <Pill variant="warning">72 / 100</Pill>
                      </Space>
                      <LabelBars labels={[{ label: "Objects", prob: 0.72 }]} />
                    </Space>
                  </Space>
                </Content>
              </ScrollArea>
            </Card>
          </Col>
          <Col xs={24} md={16}>
            <Aspect fill grow>
              <Card fill wide variant="ghost">
                <Space
                  direction="vertical"
                  align="center"
                  justify="center"
                  gap
                  wide
                  fill
                >
                  <Icon name="Scene" size="large" />
                  <Title>Canvas</Title>
                  <Paragraph>
                    The consuming application supplies the renderer surface.
                  </Paragraph>
                </Space>
                <Dock position="top-left">
                  <ButtonGroup>
                    <Button variant="active" icon="Move">
                      <Paragraph>Move</Paragraph>
                    </Button>
                    <Button icon="Rotate">
                      <Paragraph>Rotate</Paragraph>
                    </Button>
                    <Button icon="Resize">
                      <Paragraph>Scale</Paragraph>
                    </Button>
                  </ButtonGroup>
                </Dock>
                <Dock position="bottom-right">
                  <Button variant="primary" icon="Check">
                    <Paragraph>Apply changes</Paragraph>
                  </Button>
                </Dock>
              </Card>
            </Aspect>
          </Col>
        </Row>
      </Content>
    </Page>
  );
};

export const FullPageObjectEditor: Story = {
  render: () => <ObjectEditorPage />,
};
