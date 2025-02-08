import React from "react";

import { SpaceProps } from "./Space.types";

import "./Space.css";

const Space: React.FC<SpaceProps> = ({ style, children, className, gap, direction, align, justify }) => {

    let classNames = ["space"];
    if (className) classNames.push(className);
    if (direction) classNames.push(`direction-${direction}`);
    if (align) classNames.push(`align-${align}`);
    if (justify) classNames.push(`justify-${justify}`);
    if (gap){classNames.push("gap")}

    return (<div data-testid="Space" style={style} className={classNames.join(" ")}>{children}</div>);

};

export default Space;

