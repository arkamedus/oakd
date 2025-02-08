import {
    ComponentAlignType,
    ComponentJustifyType,
    ComponentLayoutDirectionType,
    CoreLayoutProps
} from "../../Core/Core.types";

export interface SpaceProps extends CoreLayoutProps {
    direction?: ComponentLayoutDirectionType;
    align?: ComponentAlignType;
    justify?: ComponentJustifyType;
}
