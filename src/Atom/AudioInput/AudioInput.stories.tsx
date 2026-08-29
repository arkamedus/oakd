import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import AudioInput from "./AudioInput";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Title from "../Title/Title";
import Card from "../Card/Card";
import ContentRail from "../../Layout/ContentRail/ContentRail";

const meta: Meta<typeof AudioInput> = {
  title: "Design System/Atomic/Inputs/AudioInput",
  component: AudioInput,
  argTypes: {
    onChange: { action: "changed" },
  },
};

export default meta;

type Story = StoryObj<typeof AudioInput>;

export const Default: Story = {
  args: {
    disabled: false,
  },
  render: (args) => (
    <ContentRail size="sm" gutter={false}>
      <Card pad wide>
        <Space direction="vertical" gap>
          <Title>Attach a voice note</Title>
          <Paragraph>
            Record a short handoff for the next teammate before submitting the
            ticket.
          </Paragraph>
          <AudioInput {...args} />
        </Space>
      </Card>
    </ContentRail>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <ContentRail size="sm" gutter={false}>
      <Card pad wide>
        <Space direction="vertical" gap>
          <Title>Voice notes unavailable</Title>
          <Paragraph>
            Recording is disabled while microphone permissions are still
            pending.
          </Paragraph>
          <AudioInput {...args} />
        </Space>
      </Card>
    </ContentRail>
  ),
};
