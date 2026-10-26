import React, { forwardRef } from "react";
import { ButtonProps } from "./Button.types";
import "./Button.css";
import Space from "../Space/Space";
import Icon from "../../Icon/Icon";
import { sizeMinusOne } from "../../Core/Core.utils";
import { CoreComponentLayoutDirectionType } from "../../Core/Core.types";
import { CoreIconNameType } from "../../Icon/Icons.bin";

/**
 * Button component
 *
 * @param {ButtonProps} props Component properties
 * @returns {JSX.Element} Rendered Button element
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      onClick,
      style,
      htmlType = "button",
      variant = "default",
      size = "default",
      className = "",
      icon,
      disabled,
      ...rest
    },
    ref,
  ) => {
    disabled = disabled || variant === "disabled";
    variant = disabled ? "disabled" : variant;
    const classNames = [
      "oakd",
      "standardized-reset",
      "standardized-text",
      "button",
      `type-${variant}`,
      `size-${size}`,
      disabled ? "disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    /**
     * Handles the click event. Prevents action if disabled.
     * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event
     */
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onClick?.(event);
    };

    return (
      <button
        {...rest}
        ref={ref}
        style={style}
        className={classNames}
        onClick={handleClick}
        type={htmlType}
        disabled={disabled}
        data-testid={rest["data-testid"] || "Button"}
      >
        <Space gap align="center" fill wide>
          {icon && typeof icon === "string" ? (
            <Icon name={icon as CoreIconNameType} size={sizeMinusOne(size)} />
          ) : (
            icon
          )}
          {children}
        </Space>
      </button>
    );
  },
);

export default Button;

interface ButtonGroupProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  direction?: CoreComponentLayoutDirectionType;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  direction = "horizontal",
  className = "",
  ...rest
}) => {
  return (
    <Space
      {...rest}
      className={`button_group ${direction} ${className}`.trim()}
      direction={direction}
    >
      {children}
    </Space>
  );
};
