import React from "react";
import {Meta, StoryFn, StoryObj} from "@storybook/react";
import Space from "./Space";
import Paragraph from "../Paragraph/Paragraph";
import Button from "../Button/Button";
import DebugLayer from "../DebugLayer/DebugLayer";

const meta:Meta<typeof Space> =  {
    title: "Design System/Atomic/Space",
    component: Space,
    argTypes: {
        gap: {
            control: "boolean",
            description: "Toggle gap between items",
        },
        direction: {
            control: { type: "select" },
            options: ["default", "horizontal", "vertical"],
            description: "Layout direction of the space",
        },
        align: {
            control: { type: "select" },
            options: ["default", "normal", "center", "start", "end"],
            description: "Alignment of items along the cross axis",
        },
        justify: {
            control: { type: "select" },
            options: [
                "default",
                "center",
                "start",
                "end",
                "stretch",
                "around",
                "between",
                "evenly",
            ],
            description: "Justification of items along the main axis",
        },
        onClick: { action: "clicked", table: { disable: true } }, // Example action (if needed)
    },
    args: {
        gap: false,
        direction: "default",
        align: "default",
        justify: "default",
    },
} as Meta<typeof Space>;
export default meta;
type Story = StoryObj<typeof Button>;


const card = (
    <div style={{ border: "1px solid #999", padding: "10px" }}>
        <h1>Card Title</h1>
        <Paragraph>Card paragraph</Paragraph>
    </div>
);

const Template: StoryFn<typeof Space> = (args) => (
    <Space {...args}>
        <DebugLayer label="DebugLayer" />
        {card}
    </Space>
);

export const Default = Template.bind({});
Default.args = {
    gap: false,
    direction: "default",
    align: "default",
    justify: "default",
};

export const Gap = Template.bind({});
Gap.args = {
    gap: true,
};

export const Vertical = Template.bind({});
Vertical.args = {
    gap: true,
    direction: "vertical",
};

export const Center = Template.bind({});
Center.args = {
    align: "center",
    justify: "center",
};

export const SpaceBetween = () => (
    <Space justify="between">
        <DebugLayer label="DebugLayer" />
        <DebugLayer label="DebugLayer" />
    </Space>
);

export const StretchGap = () => (
    <Space justify="stretch" gap>
        <DebugLayer label="DebugLayer" />
        <DebugLayer label="DebugLayer">
            <Paragraph>
                Content Here
                <br />
                To make it taller.
            </Paragraph>
        </DebugLayer>
    </Space>
);
