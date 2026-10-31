import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import FileInput from "./FileInput";

const FileInputSizes = (props: React.ComponentProps<typeof FileInput>) => (
  <Space direction="vertical" gap align="start">
    {(["small", "default", "large"] as const).map(size => (
      <FileInput {...props} key={size} size={size} />
    ))}
  </Space>
);

const meta: Meta<typeof FileInput> = {
  title: "Design System/Atomic/Inputs/FileInput",
  component: FileInput,
};
export default meta;
type Story = StoryObj<typeof FileInput>;
export const Default: Story = {
  render: () => (
    <Space direction="vertical" gap align="start">
      <FileInputSizes
        accept="image/png,image/jpeg"
        buttonLabel={<Paragraph>Choose image</Paragraph>}
      />
      <FileInputSizes
        accept=".json"
        multiple
        variant="primary"
        buttonLabel={<Paragraph>Choose JSON files</Paragraph>}
      />
      <FileInputSizes
        variant="disabled"
        buttonLabel={<Paragraph>Upload unavailable</Paragraph>}
      />
    </Space>
  ),
};
