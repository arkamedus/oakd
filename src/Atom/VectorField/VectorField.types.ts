import React from "react";
import { CoreComponentSizeType } from "../../Core/Core.types";

export type VectorAxis = "x" | "y" | "z" | "w";

export interface VectorValue {
  x: number;
  y: number;
  z?: number;
  w?: number;
}

export interface VectorAxisOptions {
  min?: number;
  max?: number;
  step?: number;
  resetValue?: number;
  /** Native props and ref for this axis input. */
  inputProps?: Omit<React.ComponentPropsWithRef<"input">, "value" | "defaultValue" | "type" | "size" | "min" | "max" | "step">;
}

export interface VectorFieldProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange" | "onReset"
> {
  value: VectorValue;
  onChange: (value: VectorValue, axis: VectorAxis) => void;
  label?: React.ReactNode;
  dimensions?: 2 | 3 | 4;
  layout?: "grid" | "toolbar";
  /** Size of the base controls; dropdown content retains its existing sizes. */
  size?: Exclude<CoreComponentSizeType, "huge">;
  axisOptions?: Partial<Record<VectorAxis, VectorAxisOptions>>;
  onResetAxis?: (axis: VectorAxis) => void;
  onRandomizeAxis?: (axis: VectorAxis) => void;
  onReset?: (value: VectorValue) => void;
  onRandomize?: (value: VectorValue) => void;
  onApply?: (value: VectorValue) => void;
  disabled?: boolean;
  readOnly?: boolean;
  showActions?: boolean;
  wide?: boolean;
  grow?: boolean;
}
