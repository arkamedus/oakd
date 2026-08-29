import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Button from "../Button/Button";
import Icon from "../../Icon/Icon";
import Paragraph from "../Paragraph/Paragraph";
import ActionList, { ActionListItem } from "./ActionList";
const meta: Meta<typeof ActionList> = {
  title: "Design System/Atomic/ActionList",
  component: ActionList,
};
export default meta;
type Story = StoryObj<typeof ActionList>;
export const Default: Story = {
  render: () => (
    <ActionList divided>
      <ActionListItem
        leading={<Icon name="User" />}
        title={<Paragraph>Profile</Paragraph>}
        description={<Paragraph>Identity and public details</Paragraph>}
        trailing={
          <Button variant="ghost">
            <Paragraph>Open</Paragraph>
          </Button>
        }
        onClick={() => undefined}
      />
      <ActionListItem
        leading={<Icon name="Moon" />}
        title={<Paragraph>Dark mode</Paragraph>}
        trailing={<Icon name="Angle" size="small" />}
        onClick={() => undefined}
      />
      <ActionListItem
        title={<Paragraph>Managed setting</Paragraph>}
        description={<Paragraph>Controlled by your organization</Paragraph>}
        disabled
        onClick={() => undefined}
      />
    </ActionList>
  ),
};
export const StaticValues: Story = {
  args: {
    divided: false,
    children: (
      <>
        <ActionListItem
          title={<Paragraph>Region</Paragraph>}
          trailing={<Paragraph>Chicago</Paragraph>}
        />
        <ActionListItem
          title={<Paragraph>Plan</Paragraph>}
          trailing={<Paragraph>Pro</Paragraph>}
        />
      </>
    ),
  },
};

export const Selected: Story = {
  render: () => (
    <ActionList role="listbox" divided={false}>
      <ActionListItem
        role="option"
        aria-selected={false}
        leading={<Icon name="Note" size="small" />}
        title={<Paragraph>Draft</Paragraph>}
        onClick={() => undefined}
      />
      <ActionListItem
        role="option"
        aria-selected
        leading={<Icon name="Eye" size="small" />}
        title={<Paragraph>In review</Paragraph>}
        onClick={() => undefined}
      />
      <ActionListItem
        role="option"
        aria-selected={false}
        leading={<Icon name="Calendar" size="small" />}
        title={<Paragraph>Scheduled</Paragraph>}
        onClick={() => undefined}
      />
    </ActionList>
  ),
};
