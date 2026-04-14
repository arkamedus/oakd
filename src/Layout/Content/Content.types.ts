import { CoreContentProps, CorePaddingType } from "../../Core/Core.types";
import React from "react";

export interface ContentProps extends CoreContentProps<HTMLDivElement> {
	grow?: boolean;
}
