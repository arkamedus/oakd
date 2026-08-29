import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import Icon from "../../Icon/Icon";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";
import ThumbnailSelect from "./ThumbnailSelect";

const imagePreview =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5NiA5NiI+PHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiByeD0iMTIiIGZpbGw9IiNkY2U5ZmYiLz48Y2lyY2xlIGN4PSI2OSIgY3k9IjI2IiByPSIxMSIgZmlsbD0iI2ZmYmQ1OSIvPjxwYXRoIGQ9Ik04IDc5IDM0IDQ4bDE3IDE4IDEyLTEzIDI1IDI2WiIgZmlsbD0iIzU2OGE2NyIvPjwvc3ZnPg==";

const options = [
  {
    value: "cube",
    title: <Paragraph>Cube</Paragraph>,
    note: <Paragraph>Six-sided primitive</Paragraph>,
    keywords: ["box", "block"],
    preview: <Icon name="Cube" />,
  },
  {
    value: "sphere",
    title: <Paragraph>Sphere</Paragraph>,
    note: <Paragraph>Smooth primitive</Paragraph>,
    keywords: ["ball", "round"],
    preview: <Icon name="Sphere" />,
  },
  {
    value: "locked",
    title: <Paragraph>Locked asset</Paragraph>,
    note: <Paragraph>Unavailable on this plan</Paragraph>,
    preview: <Icon name="Lock" />,
    disabled: true,
  },
];

const meta: Meta<typeof ThumbnailSelect<string>> = {
  title: "Design System/Atomic/Inputs/ThumbnailSelect",
  component: ThumbnailSelect,
  argTypes: {
    open: { control: "boolean" },
    disabled: { control: "boolean" },
    wide: { control: "boolean" },
    size: {
      control: "select",
      options: ["small", "default", "large"],
      description: "Matches the Select trigger size contract",
    },
  },
};
export default meta;
type Story = StoryObj<typeof ThumbnailSelect<string>>;

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState("cube");
      const [open, setOpen] = useState(false);
      return (
        <ThumbnailSelect
          options={options}
          value={value}
          onChange={setValue}
          open={open}
          onOpenChange={setOpen}
          placeholder={<Paragraph>Choose prefab</Paragraph>}
          emptyContent={<Paragraph>No prefab matches the search.</Paragraph>}
        />
      );
    };
    return <Demo />;
  },
};

export const States: Story = {
  render: () => (
    <Space direction="vertical" gap wide>
      <ThumbnailSelect
        options={options}
        defaultValue="sphere"
        wide
        placeholder={<Paragraph>Uncontrolled selection</Paragraph>}
      />
      <ThumbnailSelect
        options={options}
        wide={false}
        placeholder={<Paragraph>Fit-content trigger</Paragraph>}
      />
      <ThumbnailSelect
        options={options}
        disabled
        wide
        placeholder={<Paragraph>Selection disabled</Paragraph>}
      />
      <ThumbnailSelect
        options={[]}
        wide
        placeholder={<Paragraph>No available assets</Paragraph>}
        emptyContent={<Paragraph>No assets are available.</Paragraph>}
      />
    </Space>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Space align="center" gap>
      <ThumbnailSelect options={options} defaultValue="cube" size="small" />
      <ThumbnailSelect options={options} defaultValue="sphere" size="default" />
      <ThumbnailSelect options={options} defaultValue="locked" size="large" />
    </Space>
  ),
};

export const IconAndImagePreviews: Story = {
  render: () => (
    <Space direction="vertical" gap wide>
      <Paragraph>
        Preview accepts oakd content directly. Use Icon with a library name for
        an icon, or provide src and preserveColor when the source is an image.
      </Paragraph>
      <ThumbnailSelect
        defaultValue="image"
        options={[
          {
            value: "icon",
            title: <Paragraph>Library icon</Paragraph>,
            note: <Paragraph>Resolved from the oakd icon set</Paragraph>,
            preview: <Icon name="Cube" />,
          },
          {
            value: "image",
            title: <Paragraph>Image source</Paragraph>,
            note: (
              <Paragraph>Passed through Icon src with original color</Paragraph>
            ),
            preview: (
              <Icon
                name="Picture"
                src={imagePreview}
                preserveColor
                aria-label="Landscape thumbnail"
              />
            ),
          },
        ]}
        wide
      />
    </Space>
  ),
};
