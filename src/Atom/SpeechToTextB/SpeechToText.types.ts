import React from "react";
import { CoreComponentSizeType } from "../../Core/Core.types";

export interface SpeechToTextProps {
	buttonText?: string;
	listeningText?: string;
	onStartListening?: () => void;
	onInterimChange?: (text: string) => void;
	onChange?: (text: string) => void;
	disabled?: boolean;
	size?: Exclude<CoreComponentSizeType, "huge">;
	className?: string;
	style?: React.CSSProperties;
}
