import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import Space from "../Space/Space";
import VectorField from "./VectorField";
import { VectorValue } from "./VectorField.types";

const meta: Meta<typeof VectorField> = {
  title: "Design System/Atomic/Inputs/VectorField",
  component: VectorField,
  argTypes: {
    dimensions: { control: "inline-radio", options: [2, 3] },
    layout: { control: "inline-radio", options: ["grid", "toolbar"] },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    showActions: { control: "boolean" },
    framed: { control: "boolean" },
    wide: { control: "boolean" },
    grow: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof VectorField>;

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [position, setPosition] = useState<VectorValue>({
        x: 0,
        y: 1,
        z: 2,
      });
      const [scale, setScale] = useState<VectorValue>({ x: 1, y: 1, z: 1 });
      return (
        <Space direction="vertical" gap wide>
          <VectorField
            label="Position"
            value={position}
            onChange={setPosition}
            dimensions={3}
            layout="grid"
            axisOptions={{
              x: { min: -10, max: 10, step: 0.5 },
              y: { min: 0, max: 20 },
              z: { min: -10, max: 10, step: 1 },
            }}
            onResetAxis={() => undefined}
            onRandomizeAxis={() => undefined}
            onReset={() => undefined}
            onRandomize={() => undefined}
            onApply={() => undefined}
          />
          <VectorField
            label="Scale"
            value={scale}
            onChange={setScale}
            layout="toolbar"
            axisOptions={{
              x: { min: 0, max: 8, step: 0.1, resetValue: 1 },
              y: { min: 0, max: 8, step: 0.1, resetValue: 1 },
              z: { min: 0, max: 8, step: 0.1, resetValue: 1 },
            }}
            onReset={() => undefined}
            onRandomize={() => undefined}
            onApply={() => undefined}
            framed
          />
        </Space>
      );
    };
    return <Demo />;
  },
};

export const States: Story = {
  render: () => {
    const Demo = () => {
      const [vector, setVector] = useState<VectorValue>({ x: 4, y: 8, z: 12 });
      return (
        <Space direction="vertical" gap wide>
          <VectorField
            label="Canvas size"
            value={vector}
            onChange={setVector}
            dimensions={2}
            layout="toolbar"
            showActions={false}
          />
          <VectorField
            label="Read-only bounds"
            value={vector}
            onChange={setVector}
            dimensions={2}
            readOnly
          />
          <VectorField
            label="Velocity"
            value={vector}
            onChange={setVector}
            layout="toolbar"
            disabled
            framed
            onReset={() => undefined}
          />
        </Space>
      );
    };
    return <Demo />;
  },
};
