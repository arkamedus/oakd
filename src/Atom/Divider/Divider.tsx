import React from "react";
import { DividerProps } from "./Divider.types";
import "./Divider.css";

const Divider: React.FC<DividerProps> = ({ orientation = "horizontal", className = "" }) => {
  const dividerClass = `oakd divider ${orientation} ${className}`.trim();
  return (
    <div
      data-testid="Divider"
      className={dividerClass}
      role="separator"
      aria-orientation={orientation}
    />
  );
};

export default Divider;
