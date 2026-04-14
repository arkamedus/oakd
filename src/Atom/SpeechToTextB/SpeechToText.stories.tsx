import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import SpeechToText from "./SpeechToText";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";
import Content from "../../Layout/Content/Content";
import Card from "../Card/Card";
import Input from "../Input/Input";
import Title from "../Title/Title";

const meta: Meta<typeof SpeechToText> = {
	title: "Design System/Atomic/SpeechToText",
	component: SpeechToText,
	argTypes: {},
};

export default meta;

type Story = StoryObj<typeof SpeechToText>;

export const Default: Story = {
	args: {
		buttonText: "Start Speaking",
		listeningText: "Listening...",
	},
};

export const WithTranscriptPreview: Story = {
	render: () => {
		const [interimTranscript, setInterimTranscript] = useState("");
		const [finalTranscript, setFinalTranscript] = useState("");

		return (
			<Card wide>
				<Content pad>
					<Space direction="vertical" gap>
						<SpeechToText
							onStartListening={() => {
								setInterimTranscript("");
								setFinalTranscript("");
							}}
							onInterimChange={setInterimTranscript}
							onChange={(text) => {
								setInterimTranscript(text);
								setFinalTranscript(text);
							}}
						/>
						<Paragraph>
							<strong>Transcript:</strong>{" "}
							{finalTranscript ? (
								finalTranscript
							) : interimTranscript ? (
								<span className="muted">{interimTranscript}</span>
							) : (
								"No transcript captured yet."
							)}
						</Paragraph>
					</Space>
				</Content>
			</Card>
		);
	},
};

export const WithInputPopulation: Story = {
	render: () => {
		const [transcript, setTranscript] = useState("");

		return (
			<Card wide>
				<Content pad>
					<Space direction="vertical" gap>
						<Title>Record into a message field</Title>
						<Paragraph>
							Use speech capture to fill in a nearby input once the final
							transcript is returned.
						</Paragraph>
						<Space align="center" gap wide>
							<SpeechToText
								onStartListening={() => setTranscript("")}
								onChange={setTranscript}
							/>
							<Input
								value={transcript}
								placeholder="Recorded text will appear here"
								grow
								readOnly
							/>
						</Space>
					</Space>
				</Content>
			</Card>
		);
	},
};
