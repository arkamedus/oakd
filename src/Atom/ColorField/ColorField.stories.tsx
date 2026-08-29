import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";
import ColorField from "./ColorField";
import { ColorFieldMode, ColorValue } from "./ColorField.types";

const meta: Meta<typeof ColorField> = {
  title: "Design System/Atomic/Inputs/ColorField",
  component: ColorField,
  argTypes: {
    mode: { control: "inline-radio", options: ["rgb", "hsv"] },
    alpha: { control: "boolean" },
    disabled: { control: "boolean" },
    wide: { control: "boolean" },
    grow: { control: "boolean" },
    eyeDropper: { control: "boolean" },
    randomize: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof ColorField>;

const skinColors: ColorValue[] = [
  { r: 0.96, g: 0.78, b: 0.66, a: 1 },
  { r: 0.55, g: 0.34, b: 0.23, a: 1 },
];

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [color, setColor] = useState<ColorValue>({
        r: 79 / 255,
        g: 128 / 255,
        b: 192 / 255,
        a: 0.8,
      });
      const [mode, setMode] = useState<ColorFieldMode>("rgb");
      return (
        <ColorField
          value={color}
          onChange={setColor}
          mode={mode}
          onModeChange={setMode}
          alpha
          wide={false}
          eyeDropper
          randomize
          defaultOpen
          presets={[
            {
              label: <Paragraph>Light</Paragraph>,
              value: skinColors[0],
            },
            {
              label: <Paragraph>Deep</Paragraph>,
              value: skinColors[1],
            },
          ]}
        />
      );
    };
    return <Demo />;
  },
};

export const Variations: Story = {
  render: () => {
    const Demo = () => {
      const [solid, setSolid] = useState<ColorValue>({
        r: 0.9,
        g: 0.3,
        b: 0.2,
      });
      const [alpha, setAlpha] = useState<ColorValue>({
        r: 0.2,
        g: 0.7,
        b: 0.5,
        a: 0.45,
      });
      return (
        <Space direction="vertical" gap wide>
          <ColorField value={solid} onChange={setSolid} wide />
          <ColorField
            value={alpha}
            onChange={setAlpha}
            defaultMode="hsv"
            alpha
            wide
          />
          <ColorField
            value={solid}
            onChange={setSolid}
            wide={false}
            randomize={false}
            eyeDropper={false}
          />
          <ColorField value={solid} onChange={setSolid} disabled wide />
        </Space>
      );
    };
    return <Demo />;
  },
};
