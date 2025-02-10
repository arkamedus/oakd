import React from "react";
import { TitleProps } from "./Title.types";
import "./Title.css";

const Title: React.FC<TitleProps> = ({ children }) => (
  <h1
    data-testid="Title"
    className="oakd standardized-reset standardized-text title"
  >
    {children}
  </h1>
);

export default Title;
