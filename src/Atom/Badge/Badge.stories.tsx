import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Button from "../Button/Button";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";
import Badge from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Design System/Atomic/Badge",
  component: Badge,
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  render: () => (
    <Space direction="vertical" gap>
      {(["small", "default", "large"] as const).map((size) => (
        <Space key={size} gap align="center">
          {(
            [
              "default",
              "primary",
              "active",
              "success",
              "warning",
              "danger",
              "ghost",
              "disabled",
            ] as const
          ).map((variant) => (
            <Badge
              key={variant}
              size={size}
              variant={variant}
              label={`${variant} notification`}
            >
              <Button icon="Bell">
                <Paragraph>{variant}</Paragraph>
              </Button>
            </Badge>
          ))}
        </Space>
      ))}
    </Space>
  ),
};

export const WideAndHidden: Story = {
  render: () => (
    <Space direction="vertical" gap wide>
      <Badge wide variant="danger" label="Unsaved changes">
        <Button wide icon="Cog">
          <Paragraph>Object properties</Paragraph>
        </Button>
      </Badge>
      <Badge wide hidden label="No notification">
        <Button wide icon="Check">
          <Paragraph>Saved properties</Paragraph>
        </Button>
      </Badge>
    </Space>
  ),
};
