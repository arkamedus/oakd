import React from "react";
import { CardProps } from "./Card.types";
import "./Card.css";

const Card: React.FC<CardProps> = ({ children, style, className, pad }) => {
  const classNames = ["oakd", "card"];
  if (pad) {classNames.push("pad");}
  if (className) {
    classNames.push(className);
  }
  return (
    <div data-testid="Card" className={classNames.join(" ")} style={style}>
      {children}
    </div>
  );
};

export default Card;
