import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import SpeechToText from "./SpeechToText";
import { SpeechToTextProps } from "./SpeechToText.types";

const meta: Meta<typeof SpeechToText> = {
	title: "Design System/Atomic/SpeechToText",
	component: SpeechToText,
	argTypes: {},
};

export default meta;

const Template: StoryFn<SpeechToTextProps> = (args) => (
	<SpeechToText {...args} />
);

export const Default = Template.bind({});
Default.args = {
	buttonText: "Start Speaking",
	placeholder: "Say something...",
	title: "Speech to Text",
};
