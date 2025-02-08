import React from "react";
import Content from "./Content";

export default {
    title: "Content"
};

export const WithBar = () => <Content foo="bar" />;

export const WithBaz = () => <Content foo="baz" />;
