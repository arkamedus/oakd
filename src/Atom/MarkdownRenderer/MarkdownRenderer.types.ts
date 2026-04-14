import React from "react";

export interface MarkdownRendererProps {
	markdown?: string;
	content?: string;
	isRendering?: boolean;
	className?: string;
	style?: React.CSSProperties;
}
