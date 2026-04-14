import React from "react";

export interface ModalProps {
	visible: boolean;
	title: React.ReactNode;
	children?: React.ReactNode;
	onClose: () => void;
	className?: string;
	style?: React.CSSProperties;
	closeButtonLabel?: string;
}
