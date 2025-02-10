import React from "react";
import {ButtonProps} from "./Button.types";
import "./Button.css";
import Space from "../Space/Space";

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           onClick,
                                           style,
                                           buttonType = "button",
                                           type = "default",
                                           size = "default",
                                           className = "",
                                           icon,
                                           disabled,
                                           role = "button", // Default role for accessibility
                                       }) => {
    const isDisabled = type === "disabled" || disabled;

    const classNames = [
        "standardized-reset",
        "standardized-text",
        "button",
        `type-${type}`,
        `size-${size}`,
        isDisabled ? "disabled" : "",
        className,
    ].join(" ").trim();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (isDisabled) return;
        if (onClick) onClick(event);
    };

    return (
        <button
            style={style}
            className={classNames}
            onClick={isDisabled ? undefined : handleClick}
            type={buttonType}
            disabled={isDisabled}
            role={role}
            data-testid="Button"
        >
            <Space gap>{icon}
                {children}</Space>
        </button>
    );
};

export default Button;
