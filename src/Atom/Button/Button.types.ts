import {CoreComponentSizeType, CoreComponentProps} from "../../Core/Core.types";
import {CSSProperties} from "react";

export type ButtonType = "default" | "primary" | "danger" | "warning" | "ghost" | "disabled";

export interface ButtonProps extends CoreComponentProps {
    children?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    buttonType?: "button" | "submit" | "reset";
    type?: ButtonType;
    size?: CoreComponentSizeType;
    style?: CSSProperties;
    className?: string;
    icon?: React.ReactNode; // Optional icon
    disabled?: boolean;
    role?: string; // Accessibility role
}
