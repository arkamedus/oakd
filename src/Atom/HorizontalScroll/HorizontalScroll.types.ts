import React from "react";
import {
	ComponentAlignType,
	CoreContentProps,
	CorePaddingType,
} from "../../Core/Core.types";

export interface HorizontalScrollProps extends CoreContentProps<HTMLDivElement> {
	children?: React.ReactNode;
	gap?: number | boolean;
	pad?: CorePaddingType;
	itemWidth?: number | string;
	align?: ComponentAlignType;
}
