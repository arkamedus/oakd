import React from "react";
import Button from "./Button";
import { Meta, StoryFn } from "@storybook/react";
import { ComponentSizeType } from "../../Core/Core.types";

export default {
    title: "Design System/Atomic/Button",
    argTypes: {
        size: {
            control: "select",
            options: ["default", "small", "large"], // Ensure it matches ComponentSizeType
            description: "Set the button size",
            defaultValue: "default",
        },
    },
} as Meta;

const Template: StoryFn<{ size: ComponentSizeType }> = ({ size }) => (
    <Button size={size}>
        button
    </Button>
);

export const Default = Template.bind({});
Default.args = { size: "default" };
