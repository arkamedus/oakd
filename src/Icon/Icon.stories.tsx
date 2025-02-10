import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Icon, { IconStack } from "./Icon";
import Space from "../Atom/Space/Space";
import { CoreIconNameType } from "./Icon.types";

const IconTypes: CoreIconNameType[] = [
  "Angle",
  "Apps",
  "Arrow",
  "Bar",
  "Check",
  "Circle",
  "Clock",
  "Comment",
  "Diamond",
  "Folder",
  "List",
  "Magnify",
  "Octagon",
  "PenPaper",
  "Plus",
  "Refresh",
  "Share",
  "Sliders",
  "Square",
  "Star",
  "Text",
  "Trash",
  "Triangle",
  "User",
  "X",
];

const meta: Meta<typeof Icon> = {
  title: "Design System/Icon",
  component: Icon,
  argTypes: {
    name: {
      control: "select",
      options: IconTypes,
      defaultValue: "Trash",
      description: "Select the icon",
    },
    size: {
      control: "select",
      options: ["default", "small", "large"],
      defaultValue: "default",
      description: "Select the icon size",
    },
  },
};
export default meta;

const Template: StoryFn<typeof Icon> = (args) => <Icon {...args} />;

export const Default = Template.bind({});
Default.args = { name: "Plus", size: "default", style: { color: "red" } };

export const Small = Template.bind({});
Small.args = { name: "Trash", size: "small" };

export const Large = Template.bind({});
Large.args = { name: "Trash", size: "large" };

export const AllIcons = () => (
  <Space gap>
    {IconTypes.map((icon: CoreIconNameType) => {
      return <Icon name={icon} size="default" />;
    })}
  </Space>
);

export const WithIconStack = () => (
    <Space direction="vertical" gap>
        {/* Simple stacks */}
        <Space gap>
            <IconStack>
                <Icon name="Circle" size="small" />
                <Icon name="Check" size="small" style={{ color: "green" }} />
            </IconStack>

            <IconStack>
                <Icon name="Square" size="small" />
                <Icon name="X" size="small" style={{ color: "red" }} />
            </IconStack>

            <IconStack>
                <Icon name="User" size="small" />
                <Icon name="X" size="small" style={{ color: "red" }} />
            </IconStack>
        </Space>

        {/* More complex stacks */}
        <Space gap>
            <IconStack>
                <Icon name="Square" size="large" />
                <Icon name="List" size="small" />
            </IconStack>

            <IconStack>
                <Icon name="Square" size="large" />
                <Icon name="Angle" size="small" style={{ color: "gray" }} />
            </IconStack>

            <IconStack>
                <Icon name="Folder" size="large" />
                <Icon name="Magnify" size="small" style={{ color: "blue" }} />
            </IconStack>

            <IconStack>
                <Icon name="Comment" size="large" />
                <Icon name="User" size="small" style={{ color: "orange" }} />
            </IconStack>

            <IconStack>
                <Icon name="Star" size="large" />
                <Icon name="Plus" size="small" style={{ color: "gold" }} />
            </IconStack>
        </Space>
    </Space>
);

