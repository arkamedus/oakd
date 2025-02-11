import { CoreContentProps } from "../../Core/Core.types";
import React from "react";

export interface ContentProps extends CoreContentProps {
	pad?: boolean | number;
	grow?: boolean;
}
