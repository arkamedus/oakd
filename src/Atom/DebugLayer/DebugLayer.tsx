import React from "react";
import { DebugLayerProps } from "./DebugLayer.types";
import "./DebugLayer.css";
import Paragraph from "../Paragraph/Paragraph";
import { IconLayers } from "../../Icon/Icons.bin";

/**
 * DebugLayer Component
 * 
 * Provides a visual debug overlay with a dashed border and an optional label for debugging layouts.
 * Useful during development to inspect component boundaries and verify spacing.
 * 
 * @param {DebugLayerProps} props - Properties for the DebugLayer component
 * @returns {JSX.Element} Rendered DebugLayer component
 */
const DebugLayer: React.FC<DebugLayerProps> = ({ label, children, style, className = "" }) => {
  const classes = ["oakd", "debug-layer", className].filter(Boolean).join(" ");
  return (
    <span data-testid="DebugLayer" className={classes} style={style}>
      {label && (
        <Paragraph className="label">
          <IconLayers size="small" />
          {label}
        </Paragraph>
      )}
      {children}
    </span>
  );
};

export default DebugLayer;
