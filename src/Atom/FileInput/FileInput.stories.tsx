import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import FileInput from "./FileInput";
const meta: Meta<typeof FileInput> = {
  title: "Design System/Atomic/Inputs/FileInput",
  component: FileInput,
};
export default meta;
type Story = StoryObj<typeof FileInput>;
export const Default: Story = {
  render: () => (
    <Space direction="vertical" gap align="start">
      <FileInput
        accept="image/png,image/jpeg"
        buttonLabel={<Paragraph>Choose image</Paragraph>}
      />
      <FileInput
        accept=".json"
        multiple
        variant="primary"
        buttonLabel={<Paragraph>Choose JSON files</Paragraph>}
      />
      <FileInput
        disabled
        buttonLabel={<Paragraph>Upload unavailable</Paragraph>}
      />
    </Space>
  ),
};
