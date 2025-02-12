import React from "react";
import {Meta, StoryFn, StoryObj} from "@storybook/react";
import Button, {ButtonGroup} from "./Button";
import Paragraph from "../Paragraph/Paragraph";
import {CoreIconNameType, IconFolder} from "../../Icon/Icons.bin";

const meta: Meta<typeof ButtonGroup> = {
	title: "Design System/Atomic/ButtonGroup",
	component: ButtonGroup,
	tags: ["!autodocs"],
	argTypes: {

	},
};
export default meta;


export const Default = () => (
	<ButtonGroup><Button icon={<IconFolder size="small"/>}>
		<Paragraph>bg 0</Paragraph>
	</Button><Button icon={<IconFolder size="small"/>} >
		<Paragraph>bg 1</Paragraph>
	</Button><Button icon={<IconFolder size="small"/>} >
		<Paragraph>bg 2</Paragraph>
	</Button></ButtonGroup>);

