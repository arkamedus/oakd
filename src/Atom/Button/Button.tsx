import React from "react";

import {ButtonProps} from "./Button.types";

import "./Button.css";

const Button: React.FC<ButtonProps> = ({style, children, size}) => {
    const classNames = ["button","standardized-text"];
    if (size){classNames.push(`size-${size}`);}
    return (<button style={style} data-testid="Button" className={classNames.join(" ")}>{children}</button>)
};

export default Button;

