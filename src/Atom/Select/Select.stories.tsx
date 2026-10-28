import React from "react";
import exampleImage from "../../../.storybook/assets/example-image.svg";
import { Meta, StoryObj } from "@storybook/react";
import Select from "./Select";
import Icon from "../../Icon/Icon";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";
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

const statusElementOptions = statusOptions.map(
  ({ value, element, category }) => ({
    value,
    category,
    element: (
      <Space align="center" gap noWrap>
        {element.props.leading}
        {element.props.title}
      </Space>
    ),
  }),
);

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

const thumbnailOptions = [
  {
    value: "cube",
    label: <Paragraph>Cube</Paragraph>,
    element: (
      <ActionListItem
        title={<Paragraph>Cube</Paragraph>}
        description={<Paragraph>Scene primitive</Paragraph>}
      />
    ),
    thumbnail: <Icon name="Cube" />,
    keywords: ["box", "block"],
  },
  {
    value: "sphere",
    label: <Paragraph>Sphere</Paragraph>,
    element: (
      <ActionListItem
        title={<Paragraph>Sphere</Paragraph>}
        description={<Paragraph>Scene primitive</Paragraph>}
      />
    ),
    thumbnail: <Icon name="Sphere" />,
  },
  {
    value: "image",
    label: <Paragraph>Landscape</Paragraph>,
    element: (
      <ActionListItem
        title={<Paragraph>Landscape</Paragraph>}
        description={<Paragraph>Image asset</Paragraph>}
      />
    ),
    thumbnail: (
      <Icon
        name="Picture"
        preserveColor
        aria-label="Landscape thumbnail"
        src={exampleImage}
      />
    ),
  },
];

const compactThumbnailOptions = [
  {
    value: "cube",
    element: <Paragraph>Cube</Paragraph>,
    thumbnail: <Icon name="Cube" size="small" />,
    keywords: ["box", "block"],
  },
  {
    value: "sphere",
    element: <Paragraph>Sphere</Paragraph>,
    thumbnail: <Icon name="Sphere" size="small" />,
  },
  {
    value: "image",
    element: <Paragraph>Landscape</Paragraph>,
    thumbnail: (
      <Icon
        name="Picture"
        src={exampleImage}
        preserveColor
        size="small"
        aria-label="Landscape thumbnail"
      />
    ),
  },
];

const meta: Meta<typeof Select> = {
  title: "Design System/Atomic/Inputs/Select",
  component: Select,
  argTypes: {
    searchable: { control: "boolean" },
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
          "disabled",
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
  render: (args) => (
    <Space direction="vertical" gap align="start">
      <Select {...args} />
      <Select {...args} defaultValue="draft" options={statusElementOptions} />
      <Select
        {...args}
        options={thumbnailOptions}
        defaultValue="cube"
        searchable={args.searchable ?? true}
      />
      {(["small", "large"] as const).map((size) => (
        <Space key={size} gap align="center">
          <Select
            {...args}
            size={size}
            options={thumbnailOptions}
            defaultValue="cube"
            searchable={args.searchable ?? true}
          />
          {size === "small" && (
            <Select
              {...args}
              size="small"
              options={compactThumbnailOptions}
              defaultValue="cube"
              searchable={args.searchable ?? true}
            />
          )}
        </Space>
      ))}
    </Space>
  ),
  args: {
    options: statusOptions,
    categoryOrder: ["Open", "Planned", "Completed"],
    placeholder: "Choose a status",
    variant: "default",
    size: "default",
  },
};

export const WithDirectionsAndSizes: Story = {
  render: () => (
    <Space direction="vertical" gap wide>
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
      {(["small", "default", "large"] as const).map((size) => (
        <Select
          key={size}
          wide
          size={size}
          direction={size === "large" ? "bottom-right" : "bottom-left"}
          options={thumbnailOptions}
          defaultValue="cube"
        />
      ))}
    </Space>
  ),
};
