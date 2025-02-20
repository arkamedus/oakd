import {
	ComponentAlignType,
	ComponentJustifyType, CoreComponentEventProps,
	CoreComponentLayoutDirectionType,
	CoreLayoutProps,
} from "../../Core/Core.types";

export interface SpaceProps extends CoreLayoutProps, CoreComponentEventProps {
	direction?: CoreComponentLayoutDirectionType;
	align?: ComponentAlignType;
	justify?: ComponentJustifyType;
	wide?: boolean;
	noWrap?:boolean;
}
