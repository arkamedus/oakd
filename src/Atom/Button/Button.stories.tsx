import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Button, { ButtonGroup } from "./Button";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";

const sizes = ["small", "default", "large"] as const;
const variants = ["default", "primary", "active", "success", "warning", "danger", "ghost", "disabled"] as const;
const meta: Meta<typeof Button> = {
  title: "Design System/Atomic/Button",
  component: Button,
  tags: ["!autodocs"],
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "select", options: sizes },
    disabled: { control: "boolean" },
    onClick: { action: "clicked" },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  render: (args) => (
    <Space direction="vertical" gap>
      {sizes.map(size => (
        <Space key={size} direction="vertical" gap>
          <Space gap align="center">
            {variants.map(variant => (
              <Button {...args} key={variant} size={size} variant={variant}>
                <Paragraph>{variant}</Paragraph>
              </Button>
            ))}
          </Space>
          <Space gap align="center">
            <Button {...args} size={size} icon="Plus" aria-label="Add" />
            <Button {...args} size={size} icon="Folder"><Paragraph>Folder</Paragraph></Button>
            <Button {...args} size={size} icon="Plus"><Paragraph>Add</Paragraph></Button>
            <Button {...args} size={size} disabled><Paragraph>Disabled</Paragraph></Button>
          </Space>
          <Space gap justify="stretch">
            <Button {...args} size={size} icon="Plus" aria-label="Add" />
            <Button {...args} size={size}><Paragraph>Button</Paragraph></Button>
            <Button {...args} size={size} icon="Plus"><Paragraph>Two lines make<br />the others stretch</Paragraph></Button>
          </Space>
        </Space>
      ))}
    </Space>
  ),
};

export const ButtonGroups: Story = {
  render: (args) => (
    <Space direction="vertical" gap>
      {sizes.map(size => (
        <Space key={size} gap align="start">
          {(["horizontal", "vertical"] as const).map(direction => (
            <ButtonGroup key={direction} direction={direction}>
              <Button {...args} size={size} icon="Star" aria-label="Favorite" />
              <Button {...args} size={size} icon="Magnify" aria-label="Search" />
              <Button {...args} size={size} icon="Text"><Paragraph>Text</Paragraph></Button>
              <Button {...args} size={size} icon="Comment" aria-label="Comment" />
            </ButtonGroup>
          ))}
        </Space>
      ))}
    </Space>
  ),
};
