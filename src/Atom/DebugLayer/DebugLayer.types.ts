import { CoreContentProps } from "../../Core/Core.types";
import React from "react";

/**
 * Props for the DebugLayer component
 */
export interface DebugLayerProps extends CoreContentProps<HTMLDivElement> {
  /**
   * Optional label text to display on the debug overlay
   */
  label?: React.ReactNode;
  extra?: React.ReactNode;
}
