import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Input from "./Input";
import { InputProps } from "./Input.types";
import Space from "../Space/Space";
import { IconMagnify } from "../../Icon/Icons.bin";
import Button from "../Button/Button";
import Paragraph from "../Paragraph/Paragraph";

const meta: Meta<typeof Input> = {
  title: "Design System/Atomic/Inputs/Input",
  component: Input,
  tags: ["!autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "password", "email", "number"],
      description: "Set the input type",
      defaultValue: "text",
    },
    size: {
      control: "select",
      options: ["small", "default", "large"],
      description: "Set the input size",
      defaultValue: "default",
    },
    disabled: {
      control: "boolean",
      description: "Disables the input",
    },
    error: {
      control: "boolean",
      description: "Displays an error state",
    },
    onChange: {
      action: "changed",
      description: "Called when the input value changes",
      table: { category: "Events" },
    },
    onFocus: {
      action: "focused",
      description: "Called when the input receives focus",
      table: { category: "Events" },
    },
    onBlur: {
      action: "blurred",
      description: "Called when the input loses focus",
      table: { category: "Events" },
    },
    onKeyDown: {
      action: "keyDown",
      description: "Called when a key is pressed down while focused",
      table: { category: "Events" },
    },
    onKeyUp: {
      action: "keyUp",
      description: "Called when a key is released while focused",
      table: { category: "Events" },
    },
    onKeyPress: {
      action: "keyPress",
      description: "Legacy keypress handler supported for compatibility",
      table: { category: "Events" },
    },
  },
};

export default meta;

const sizes = ["small", "default", "large"] as const;

export const Default: StoryFn<InputProps> = (args) => (
  <Space direction="vertical" gap>
    {sizes.map(size => (
      <Space key={size} direction="vertical" gap>
        <Space gap>
          <Input {...args} size={size} type="text" placeholder="Enter text..." />
          <Input {...args} size={size} type="password" placeholder="Enter password..." />
          <Input {...args} size={size} type="email" placeholder="Enter email..." />
          <Input {...args} size={size} type="number" placeholder="Enter number..." />
          <Input {...args} size={size} icon={<IconMagnify size="small" />} placeholder="Search..." />
          <Input {...args} size={size} error icon="Text" placeholder="Invalid input" />
          <Input {...args} size={size} disabled icon="Folder" placeholder="Disabled input" />
        </Space>
      </Space>
    ))}
  </Space>
);

export const RefFocusTest: StoryFn<InputProps> = (args) => {
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);


  return (
    <Space direction="vertical" gap>
      {sizes.map((size, index) => (
        <Space key={size} gap align="center">
          <Input {...args} size={size} ref={element => { inputRefs.current[index] = element; }} placeholder="Click the button to focus me..." />
          <Button size={size} onClick={() => inputRefs.current[index]?.focus()}><Paragraph>Focus Input</Paragraph></Button>
        </Space>
      ))}
    </Space>
  );
};

RefFocusTest.args = {
  type: "text",
  placeholder: "Ref test input",
};
