import React from "react";

import { ContentProps } from "./Content.types";

import "./Content.css";

const Content: React.FC<ContentProps> = ({ children, pad }) => {
  const classNames = ["oakd", "content"];
  if (pad) {
    classNames.push("pad");
  }
  return (
    <div data-testid="Content" className={classNames.join(" ")}>
      {children}
    </div>
  );
};

export default Content;
