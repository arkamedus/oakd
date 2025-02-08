import {CSSProperties} from "react";

export interface CoreComponentProps {
    id?:string;
    key?: string;
    style?: CSSProperties;
    children?: React.ReactNode;
    className?: string;
}

export type ComponentSizeType = "default" | "small" | "large";
export type ComponentLayoutDirectionType = "default" | "horizontal" | "vertical";

export type ComponentAlignType = "default" | "center" | "start" | "end";
export type ComponentJustifyType = "default" | "center" | "start" | "end" | "stretch" | "around" | "between" | "evenly";

export interface CoreLayoutProps extends CoreComponentProps {
    gap?: number|boolean;
}