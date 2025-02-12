import {CoreLayoutProps} from "../../Core/Core.types";

export type AspectRatio =
	| "1x1"
	| "16x9"
	| "4x3"
	| "3x2"
	| "21x9"
	| "9x16"
	| "2x1"
	| "3x4"
	| "5x4"
	| "32x9"
	| "1x2";

export interface AspectProps extends CoreLayoutProps {
	ratio?: AspectRatio; // Aspect ratio selection
}
