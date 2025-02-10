import React from "react";
import { DividerProps } from "./Divider.types";
import "./Divider.css";

const Divider: React.FC<DividerProps> = ({}) => (
  <div data-testid="Divider" className="oakd divider" />
);

export default Divider;
