import { ImgHTMLAttributes } from "react";
import {CoreIconNameType} from "./icons.generated";


export interface IconProps extends ImgHTMLAttributes<HTMLImageElement> {
  name: CoreIconNameType;
  size?: "default" | "small" | "large";
}
