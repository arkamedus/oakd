import React from "react";

import { DebugLayerProps } from "./DebugLayer.types";

import "./DebugLayer.css";

const DebugLayer: React.FC<DebugLayerProps> = ({ label, children, style, className }) => {
    return (<div data-testid="DebugLayer" className="debug-layer">{label&&<label className={"standardized-text"}>{label}</label>}{children}</div>)
};

export default DebugLayer;

