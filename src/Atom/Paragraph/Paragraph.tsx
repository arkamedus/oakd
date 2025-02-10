import React from "react";

import { ParagraphProps } from "./Paragraph.types";

import "./Paragraph.css";

const Paragraph: React.FC<ParagraphProps> = ({
  style,
  children,
  className,
}) => {
  let classNames = [
    "oakd",
    "standardized-reset",
    "standardized-text",
    "paragraph",
  ];
  if (className) classNames.push(className);

  return (
    <p data-testid="Paragraph" style={style} className={classNames.join(" ")}>
      {children}
    </p>
  );
};

export default Paragraph;
