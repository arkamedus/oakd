import {CoreLayoutProps} from "../../Core/Core.types";

export interface ColumnProps extends CoreLayoutProps {
    xs?: number; // Number of parts on extra small screens
    sm?: number; // Number of parts on small screens
    md?: number; // Number of parts on medium screens
    lg?: number; // Number of parts on large screens
    xl?: number; // Number of parts on extra large screens
    xls?: number; // Number of parts on extra large super screens
    onMouseEnter?:any; // TODO
}