import { ImgHTMLAttributes } from "react";

export type CoreIconNameType =
  | "Angle"
  | "Apps"
  | "Arrow"
  | "Bar"
  | "Check"
  | "Circle"
  | "Clock"
  | "Comment"
  | "Diamond"
  | "Folder"
  | "List"
  | "Magnify"
  | "Octagon"
  | "PenPaper"
  | "Plus"
  | "Refresh"
  | "Share"
  | "Sliders"
  | "Square"
  | "Star"
  | "Text"
  | "Trash"
  | "Triangle"
  | "User"
  | "X";

export interface IconProps extends ImgHTMLAttributes<HTMLImageElement> {
  name: CoreIconNameType;
  size?: "default" | "small" | "large";
}
