import React from "react";
import Column from "./Column";
import Row from "../Row/Row";

export default {
    title: "Design System/Layout/Column"
};

export const Default = () => <Column/>;

export const Responsive = () => <Row gap><Column xs={24}>Column 1</Column>
    <Column xs={24} md={12}>Column 2</Column><Column xs={24} md={12}>Column 3</Column></Row>;
