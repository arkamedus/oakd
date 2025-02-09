import React from "react";
import {Meta} from "@storybook/react";
import Column from "./Column";
import DebugLayer from "../../Atom/DebugLayer/DebugLayer";

const meta:Meta<typeof Column> = {
    title: "Design System/Layout/Column"
};
export default meta;

export const Default = () => <Column><DebugLayer/></Column>;
