import React from "react";
import { Meta } from "@storybook/react";
import Card from "./Card";
import Space from "../Space/Space";
import Title from "../Title/Title";
import Paragraph from "../Paragraph/Paragraph";
import DebugLayer from "../DebugLayer/DebugLayer";
import Button from "../Button/Button";
import Divider from "../Divider/Divider";

const meta: Meta<typeof Card> = {
  title: "Design System/Atomic/Card",
  component: Card,
  argTypes: {},
};
export default meta;

export const Default = () => (
  <Card>
    <DebugLayer label={"DebugLayer"} />
  </Card>
);

export const WithContent = () => (
  <Card>
    <Space direction="vertical" gap>
      <Title>Hello World!</Title>
      <Paragraph>Maybe some Lorem Ipsum text here.</Paragraph>
    </Space>
  </Card>
);

export const WithActions = () => (
  <Card>
    <Space direction="vertical" gap>
      <Title>Card with Actions</Title>
      <Paragraph>Some content inside the card.</Paragraph>
      <Divider />
      <Space justify="end" gap>
        <Button type="primary">Accept</Button>
        <Button type="danger">Decline</Button>
      </Space>
    </Space>
  </Card>
);

export const GridLayout = () => (
  <Space gap>
    <Card>
      <Title>Card 1</Title>
      <Paragraph>Content of card 1.</Paragraph>
    </Card>
    <Card>
      <Title>Card 2</Title>
      <Paragraph>Content of card 2.</Paragraph>
    </Card>
    <Card>
      <Title>Card 3</Title>
      <Paragraph>Content of card 3.</Paragraph>
    </Card>
  </Space>
);
