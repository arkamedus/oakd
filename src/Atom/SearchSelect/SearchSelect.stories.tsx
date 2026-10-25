import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";
import Card from "../Card/Card";
import SearchSelect from "./SearchSelect";
const options = [
  {
    value: "alpha",
    label: <Paragraph>Alpha</Paragraph>,
    searchText: "Alpha",
    category: "Stable",
  },
  {
    value: "beta",
    label: <Paragraph>Beta</Paragraph>,
    searchText: "Beta",
    category: "Preview",
    render: (
      <Space justify="between" gap wide noWrap>
        <Paragraph>Beta</Paragraph>
        <Paragraph>Preview</Paragraph>
      </Space>
    ),
  },
  {
    value: "legacy",
    label: <Paragraph>Legacy</Paragraph>,
    searchText: "Legacy",
    disabled: true,
  },
];
const meta: Meta<typeof SearchSelect<string>> = {
  title: "Design System/Atomic/Inputs/SearchSelect",
  component: SearchSelect,
  argTypes: {
    size: {
      control: "select",
      options: ["small", "default", "large"],
      description: "Matches the Select trigger size contract",
    },
  },
};
export default meta;
type Story = StoryObj<typeof SearchSelect<string>>;
export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState("alpha");
      return (
        <Space direction="vertical" gap wide>
          <SearchSelect
            options={options}
            value={value}
            onChange={setValue}
            wide
            searchPlaceholder="Filter versions"
            emptyContent={<Paragraph>No versions match</Paragraph>}
          />
          <SearchSelect
            options={options}
            defaultValue="beta"
            placeholder={<Paragraph>Choose a release</Paragraph>}
          />
          <SearchSelect
            options={options}
            disabled
            placeholder={<Paragraph>Selection disabled</Paragraph>}
          />
        </Space>
      );
    };
    return <Demo />;
  },
};
export const Open: Story = {
  args: {
    options,
    open: true,
    onOpenChange: () => undefined,
    searchPlaceholder: "Search releases",
    emptyContent: <Paragraph>Nothing found</Paragraph>,
    wide: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <Space align="center" gap>
      <SearchSelect options={options} defaultValue="alpha" size="small" />
      <SearchSelect options={options} defaultValue="beta" size="default" />
      <SearchSelect
        options={options}
        placeholder={<Paragraph>Large searchable select</Paragraph>}
        size="large"
      />
    </Space>
  ),
};

export const SharedRadius: Story = {
  render: () => (
    <Card pad wide style={{ "--oakd-radius": "12px" } as React.CSSProperties}>
      <Space direction="vertical" gap wide>
        <Paragraph>The card, trigger, menu, and search input share a locally scoped radius.</Paragraph>
        <SearchSelect options={options} open wide />
      </Space>
    </Card>
  ),
};
