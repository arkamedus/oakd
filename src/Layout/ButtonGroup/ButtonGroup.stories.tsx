import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Button, { ButtonGroup } from "../../Atom/Button/Button";
import Input from "../../Atom/Input/Input";
import Select from "../../Atom/Select/Select";
import Paragraph from "../../Atom/Paragraph/Paragraph";
import Space from "../../Atom/Space/Space";
import Icon from "../../Icon/Icon";

const options = [
  { value: "all", element: <Paragraph>All</Paragraph> },
  { value: "draft", element: <Paragraph>Draft</Paragraph> },
  { value: "published", element: <Paragraph>Published</Paragraph> },
];
const shapes = [
  {
    value: "cube",
    element: <Paragraph>Cube</Paragraph>,
    thumbnail: <Icon name="Cube" size="small" />,
  },
  {
    value: "sphere",
    element: <Paragraph>Sphere</Paragraph>,
    thumbnail: <Icon name="Sphere" size="small" />,
  },
];

const meta: Meta<typeof ButtonGroup> = {
  title: "Design System/Layout/ButtonGroup",
  component: ButtonGroup,
};
export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  render: () => (
    <Space direction="vertical" gap align="start">
      <ButtonGroup>
        <Button icon="Note">
          <Paragraph>Draft</Paragraph>
        </Button>
        <Button icon="Eye">
          <Paragraph>Review</Paragraph>
        </Button>
        <Button icon="Check" variant="success">
          <Paragraph>Publish</Paragraph>
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Input placeholder="Search" aria-label="Search" icon="Magnify" />
        <Button variant="primary">
          <Paragraph>Search</Paragraph>
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Input type="number" defaultValue={0} aria-label="X" icon="X" />
        <Input type="number" defaultValue={0} aria-label="Y" icon="Y" />
        <Button icon="Check" aria-label="Apply coordinates" />
      </ButtonGroup>
      <ButtonGroup>
        <Select options={options} defaultValue="all" />
        <Input placeholder="Filter items" aria-label="Filter items" />
        <Button icon="Magnify" aria-label="Find items" />
      </ButtonGroup>
      <ButtonGroup>
        <Button icon="Folder" aria-label="Open folder" />
        <Select options={options} defaultValue="draft" searchable fixed />
        <Button icon="Check" aria-label="Apply status" />
      </ButtonGroup>
      <ButtonGroup>
        <Select options={shapes} defaultValue="cube" searchable fixed />
        <Button variant="primary">
          <Paragraph>Add shape</Paragraph>
        </Button>
      </ButtonGroup>
    </Space>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Space direction="vertical" gap align="start">
      <ButtonGroup direction="vertical">
        <Button icon="Note">
          <Paragraph>Draft</Paragraph>
        </Button>
        <Button icon="Eye">
          <Paragraph>Review</Paragraph>
        </Button>
        <Button icon="Check" variant="success">
          <Paragraph>Publish</Paragraph>
        </Button>
      </ButtonGroup>
      <ButtonGroup direction="vertical">
        <Input placeholder="Search" aria-label="Search" icon="Magnify" />
        <Button variant="primary">
          <Paragraph>Search</Paragraph>
        </Button>
      </ButtonGroup>
      <ButtonGroup direction="vertical">
        <Input type="number" defaultValue={0} aria-label="X" icon="X" />
        <Input type="number" defaultValue={0} aria-label="Y" icon="Y" />
        <Button icon="Check">
          <Paragraph>Apply</Paragraph>
        </Button>
      </ButtonGroup>
      <ButtonGroup direction="vertical">
        <Select options={options} defaultValue="all" fixed />
        <Input placeholder="Filter items" aria-label="Filter items" />
        <Button icon="Magnify">
          <Paragraph>Find items</Paragraph>
        </Button>
      </ButtonGroup>
      <ButtonGroup direction="vertical">
        <Select options={shapes} defaultValue="cube" searchable fixed />
        <Button variant="primary">
          <Paragraph>Add shape</Paragraph>
        </Button>
      </ButtonGroup>
    </Space>
  ),
};
