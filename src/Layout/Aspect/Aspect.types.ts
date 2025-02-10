import { CSSProperties, ReactNode } from "react";

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

export interface AspectProps {
	ratio?: AspectRatio; // Aspect ratio selection
	children?: ReactNode; // Content inside the aspect container
	className?: string; // Optional additional class names
	style?: CSSProperties; // Custom styles
}
