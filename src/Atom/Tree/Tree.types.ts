import React from "react";
import { CoreContentProps } from "../../Core/Core.types";
import { CoreIconNameType } from "../../Icon/Icons.bin";

export interface TreeItem {
	id: string;
	label: React.ReactNode;
	children?: TreeItem[];
	icon?: CoreIconNameType | React.ReactNode;
	leaf?: React.ReactNode;
	expanded?: boolean;
	menuContent?: React.ReactNode;
}

export interface TreeProps extends CoreContentProps<HTMLDivElement> {
	items: TreeItem[];
	onChange?: (nextItems: TreeItem[]) => void;
}
