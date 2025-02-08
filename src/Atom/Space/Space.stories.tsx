import React from "react";
import Space from "./Space";
import Paragraph from "../Paragraph/Paragraph";

export default {
    title: "Design System/Atomic/Space"
};

const card = <div style={{border: "1px solid #999"}}><h1>Card Title</h1><Paragraph>Card paragraph</Paragraph></div>

export const Default = () => <Space>{card}{card}</Space>;

export const Gap = () => <Space gap>{card}{card}</Space>;

export const Vertical = () => <Space direction={"vertical"} gap>{card}{card}</Space>;

export const Center = () => <Space align={"center"} justify={"center"}>{card}{card}</Space>;

export const SpaceBetween = () => <Space justify={"between"}>{card}{card}</Space>;

export const Stretch = () => <Space>{card}{card}</Space>;
