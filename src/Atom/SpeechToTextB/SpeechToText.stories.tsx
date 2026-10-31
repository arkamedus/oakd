import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import SpeechToText from "./SpeechToText";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";
import Content from "../../Layout/Content/Content";
import Card from "../Card/Card";
import Input from "../Input/Input";
import Title from "../Title/Title";


const SpeechToTextSizes = (props: React.ComponentProps<typeof SpeechToText>) => (
  <Space direction="vertical" gap align="start">
    {(["small", "default", "large"] as const).map(size => (
      <SpeechToText {...props} key={size} size={size} />
    ))}
  </Space>
);

const meta: Meta<typeof SpeechToText> = {
  title: "Design System/Atomic/Inputs/SpeechToText",
  component: SpeechToText,
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof SpeechToText>;

export const Default: Story = {
  render: args => <SpeechToTextSizes {...args} />,
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
            <SpeechToTextSizes
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
            <Paragraph
              className={
                !finalTranscript && interimTranscript ? "muted" : undefined
              }
            >
              <strong>Transcript:</strong>{" "}
              {finalTranscript
                ? finalTranscript
                : interimTranscript
                  ? interimTranscript
                  : "No transcript captured yet."}
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
              <SpeechToTextSizes
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
