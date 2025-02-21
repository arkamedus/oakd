import { SpaceProps } from "../Space/Space.types";

export interface SpeechToTextProps extends SpaceProps {
	buttonText?: string;
	onChange?: (text: string) => void;
	placeholder?: string;
	title?: string;
}
