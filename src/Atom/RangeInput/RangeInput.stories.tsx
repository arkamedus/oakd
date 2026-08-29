import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import Space from "../Space/Space";
import RangeInput from "./RangeInput";
const meta: Meta<typeof RangeInput> = {
  title: "Design System/Atomic/Inputs/RangeInput",
  component: RangeInput,
};
export default meta;
type Story = StoryObj<typeof RangeInput>;
export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState(25);
      return (
        <Space direction="vertical" gap wide>
          <RangeInput
            min={0}
            max={1}
            step={0.05}
            defaultValue={0.5}
            showValue
          />
          <RangeInput
            min={0}
            max={100}
            value={value}
            onChange={setValue}
            showValue
          />
          <RangeInput
            min={10}
            max={20}
            defaultValue={15}
            disabled
            showValue={false}
          />
        </Space>
      );
    };
    return <Demo />;
  },
};
