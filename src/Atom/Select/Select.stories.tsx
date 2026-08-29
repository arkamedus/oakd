import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import Select from "./Select";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";
import Card from "../Card/Card";
import Title from "../Title/Title";
import { ActionListItem } from "../ActionList/ActionList";
import {
  IconCalendar,
  IconCheck,
  IconEye,
  IconNote,
  IconUser,
} from "../../Icon/Icons.bin";

const statusOptions = [
  {
    value: "draft",
    label: <Paragraph>Draft</Paragraph>,
    element: (
      <ActionListItem
        leading={<IconNote size="small" />}
        title={<Paragraph>Draft</Paragraph>}
      />
    ),
    category: "Open",
  },
  {
    value: "in_review",
    label: <Paragraph>In review</Paragraph>,
    element: (
      <ActionListItem
        leading={<IconEye size="small" />}
        title={<Paragraph>In review</Paragraph>}
      />
    ),
    category: "Open",
  },
  {
    value: "scheduled",
    label: <Paragraph>Scheduled</Paragraph>,
    element: (
      <ActionListItem
        leading={<IconCalendar size="small" />}
        title={<Paragraph>Scheduled</Paragraph>}
      />
    ),
    category: "Planned",
  },
  {
    value: "published",
    label: <Paragraph>Published</Paragraph>,
    element: (
      <ActionListItem
        leading={<IconCheck size="small" />}
        title={<Paragraph>Published</Paragraph>}
      />
    ),
    category: "Completed",
  },
];

const teammateOptions = [
  {
    value: "maya",
    label: <Paragraph>Maya Chen</Paragraph>,
    element: (
      <ActionListItem
        leading={<IconUser size="large" />}
        title={
          <Paragraph>
            <strong>Maya Chen</strong>
          </Paragraph>
        }
        description={<Paragraph>Design</Paragraph>}
      />
    ),
  },
  {
    value: "sergio",
    label: <Paragraph>Sergio Diaz</Paragraph>,
    element: (
      <ActionListItem
        leading={<IconUser size="large" />}
        title={
          <Paragraph>
            <strong>Sergio Diaz</strong>
          </Paragraph>
        }
        description={<Paragraph>Engineering</Paragraph>}
      />
    ),
  },
  {
    value: "river",
    label: <Paragraph>River Patel</Paragraph>,
    element: (
      <ActionListItem
        leading={<IconUser size="large" />}
        title={
          <Paragraph>
            <strong>River Patel</strong>
          </Paragraph>
        }
        description={<Paragraph>Research</Paragraph>}
      />
    ),
  },
];

const meta: Meta<typeof Select> = {
  title: "Design System/Atomic/Inputs/Select",
  component: Select,
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder when no selection is made",
    },
    variant: {
      control: {
        type: "select",
        options: [
          "default",
          "primary",
          "danger",
          "warning",
          "ghost",
          "active",
          "success",
        ],
      },
      description: "Visual variant for the select trigger",
    },
    size: {
      control: {
        type: "select",
        options: ["default", "small", "large"],
      },
      description: "Size of the select trigger button",
    },
    onChange: { action: "changed" },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    options: statusOptions,
    categoryOrder: ["Open", "Planned", "Completed"],
    placeholder: "Choose a status",
    variant: "default",
    size: "default",
  },
};

export const WithControlledValue: Story = {
  render: () => {
    const [assignee, setAssignee] = useState<string | undefined>("maya");

    return (
      <Card pad wide>
        <Space direction="vertical" gap>
          <Title>Assign reviewer</Title>
          <Paragraph>
            Pick the teammate who will review the release checklist this
            afternoon.
          </Paragraph>
          <Select
            value={assignee}
            onChange={setAssignee}
            options={teammateOptions}
            placeholder="Select a reviewer"
          />
          <Paragraph>
            Current reviewer: <strong>{assignee || "Unassigned"}</strong>
          </Paragraph>
        </Space>
      </Card>
    );
  },
};

export const WithDirectionsAndSizes: Story = {
  render: () => (
    <Space gap align="start">
      <Select
        size="small"
        options={teammateOptions}
        placeholder="Small"
        onChange={() => undefined}
      />
      <Select
        size="default"
        options={teammateOptions}
        placeholder="Default"
        onChange={() => undefined}
      />
      <Select
        size="large"
        direction="bottom-right"
        options={teammateOptions}
        placeholder="Large / right aligned"
        onChange={() => undefined}
      />
    </Space>
  ),
};
