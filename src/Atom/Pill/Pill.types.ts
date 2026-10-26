import React from "react";
import { ButtonType, CoreComponentSizeType } from "../../Core/Core.types";
import { CoreIconNameType } from "../../Icon/Icons.bin";

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: ButtonType;
	size?: Exclude<CoreComponentSizeType, "huge">;
	icon?: CoreIconNameType | React.ReactNode;
	wide?: boolean;
}
