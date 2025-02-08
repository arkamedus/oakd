import React from "react";

import { ParagraphProps } from "./Paragraph.types";

import "./Paragraph.css";

const Paragraph: React.FC<ParagraphProps> = ({ style, children, className }) => {
    let classNames = ["paragraph","standardized-text"];
    if (className) classNames.push(className);

    return (<div data-testid="Paragraph" style={style} className={classNames.join(" ")}>{children}</div>);
};

export default Paragraph;

