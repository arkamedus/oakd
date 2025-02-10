import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Icon, { IconStack } from "./Icon";
import Space from "../Atom/Space/Space";
import { CoreIconNameType } from "./Icon.types";
import {IconTypes} from "./Icons.bin";

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
Default.args = { name: "Trash", size: "default" };

export const Small = Template.bind({});
Small.args = { name: "Trash", size: "small" };

export const Large = Template.bind({});
Large.args = { name: "Trash", size: "large" };

export const Styled = Template.bind({});
Styled.args = { name: "Trash", size: "large", style: { color: "red" } };

export const GradientLinear = Template.bind({});
GradientLinear.args = {
    name: "Trash",
    size: "large",
    style: {
        background: "linear-gradient(to right, #ff7e5f, #feb47b)"
    },
    "data-gradient": true
};

export const GradientRadial = Template.bind({});
GradientRadial.args = {
    name: "Trash",
    size: "large",
    style: {
        background: "radial-gradient(circle, #ff758c, #007eb3)"
    },
    "data-gradient": true
};

export const Transparent = Template.bind({});
Transparent.args = {
    name: "Trash",
    size: "large",
    style: { opacity: 0.5 }
};


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

