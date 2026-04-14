import React from "react";
import { CoreComponentProps } from "../../Core/Core.types";

export interface PageProps extends CoreComponentProps<HTMLDivElement> {
	children: React.ReactNode;
	fixed?: boolean;
	fill?: boolean;
	gap?: boolean;
	className?: string;
}
