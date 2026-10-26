import React from "react";
import { CoreComponentSizeType } from "../../Core/Core.types";

export type ModalSize = Exclude<CoreComponentSizeType, "huge"> | "viewport";

export interface ModalProps {
	open: boolean;
	title?: React.ReactNode;
	header?: React.ReactNode;
	footer?: React.ReactNode;
	children?: React.ReactNode;
	onClose: () => void;
	className?: string;
	style?: React.CSSProperties;
	closeButtonLabel?: string;
	size?: ModalSize;
	dismissible?: boolean;
	bodyScroll?: boolean;
	initialFocusRef?: React.RefObject<HTMLElement>;
}
