import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import Col from "../../Layout/Column/Column";
import Row from "../../Layout/Row/Row";
import Button from "../Button/Button";
import Paragraph from "../Paragraph/Paragraph";
import Pill from "../Pill/Pill";
import Space from "../Space/Space";
import Tooltip from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Design System/Atomic/Tooltip",
  component: Tooltip,
  argTypes: {
    interaction: { control: "inline-radio", options: ["hover", "click"] },
    direction: {
      control: "select",
      options: [
        "top",
        "right",
        "bottom",
        "left",
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
      ],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const HoverAndFocus: Story = {
  render: () => (
    <Space align="center" justify="center" fill wide>
      <Tooltip
        direction="top"
        defaultOpen
        content={
          <Space direction="vertical" gap>
            <Space align="center" gap>
              <Paragraph>
                <strong>Release channel</strong>
              </Paragraph>
              <Pill size="sm" variant="success">
                <Paragraph>Stable</Paragraph>
              </Pill>
            </Space>
            <Paragraph>
              Move between this popup and its trigger to keep it open.
            </Paragraph>
          </Space>
        }
      >
        <Button>
          <Paragraph>Hover or focus</Paragraph>
        </Button>
      </Tooltip>
    </Space>
  ),
};

export const Directions: Story = {
  render: () => (
    <Space align="center" justify="center" fill wide>
      <Row gap wide>
        {(
          [
            "top",
            "right",
            "bottom",
            "left",
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ] as const
        ).map((direction) => (
          <Col key={direction} xs={12} md={3}>
            <Space justify="center" wide>
              <Tooltip
                interaction="hover"
                direction={direction}
                content={<Paragraph>{direction}</Paragraph>}
              >
                <Button size="small">
                  <Paragraph>{direction}</Paragraph>
                </Button>
              </Tooltip>
            </Space>
          </Col>
        ))}
      </Row>
    </Space>
  ),
};

export const DeleteConfirmation: Story = {
  render: () => {
    const Demo = () => {
      const [open, setOpen] = useState(false);
      const [deleted, setDeleted] = useState(false);
      return (
        <Space direction="vertical" align="start" gap>
          <Tooltip
            interaction="click"
            direction="bottom-left"
            open={open}
            onOpenChange={setOpen}
            content={
              <Space direction="vertical" gap>
                <Paragraph>
                  <strong>Delete release?</strong>
                </Paragraph>
                <Paragraph>This action cannot be undone.</Paragraph>
                <Space justify="end" gap>
                  <Button size="small" onClick={() => setOpen(false)}>
                    <Paragraph>Cancel</Paragraph>
                  </Button>
                  <Button
                    size="small"
                    variant="danger"
                    onClick={() => {
                      setDeleted(true);
                      setOpen(false);
                    }}
                  >
                    <Paragraph>Delete</Paragraph>
                  </Button>
                </Space>
              </Space>
            }
          >
            <Button variant="danger">
              <Paragraph>Delete release</Paragraph>
            </Button>
          </Tooltip>
          {deleted ? <Pill variant="success">Release deleted</Pill> : null}
        </Space>
      );
    };
    return <Demo />;
  },
};
