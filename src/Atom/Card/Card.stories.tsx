import React from "react";
import { Meta } from "@storybook/react";
import Card from "./Card";
import Space from "../Space/Space";
import Title from "../Title/Title";
import Paragraph from "../Paragraph/Paragraph";
import DebugLayer from "../DebugLayer/DebugLayer";
import Button from "../Button/Button";
import Divider from "../Divider/Divider";
import Content from "../../Layout/Content/Content";

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
		<Content pad>
			<Space direction="vertical" gap>
				<Title>Hello World!</Title>
				<Paragraph>Maybe some Lorem Ipsum text here.</Paragraph>
			</Space>
		</Content>
	</Card>
);

export const WithContentActions = () => (
	<Card>
		<Content pad>
			<Space direction="vertical" gap>
				<Title>Card with Actions</Title>
				<Paragraph>Some content inside the card.</Paragraph>
				<Divider />
				<Space justify="end" gap wide>
					<Button icon="Check" type="primary">
						<Paragraph>Accept</Paragraph>
					</Button>
					<Button icon="X" type="danger">
						<Paragraph>Decline</Paragraph>
					</Button>
				</Space>
			</Space>
		</Content>
	</Card>
);

export const GridLayout = () => (
	<Space gap>
		<Card>
			<Content pad>
				<Title>Card 1</Title>
				<Paragraph>Content of card 1.</Paragraph>
			</Content>
		</Card>
		<Card type={"active"}>
			<Content pad>
				<Title>Card 2</Title>
				<Paragraph>Content of card 2.</Paragraph>
			</Content>
		</Card>
		<Card type={"primary"}>
			<Content pad>
				<Title>Card 2</Title>
				<Paragraph>Content of card 2.</Paragraph>
			</Content>
		</Card>
		<Card type={"ghost"}>
			<Content pad>
				<Title>Card 3</Title>
				<Paragraph>Content of card 3.</Paragraph>
			</Content>
		</Card>
		<Card type={"warning"}>
			<Content pad>
				<Title>Card 3</Title>
				<Paragraph>Content of card 3.</Paragraph>
			</Content>
		</Card>
		<Card type={"danger"}>
			<Content pad>
				<Title>Card 3</Title>
				<Paragraph>Content of card 3.</Paragraph>
			</Content>
		</Card>
		<Card type={"disabled"}>
			<Content pad>
				<Title>Card 3</Title>
				<Paragraph>Content of card 3.</Paragraph>
			</Content>
		</Card>
	</Space>
);
