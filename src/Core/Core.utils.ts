import { CoreComponentSizeType } from "./Core.types";

const sizes: CoreComponentSizeType[] = ["small", "default", "large", "huge"];
export const sizeMinusOne = (size: CoreComponentSizeType) => {
	return sizes[sizes.indexOf(size) - 1] || sizes[0];
};
