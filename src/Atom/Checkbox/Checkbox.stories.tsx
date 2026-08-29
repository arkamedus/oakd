import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Checkbox from "./Checkbox";
const meta: Meta<typeof Checkbox> = {
  title: "Design System/Atomic/Inputs/Checkbox",
  component: Checkbox,
  argTypes: {
    icon: { control: "select", options: ["Check", "X", "Minus"] },
    size: { control: "inline-radio", options: ["small", "default", "large"] },
  },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;
export const Default: Story = {
  render: () => (
    <Space direction="vertical" gap>
      <Checkbox label={<Paragraph>Unchecked option</Paragraph>} />
      <Checkbox
        label={<Paragraph>Initially checked option</Paragraph>}
        defaultChecked
      />
      <Checkbox
        label={<Paragraph>Small checked option</Paragraph>}
        defaultChecked
        size="small"
      />
      <Checkbox
        label={<Paragraph>Small disabled option</Paragraph>}
        size="small"
        disabled
      />
      <Checkbox label={<Paragraph>Required agreement</Paragraph>} required />
    </Space>
  ),
};

export const IconsAndSizes: Story = {
  render: () => (
    <Space direction="vertical" gap>
      <Checkbox
        label={<Paragraph>Default check icon</Paragraph>}
        defaultChecked
      />
      <Checkbox label={<Paragraph>X icon</Paragraph>} icon="X" defaultChecked />
      <Checkbox
        label={<Paragraph>Small minus icon</Paragraph>}
        icon="Minus"
        size="small"
        defaultChecked
      />
      <Checkbox
        label={<Paragraph>Large X icon</Paragraph>}
        icon="X"
        size="large"
        defaultChecked
      />
    </Space>
  ),
};

export const CustomStyles: Story = {
  render: () => (
    <Space direction="vertical" gap>
      <Checkbox
        label={<Paragraph>Approved</Paragraph>}
        defaultChecked
        style={{ color: "var(--oakd-success-border)" }}
      />
      <Checkbox
        label={<Paragraph>Rejected</Paragraph>}
        icon="X"
        defaultChecked
        style={{ color: "var(--oakd-danger-border)" }}
      />
    </Space>
  ),
};
