import React, { forwardRef } from "react";
import Paragraph from "../Paragraph/Paragraph";
import "../Button/Button.css";
import "./FileInput.css";
import { FileInputProps } from "./FileInput.types";
const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      buttonLabel = "Choose file",
      variant = "default",
      size = "default",
      disabled,
      className,
      ...rest
    },
    ref,
  ) => {
    disabled = disabled || variant === "disabled";
    variant = disabled ? "disabled" : variant;
    return (
      <label
        className={[
          "oakd",
          "standardized-reset",
          "standardized-text",
          "button",
          `type-${variant}`,
          `size-${size}`,
          disabled && "disabled",
          "oakd-file-input",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {typeof buttonLabel === "string" || typeof buttonLabel === "number" ? (
          <Paragraph>{buttonLabel}</Paragraph>
        ) : (
          buttonLabel
        )}
        <input
          {...rest}
          ref={ref}
          type="file"
          className="oakd-file-input__native"
          disabled={disabled}
        />
      </label>
    );
  },
);
FileInput.displayName = "FileInput";
export default FileInput;
