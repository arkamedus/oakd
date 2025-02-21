import React from "react";
import { CoreComponentProps } from "../../Core/Core.types";

export interface PageProps extends CoreComponentProps {
	children: React.ReactNode;
	fixed?: boolean;
	gap?: boolean;
	className?: string;
}
