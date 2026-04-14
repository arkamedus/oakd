import React from "react";
import {Meta} from "@storybook/react";
import MarkdownRenderer from "./MarkdownRenderer";

const meta: Meta<typeof MarkdownRenderer> = {
  title: "MarkdownRenderer",
  component: MarkdownRenderer,
  argTypes: { /* ... */ }
};
export default meta;

export const Default = () => (
  <MarkdownRenderer
    content={`<|THINK|>Okay… the user asked something complicated.  
I should probably reason through this step-by-step.

First I will consider **possible approaches** and __tradeoffs__.
Maybe I even insert a fake icon [icon:Bulb] or react like =D

Also links should work: [https://example.com](Example Site)

But none of this should appear in the final answer.
<|ASSISTANT|>
# The answer is simple...

Here is the final explanation.

You can have **bold text**, __italic text__, and inline icons like [icon:Star].

We also support links like [https://example.com](Open Example).

And of course the legacy emoticons:
=)  =3  =D  =\\  D=  =S  XD  =(  >=(

Multiple paragraphs should render properly.

Even when the renderer is still generating the rest of the answer`}
  />
);
export const WithLoader = () => <MarkdownRenderer content={"<|THINK|>I think"} isRendering={true} />;
export const WithLoaderInResponse = () => <MarkdownRenderer content={"<|THINK|>I think...<|ASSISTANT|>It's a very..."} isRendering={true} />;
