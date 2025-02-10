import React from "react";
import { Meta } from "@storybook/react";
import Divider from "./Divider";

const meta: Meta<typeof Divider> = {
  title: "Divider",
  component: Divider,
  argTypes: {
    /* ... */
  },
};
export default meta;

export const Default = () => <Divider />;

export const WithBaz = () => <Divider foo="baz" />;
