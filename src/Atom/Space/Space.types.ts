import {
	ComponentAlignType,
	ComponentJustifyType,
	CoreComponentEventProps,
	CoreComponentLayoutDirectionType,
	CoreLayoutProps,
} from "../../Core/Core.types";

export interface SpaceProps
	extends
		CoreLayoutProps<HTMLSpanElement>,
		CoreComponentEventProps<HTMLSpanElement> {
	direction?: CoreComponentLayoutDirectionType;
	align?: ComponentAlignType;
	justify?: ComponentJustifyType;
	wide?: boolean;
	fill?: boolean;
	grow?: boolean;
	noWrap?: boolean;
}
