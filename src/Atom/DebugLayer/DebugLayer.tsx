import React from "react";

import { DebugLayerProps } from "./DebugLayer.types";

import "./DebugLayer.css";
import Paragraph from "../Paragraph/Paragraph";
import {IconLayers} from "../../Icon/icons.generated";

const DebugLayer: React.FC<DebugLayerProps> = ({
  label,
  children,
  style,
  className,
}) => {
  return (
    <div data-testid="DebugLayer" className="oakd debug-layer" style={style}>
      {label && <label><Paragraph><IconLayers size={"small"}/>{label}</Paragraph></label>}
      {children}
    </div>
  );
};

export default DebugLayer;
