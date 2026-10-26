import React from "react";
import { CoreIconNameType } from "../../Icon/Icons.bin";
import { CoreComponentProps } from "../../Core/Core.types";

export interface BreadcrumbItem {
  text: React.ReactNode;
  href?: string;
  className?: string;
}

export type BreadcrumbSeparatorType = CoreIconNameType;

export interface BreadcrumbProps extends CoreComponentProps<HTMLElement> {
  items: BreadcrumbItem[];
  /** Any oakd icon name. Defaults to Angle. */
  separator?: BreadcrumbSeparatorType;
  className?: string;
}
