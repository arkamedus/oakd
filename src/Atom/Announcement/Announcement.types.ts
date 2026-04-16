import React from "react";
import { ButtonType, CoreContentProps } from "../../Core/Core.types";
import { CoreIconNameType } from "../../Icon/Icons.bin";

export interface AnnouncementProps extends CoreContentProps<HTMLDivElement> {
	variant?: ButtonType;
	closable?: boolean;
	onClose?: () => void;
	icon?: CoreIconNameType | React.ReactNode;
}
