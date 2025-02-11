import React from "react";
import { ButtonType } from "../Button/Button.types";

export type CoreComponentSizeType = "default" | "small" | "large";

export interface SelectOption<T> {
  element: React.ReactNode;
  value: T;
  category?: string; // Optional category for grouping options
}

export interface SelectProps<T> {
  options: SelectOption<T>[];
  defaultValue?: T;
  placeholder?: React.ReactNode | string;
  onSelected: (value: T) => void;
  type?: ButtonType;
  size?: CoreComponentSizeType;
  categorize?: {
    property: string;
    order?: string[];
  };
}
