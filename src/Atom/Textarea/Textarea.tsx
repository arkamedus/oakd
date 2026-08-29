import React, { forwardRef } from "react";
import "./Textarea.css";
import { TextareaProps } from "./Textarea.types";
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	(
		{ wide, grow, error, className, "aria-invalid": ariaInvalid, ...rest },
		ref,
	) => (
		<textarea
			{...rest}
			ref={ref}
			aria-invalid={error || ariaInvalid || undefined}
			className={[
				"oakd",
				"standardized-reset",
				"standardized-text",
				"oakd-textarea",
				wide && "wide",
				grow && "grow",
				error && "oakd-textarea--error",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		/>
	),
);
Textarea.displayName = "Textarea";
export default Textarea;
