import React from "react";
import Content from "./Content";
import DebugLayer from "../../Atom/DebugLayer/DebugLayer";
import Paragraph from "../../Atom/Paragraph/Paragraph";

export default {
  title: "Content",
};

export const Default = () => (
  <Content>
    <DebugLayer label={"DebugLayer"} />
  </Content>
);

export const WithPadding = () => (
  <DebugLayer label={"DebugLayer"}>
    <Content>
      <Paragraph>Paragraph text.</Paragraph>
    </Content>
  </DebugLayer>
);
