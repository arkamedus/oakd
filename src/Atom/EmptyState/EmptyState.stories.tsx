import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Button from "../Button/Button";
import EmptyState from "./EmptyState";
import Icon from "../../Icon/Icon";
import Paragraph from "../Paragraph/Paragraph";
const meta: Meta<typeof EmptyState> = {
  title: "Design System/Atomic/EmptyState",
  component: EmptyState,
};
export default meta;
type Story = StoryObj<typeof EmptyState>;
export const Minimal: Story = {
  args: { title: <Paragraph>No results</Paragraph> },
};
export const DescriptiveWithActions: Story = {
  render: () => (
    <EmptyState
      icon={<Icon name="Folder" size="large" />}
      title={<Paragraph>No projects yet</Paragraph>}
      description={
        <Paragraph>
          Create a project or import an existing workspace to get started.
        </Paragraph>
      }
      actions={
        <>
          <Button>
            <Paragraph>Import</Paragraph>
          </Button>
          <Button variant="primary">
            <Paragraph>Create project</Paragraph>
          </Button>
        </>
      }
    />
  ),
};
