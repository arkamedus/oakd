import React from "react";
import { CardProps } from "./Card.types";
import "./Card.css";

const Card: React.FC<CardProps> = ({ children, className, pad }) => {
  const classNames = ["oakd", "card"];
  if (pad) {
    classNames.push("pad");
  }
  return (
    <div data-testid="Card" className={classNames.join(" ")}>
      {children}
    </div>
  );
};

export default Card;
