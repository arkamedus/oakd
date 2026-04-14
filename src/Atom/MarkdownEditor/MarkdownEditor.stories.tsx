import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import MarkdownEditor from "./MarkdownEditor";

const meta: Meta<typeof MarkdownEditor> = {
	title: "Design System/Atomic/MarkdownEditor",
	component: MarkdownEditor,
};

export default meta;

type Story = StoryObj<typeof MarkdownEditor>;

export const Default: Story = {
	args: {
		value: `# Draft update

Write your status update here.
`,
	},
};

export const WithPreviewEnabled: Story = {
	args: {
		value: `## Preview

- One item
- Another item

[icon:Check] Synced with the renderer.
`,
		preview: true,
	},
};

export const WithAssistantFormatting: Story = {
	args: {
		value: `<|THINK|># Internal Notes

Compare the draft outline [icon:Bulb] before publishing.

<|ASSISTANT|># Public Summary

- Add the latest timeline
- Keep the final callout concise
`,
	},
};
