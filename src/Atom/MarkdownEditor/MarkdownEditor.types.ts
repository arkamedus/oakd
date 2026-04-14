import React from "react";

export interface MarkdownEditorProps {
	value?: string;
	onChange?: (markdown: string) => void;
	preview?: boolean;
	onPreviewChange?: (preview: boolean) => void;
	className?: string;
	style?: React.CSSProperties;
}
