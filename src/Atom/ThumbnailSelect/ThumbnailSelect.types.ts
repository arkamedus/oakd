import React from "react";
import { SearchSelectProps } from "../SearchSelect/SearchSelect.types";
export interface ThumbnailSelectOption<T> {
  value: T;
  title: React.ReactNode;
  note?: React.ReactNode;
  keywords?: string[];
  /**
   * Preview content shown in the trigger and option list. Use an oakd Icon for
   * a library icon, or Icon with `src` and `preserveColor` for an image source.
   * Component previews receive the trigger's oakd icon size; option previews
   * retain the size supplied by the consumer.
   */
  preview?: React.ReactNode;
  disabled?: boolean;
}
export interface ThumbnailSelectProps<T> extends Omit<
  SearchSelectProps<T>,
  "options" | "onChange"
> {
  options: ThumbnailSelectOption<T>[];
  onChange?: (value: T, option: ThumbnailSelectOption<T>) => void;
}
