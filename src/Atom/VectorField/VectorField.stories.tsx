import React, { useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import Space from "../Space/Space";
import VectorField from "./VectorField";
import { VectorFieldProps } from "./VectorField.types";

const ControlledVectorField = (args: VectorFieldProps) => {
  const [value, setValue] = useState(args.value);
  useEffect(() => setValue(args.value), [args.value]);

  return (
    <VectorField
      {...args}
      value={value}
      onChange={(next, axis) => {
        setValue(next);
        args.onChange?.(next, axis);
      }}
    />
  );
};

const meta: Meta<typeof VectorField> = {
  title: "Design System/Atomic/Inputs/VectorField",
  component: VectorField,
  args: {
    layout: "toolbar",
  },
  argTypes: {
    dimensions: { control: false },
    value: { control: false },
    layout: { control: "inline-radio", options: ["grid", "toolbar"] },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    showActions: { control: "boolean" },
    framed: { control: "boolean" },
    wide: { control: "boolean" },
    grow: { control: "boolean" },
  },
  render: (args) => (
    <Space direction="vertical" gap wide>
      <ControlledVectorField {...args} dimensions={2} value={{ x: 0, y: 1 }} />
      <ControlledVectorField
        {...args}
        dimensions={3}
        value={{ x: 0, y: 1, z: 2 }}
      />
      <ControlledVectorField
        {...args}
        dimensions={4}
        value={{ x: 0, y: 1, z: 2, w: 3 }}
      />
    </Space>
  ),
};
export default meta;
type Story = StoryObj<typeof VectorField>;

export const Default: Story = {};

export const Grid: Story = {
  args: { layout: "grid" },
};
