import {
  CoreComponentSizeType,
  CoreComponentProps,
} from "../../Core/Core.types";
import { CSSProperties } from "react";
import {CoreIconNameType} from "../../Icon/Icon.types";

export type ButtonType =
  | "default"
  | "primary"
  | "danger"
  | "warning"
  | "ghost"
  | "disabled";

export interface ButtonProps extends CoreComponentProps {
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  buttonType?: "button" | "submit" | "reset";
  type?: ButtonType;
  size?: CoreComponentSizeType;
  style?: CSSProperties;
  className?: string;
  icon?: CoreIconNameType; // Optional icon
  disabled?: boolean;
  role?: string; // Accessibility role
  label?: string;
}
