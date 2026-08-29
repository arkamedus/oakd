import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import Textarea from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Design System/Atomic/Inputs/Textarea",
  component: Textarea,
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: "Write a note",
    wide: true,
  },
};

export const Controlled: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState("Ready for review.");
      return (
        <Textarea
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          wide
        />
      );
    };

    return <Demo />;
  },
};
