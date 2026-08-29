import React from "react";
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	wide?: boolean;
	grow?: boolean;
	error?: boolean;
}
