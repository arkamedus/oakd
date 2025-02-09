import React from "react";
import {Meta, StoryObj} from "@storybook/react";
import Paragraph from "./Paragraph";

const meta: Meta<typeof Paragraph> = {
    title: "Design System/Atomic/Typography/Paragraph",
};
export default meta;
type Story = StoryObj<typeof Paragraph>;

export const Default:React.FC = () => <Paragraph>This is some text.</Paragraph>;

export const WithBaz:React.FC = () => <Paragraph />;
