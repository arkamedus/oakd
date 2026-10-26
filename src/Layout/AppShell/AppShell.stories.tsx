import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import ActionList, { ActionListItem } from "../../Atom/ActionList/ActionList";
import Button, { ButtonGroup } from "../../Atom/Button/Button";
import Card from "../../Atom/Card/Card";
import Paragraph from "../../Atom/Paragraph/Paragraph";
import Pill from "../../Atom/Pill/Pill";
import Space from "../../Atom/Space/Space";
import Title from "../../Atom/Title/Title";
import Icon from "../../Icon/Icon";
import Col from "../Column/Column";
import Content from "../Content/Content";
import Page from "../Page/Page";
import Row from "../Row/Row";
import AppShell from "./AppShell";

const meta: Meta<typeof AppShell> = {
  title: "Design System/Layout/AppShell",
  component: AppShell,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "AppShell owns the full application viewport. Its main region consumes every pixel left by fixed chrome; consumers add padding inside that full-width region and only introduce a ContentRail when the product intentionally needs a bounded reading measure.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppShell>;

const header = (
  <Content pad wide>
    <Space align="center" justify="between" gap wide noWrap>
      <Space align="center" gap noWrap>
        <Icon name="Cloud" size="small" />
        <Title size="small">Atlas</Title>
        <Pill size="small">Production</Pill>
      </Space>
      <Space align="center" gap noWrap>
        <Button icon="Bell" aria-label="Notifications" />
        <Button variant="primary" icon="Plus">
          <Paragraph>New project</Paragraph>
        </Button>
      </Space>
    </Space>
  </Content>
);

const sidebar = (
  <Content pad wide>
    <ActionList>
      <ActionListItem
        leading={<Icon name="Home" size="small" />}
        title={<Paragraph>Overview</Paragraph>}
        description={<Paragraph>Workspace health</Paragraph>}
        aria-current="page"
        onClick={() => undefined}
      />
      <ActionListItem
        leading={<Icon name="Folder" size="small" />}
        title={<Paragraph>Projects</Paragraph>}
        description={<Paragraph>12 active</Paragraph>}
        onClick={() => undefined}
      />
      <ActionListItem
        leading={<Icon name="User" size="small" />}
        title={<Paragraph>Team</Paragraph>}
        description={<Paragraph>24 members</Paragraph>}
        onClick={() => undefined}
      />
      <ActionListItem
        leading={<Icon name="Cog" size="small" />}
        title={<Paragraph>Settings</Paragraph>}
        onClick={() => undefined}
      />
    </ActionList>
  </Content>
);

const collapsedSidebar = (
  <Content pad>
    <ButtonGroup direction="vertical">
      <Button icon="Home" aria-label="Overview" variant="active" />
      <Button icon="Folder" aria-label="Projects" />
      <Button icon="User" aria-label="Team" />
      <Button icon="Cog" aria-label="Settings" />
    </ButtonGroup>
  </Content>
);

const MetricCard = ({
  label,
  value,
  detail,
  status,
}: {
  label: string;
  value: string;
  detail: string;
  status: "success" | "warning" | "danger";
}) => (
  <Card pad wide fill>
    <Space direction="vertical" gap wide>
      <Space align="center" justify="between" gap wide noWrap>
        <Paragraph>{label}</Paragraph>
        <Pill size="small" variant={status}>
          {detail}
        </Pill>
      </Space>
      <Title size="small">{value}</Title>
    </Space>
  </Card>
);

const projectItems = [
  ["Northstar migration", "8 of 12 environments ready", "Review"],
  ["Billing reconciliation", "Completed 14 minutes ago", "Ready"],
  ["Mobile release", "Two checks need attention", "Blocked"],
  ["Support handoff", "Scheduled for 3:30 PM", "Planned"],
] as const;

const activityItems = [
  ["Maya approved Northstar", "4 minutes ago"],
  ["Sergio deployed billing-api", "14 minutes ago"],
  ["Priya added three reviewers", "27 minutes ago"],
  ["Jordan updated the launch brief", "41 minutes ago"],
] as const;

const body = (
  <Page>
    <Content pad wide>
      <Space direction="vertical" gap wide>
        <Space align="center" justify="between" gap wide noWrap>
          <Space direction="vertical" gap grow>
            <Title>Workspace overview</Title>
            <Paragraph>
              Operational status across every active project and environment.
            </Paragraph>
          </Space>
          <Button icon="Clock">
            <Paragraph>Last 30 days</Paragraph>
          </Button>
        </Space>

        <Row gap>
          <Col xs={24} md={8}>
            <MetricCard
              label="Deployments"
              value="128"
              detail="12% up"
              status="success"
            />
          </Col>
          <Col xs={24} md={8}>
            <MetricCard
              label="Success rate"
              value="99.94%"
              detail="Healthy"
              status="success"
            />
          </Col>
          <Col xs={24} md={8}>
            <MetricCard
              label="Open reviews"
              value="7"
              detail="2 overdue"
              status="warning"
            />
          </Col>
        </Row>

        <Row gap>
          <Col xs={24} lg={15}>
            <Card pad wide fill>
              <Space direction="vertical" gap wide>
                <Space align="center" justify="between" gap wide noWrap>
                  <Title size="small">Active projects</Title>
                  <Button variant="ghost">
                    <Paragraph>View all</Paragraph>
                  </Button>
                </Space>
                <ActionList>
                  {projectItems.map(([title, description, status]) => (
                    <ActionListItem
                      key={title}
                      leading={<Icon name="Folder" size="small" />}
                      title={<Paragraph>{title}</Paragraph>}
                      description={<Paragraph>{description}</Paragraph>}
                      trailing={<Pill size="small">{status}</Pill>}
                      onClick={() => undefined}
                    />
                  ))}
                </ActionList>
              </Space>
            </Card>
          </Col>
          <Col xs={24} lg={9}>
            <Card pad wide fill>
              <Space direction="vertical" gap wide>
                <Title size="small">Recent activity</Title>
                <ActionList>
                  {activityItems.map(([title, description]) => (
                    <ActionListItem
                      key={title}
                      leading={<Icon name="Clock" size="small" />}
                      title={<Paragraph>{title}</Paragraph>}
                      description={<Paragraph>{description}</Paragraph>}
                      onClick={() => undefined}
                    />
                  ))}
                </ActionList>
              </Space>
            </Card>
          </Col>
        </Row>

        <Row gap>
          <Col xs={24} md={12}>
            <Card pad wide>
              <Space direction="vertical" gap wide>
                <Title size="small">Environment capacity</Title>
                <Paragraph>
                  Production is using 68% of its allocated compute capacity.
                </Paragraph>
                <Pill variant="success">Within operating range</Pill>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card pad wide>
              <Space direction="vertical" gap wide>
                <Title size="small">Next scheduled change</Title>
                <Paragraph>
                  Database maintenance begins tomorrow at 02:00 UTC.
                </Paragraph>
                <Button variant="ghost">
                  <Paragraph>Open change record</Paragraph>
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Space>
    </Content>
  </Page>
);

const footer = (
  <Content pad wide>
    <Space align="center" justify="between" gap wide noWrap>
      <Pill variant="success" size="small" icon="Check">
        All systems operational
      </Pill>
      <Paragraph>Last synchronized 2 minutes ago</Paragraph>
    </Space>
  </Content>
);

export const Expanded: Story = {
  args: {
    header,
    sidebar,
    footer,
    sidebarMode: "expanded",
    children: body,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A full application viewport with fixed global chrome, the standard OakD navigation rail, and a main dashboard that uses the complete remaining width.",
      },
    },
  },
};

export const Collapsed: Story = {
  args: {
    header,
    sidebar: collapsedSidebar,
    sidebarMode: "collapsed",
    children: body,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The collapsed navigation sizes itself from its padded icon stack, and the main dashboard expands into all remaining horizontal space.",
      },
    },
  },
};

export const HiddenWithoutFooter: Story = {
  args: {
    header,
    sidebar,
    sidebarMode: "hidden",
    children: body,
  },
  parameters: {
    docs: {
      description: {
        story:
          "With navigation and footer removed, the main dashboard spans the entire viewport width below the fixed header.",
      },
    },
  },
};
