import { ImgHTMLAttributes } from "react";
import { CoreIconNameType } from "./Icons.bin";
import { CoreComponentSizeType } from "../Core/Core.types";

export interface IconProps extends ImgHTMLAttributes<HTMLImageElement> {
	key?: string;
	name: CoreIconNameType;
	size?: CoreComponentSizeType;
}
