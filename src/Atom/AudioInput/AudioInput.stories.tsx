import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import AudioInput from "./AudioInput";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Title from "../Title/Title";
import Card from "../Card/Card";

const meta: Meta<typeof AudioInput> = {
	title: "Design System/Atomic/AudioInput",
	component: AudioInput,
	argTypes: {
		onChange: { action: "changed" },
	},
};

export default meta;

type Story = StoryObj<typeof AudioInput>;

export const VoiceNoteComposer: Story = {
	args: {
		disabled: false,
	},
	render: (args) => (
		<Card pad wide style={{ maxWidth: 520 }}>
			<Space direction="vertical" gap>
				<Title>Attach a voice note</Title>
				<Paragraph>
					Record a short handoff for the next teammate before submitting the
					ticket.
				</Paragraph>
				<AudioInput {...args} />
			</Space>
		</Card>
	),
};

export const DisabledState: Story = {
	args: {
		disabled: true,
	},
	render: (args) => (
		<Card pad wide style={{ maxWidth: 520 }}>
			<Space direction="vertical" gap>
				<Title>Voice notes unavailable</Title>
				<Paragraph>
					Recording is disabled while microphone permissions are still pending.
				</Paragraph>
				<AudioInput {...args} />
			</Space>
		</Card>
	),
};
