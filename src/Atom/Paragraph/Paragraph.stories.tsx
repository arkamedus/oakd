import React from "react";
import Paragraph from "./Paragraph";

export default {
    title: "Paragraph"
};

export const Default:React.FC = () => <Paragraph>This is some text.</Paragraph>;

export const WithBaz:React.FC = () => <Paragraph />;
