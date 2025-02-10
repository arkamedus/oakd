import { ImgHTMLAttributes } from "react";
import { CoreIconNameType } from "./Icons.bin";

export interface IconProps extends ImgHTMLAttributes<HTMLImageElement> {
	name: CoreIconNameType;
	size?: "default" | "small" | "large";
}
