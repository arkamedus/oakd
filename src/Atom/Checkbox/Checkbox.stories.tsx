import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Checkbox from "./Checkbox";
const CheckboxSizes = (props: React.ComponentProps<typeof Checkbox>) => (
  <Space gap align="center">
    {(["small", "default", "large"] as const).map(size => <Checkbox {...props} key={size} size={size} />)}
  </Space>
);
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
      <CheckboxSizes label={<Paragraph>Unchecked option</Paragraph>} />
      <CheckboxSizes
        label={<Paragraph>Initially checked option</Paragraph>}
        defaultChecked
      />
      <CheckboxSizes
        label={<Paragraph>Disabled option</Paragraph>}
        disabled
      />
      <CheckboxSizes label={<Paragraph>Required agreement</Paragraph>} required />
    </Space>
  ),
};

export const IconsAndSizes: Story = {
  render: () => (
    <Space direction="vertical" gap>
      <CheckboxSizes
        label={<Paragraph>Default check icon</Paragraph>}
        defaultChecked
      />
      <CheckboxSizes label={<Paragraph>X icon</Paragraph>} icon="X" defaultChecked />
      <CheckboxSizes
        label={<Paragraph>Minus icon</Paragraph>}
        icon="Minus"
        defaultChecked
      />
    </Space>
  ),
};

export const CustomStyles: Story = {
  render: () => (
    <Space direction="vertical" gap>
      <CheckboxSizes
        label={<Paragraph>Approved</Paragraph>}
        defaultChecked
        style={{ color: "var(--oakd-success-border)" }}
      />
      <CheckboxSizes
        label={<Paragraph>Rejected</Paragraph>}
        icon="X"
        defaultChecked
        style={{ color: "var(--oakd-danger-border)" }}
      />
    </Space>
  ),
};
