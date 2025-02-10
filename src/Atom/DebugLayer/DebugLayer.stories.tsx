import React from "react";
import { Meta } from "@storybook/react";

import DebugLayer from "./DebugLayer";

const meta: Meta<typeof DebugLayer> = {
  title: "Design System/Atomic/DebugLayer",
};
export default meta;

export const Default = () => <DebugLayer label="DebugLayer" />;
