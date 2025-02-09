import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Button from "./Button";
import { ButtonType } from "./Button.types";
import {CoreComponentSizeType} from "../../Core/Core.types";

export default {
    title: "Design System/Atomic/Button",
    component: Button,
    argTypes: {
        type: {
            control: "select",
            options: ["default", "primary", "danger", "warning", "ghost", "disabled"],
            description: "Set the button type",
            defaultValue: "default",
        },
        size: {
            control: "select",
            options: ["default", "small", "large"],
            description: "Set the button size",
            defaultValue: "default",
        },
        disabled: {
            control: "boolean",
            description: "Disables the button",
        },
        onClick: { action: "clicked" }, // Storybook action
    },
} as Meta;

const Template: StoryFn<{ type: ButtonType; size: CoreComponentSizeType; disabled: boolean }> = (args) => (
    <Button {...args}>Click Me</Button>
);

export const Default = Template.bind({});
Default.args = { type: "default", size: "default", disabled: false };

export const Primary = Template.bind({});
Primary.args = { type: "primary" };

export const Danger = Template.bind({});
Danger.args = { type: "danger" };

export const Warning = Template.bind({});
Warning.args = { type: "warning" };

export const Ghost = Template.bind({});
Ghost.args = { type: "ghost" };

export const Disabled = Template.bind({});
Disabled.args = { type: "disabled", disabled: true };
