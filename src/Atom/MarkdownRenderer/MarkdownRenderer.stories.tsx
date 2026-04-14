import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import MarkdownRenderer from "./MarkdownRenderer";

const meta: Meta<typeof MarkdownRenderer> = {
	title: "Design System/Atomic/MarkdownRenderer",
	component: MarkdownRenderer,
};

export default meta;

type Story = StoryObj<typeof MarkdownRenderer>;

export const Default: Story = {
	args: {
		markdown: `# Release Notes

This includes **bold text**, _emphasis_, and a [link](https://example.com).

- First item
- Second item

> Keep the preview aligned with oakd typography.
`,
	},
};

export const WithCodeBlock: Story = {
	args: {
		markdown: `## Example

\`\`\`
const status = "ready";
console.log(status);
\`\`\`
`,
	},
};

export const WithThinkAndIcons: Story = {
	args: {
		content: `<|THINK|># Working Notes

Checking the response shape [icon:Bulb] and validating edge cases =D

<|ASSISTANT|># Response

Use [icon:Check] when a task is done, and [icon:Refresh] while work is still moving.
`,
	},
};

export const WithLoader: Story = {
	args: {
		content: `<|THINK|>Streaming partial reasoning...
<|ASSISTANT|>Drafting the visible answer`,
		isRendering: true,
	},
};
