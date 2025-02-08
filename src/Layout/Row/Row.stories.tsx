import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Row from "./Row";
import Col from "../Column/Column";

export default {
    title: "Design System/Layout/Row",
    argTypes: {
        pastel: {
            control: "boolean",
            description: "Toggle pastel background colors",
            defaultValue: false,
        },
    },
} as Meta;

const Template: StoryFn<{ pastel: boolean, gap: boolean }> = ({ pastel, gap }) => (
    <Row className={pastel ? "pastel-container" : ""} gap={gap}>
        <Col xs={12}>Column 1</Col>
        <Col xs={12}>Column 2</Col>
    </Row>
);

export const Default = Template.bind({});
Default.args = { pastel: false, gap: false };

export const WithColumnsGap = Template.bind({});
WithColumnsGap.args = { pastel: true, gap: true };
