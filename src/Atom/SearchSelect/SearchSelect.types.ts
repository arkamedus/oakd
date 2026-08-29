import React from "react";
import { CoreComponentSizeType } from "../../Core/Core.types";
export interface SearchSelectOption<T> {
  value: T;
  label: React.ReactNode;
  searchText?: string;
  category?: string;
  disabled?: boolean;
  render?: React.ReactNode;
}
export interface SearchSelectProps<T> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> {
  options: SearchSelectOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T, option: SearchSelectOption<T>) => void;
  placeholder?: React.ReactNode;
  searchPlaceholder?: string;
  emptyContent?: React.ReactNode;
  getOptionKey?: (option: SearchSelectOption<T>) => React.Key;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  wide?: boolean;
  size?: Exclude<CoreComponentSizeType, "huge">;
}
