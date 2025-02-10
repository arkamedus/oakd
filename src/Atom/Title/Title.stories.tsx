import React from "react";
import { Meta } from "@storybook/react";

import Title from "./Title";
import {IconFolder} from "../../Icon/icons.generated";

const meta: Meta<typeof Title> = {
  title: "Design System/Atomic/Typography/Title",
  component: Title,
  argTypes: {
    /* ... */
  },
};
export default meta;

export const Default = () => <Title>This is a Title.</Title>;
export const WithIcon = () => <Title>Title with an inline <IconFolder size={"large"} />.</Title>;
