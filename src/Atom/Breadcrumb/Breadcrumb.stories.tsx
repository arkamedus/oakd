import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Breadcrumb from "./Breadcrumb";
import { IconMagnify, _IconMap } from "../../Icon/Icons.bin";
import Paragraph from "../Paragraph/Paragraph";

const meta: Meta<typeof Breadcrumb> = {
  title: "Design System/Navigation/Breadcrumb",
  component: Breadcrumb,
  argTypes: {
    separator: {
      control: { type: "select" },
      options: Object.keys(_IconMap),
      description: "Any oakd icon name; defaults to Angle",
    },
    className: {
      control: { type: "text" },
      description: "Additional class name for the breadcrumb",
    },
  },
};

export default meta;

const Template: StoryFn<typeof Breadcrumb> = (args) => <Breadcrumb {...args} />;

export const Default = Template.bind({});
Default.args = {
  items: [
    { text: <Paragraph>Home</Paragraph>, href: "/" },
    { text: <Paragraph>Library</Paragraph>, href: "/library" },
    { text: <Paragraph>Data</Paragraph>, href: "/library/data" },
  ],
  separator: "Angle",
};

export const WithSlashSeparator = Template.bind({});
WithSlashSeparator.storyName = "With Play Separator";
WithSlashSeparator.args = {
  items: [
    { text: <Paragraph>Home</Paragraph>, href: "/" },
    { text: <Paragraph>Library</Paragraph>, href: "/library" },
    { text: <Paragraph>Data</Paragraph>, href: "/library/data" },
  ],
  separator: "Play",
};

export const WithBackslashSeparator = Template.bind({});
WithBackslashSeparator.storyName = "With Diamond Separator";
WithBackslashSeparator.args = {
  items: [
    { text: <Paragraph>Home</Paragraph>, href: "/" },
    { text: <Paragraph>Library</Paragraph>, href: "/library" },
    { text: <Paragraph>Data</Paragraph>, href: "/library/data" },
  ],
  separator: "Diamond",
};

export const CustomIconSeparator = Template.bind({});
CustomIconSeparator.args = {
  items: [
    { text: <IconMagnify size="small" />, href: "/" },
    { text: <Paragraph>Library</Paragraph>, href: "/library" },
    { text: <Paragraph>Data</Paragraph>, href: "/library/data" },
  ],
  separator: "Arrow",
};

export const CustomItems = () => (
  <Breadcrumb
    items={[
      { text: <IconMagnify />, href: "/" },
      { text: <Paragraph>Controller</Paragraph>, href: "/library" },
      { text: <Paragraph>View</Paragraph>, href: "/library/data" },
      { text: <Paragraph>Analytics</Paragraph>, href: "/library/analytics" },
    ]}
    separator="Angle"
  />
);

export const MixedContent = () => (
  <Breadcrumb
    items={[
      { text: <Paragraph>Home</Paragraph>, href: "/" },
      { text: <Paragraph>Library</Paragraph>, href: "/library" },
      {
        text: (
          <Paragraph>
            <strong>Data</strong>
          </Paragraph>
        ),
        href: "/library/data",
      },
      { text: <Paragraph>Reports</Paragraph> },
      { text: <Paragraph>Analytics</Paragraph>, href: "/library/analytics" },
    ]}
    separator="Angle"
  />
);
