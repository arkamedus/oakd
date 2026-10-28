import React from "react";
import type Icon from "../../Icon/Icon";
import type { IconProps } from "../../Icon/Icon.types";
import {
  ButtonType,
  CoreComponentSizeType,
  CoreLayoutProps,
} from "../../Core/Core.types";
export type DropdownDirection =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

export interface SelectOption<T> {
  element: React.ReactNode;
  label?: React.ReactNode;
  /** Oakd Icon; use src and preserveColor for images. Its size is preserved in
   * the menu and adjusted to the Select size in the trigger. */
  thumbnail?: React.ReactElement<IconProps, typeof Icon>;
  searchText?: string;
  keywords?: string[];
  value: T;
  category?: string;
  disabled?: boolean;
}

export interface SelectProps<T> extends Omit<
  CoreLayoutProps<HTMLDivElement>,
  "defaultValue"
> {
  options: SelectOption<T>[];
  value?: T;
  defaultValue?: T;
  placeholder?: React.ReactNode;
  onChange?: (value: T, option: SelectOption<T>) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  getOptionKey?: (option: SelectOption<T>) => React.Key;
  variant?: ButtonType;
  size?: Exclude<CoreComponentSizeType, "huge">;
  categoryOrder?: string[];
  fixed?: boolean;
  grow?: boolean;
  direction?: DropdownDirection;
  disabled?: boolean;
  placementThreshold?: number;
  wide?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  emptyContent?: React.ReactNode;
}
