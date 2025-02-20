import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import AudioInput from "./AudioInput";
import Space from "../Space/Space";

const meta: Meta<typeof AudioInput> = {
  title: "Design System/Atomic/AudioInput",
  component: AudioInput,
  argTypes: {
    onChange: { action: "changed" },
  },
};
export default meta;

const Template: StoryFn<typeof AudioInput> = (args) => (
  <Space direction="vertical" gap>
    <AudioInput {...args} />
  </Space>
);

export const Default = Template.bind({});
Default.args = {
  disabled: false,
  onChange: (value: string) => console.log("Audio changed to: ", value),
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};
