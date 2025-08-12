import { ImgHTMLAttributes } from "react";
import { CoreIconNameType } from "./Icons.bin";
import { CoreComponentSizeType } from "../Core/Core.types";

export interface IconProps extends ImgHTMLAttributes<HTMLImageElement> {
	name: CoreIconNameType;
	src?: string;
	size?: CoreComponentSizeType;
	spin?: boolean;
	rotation?: number;
	preserveColor?: boolean;
}
