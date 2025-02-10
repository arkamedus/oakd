import {
	ComponentAlignType,
	ComponentJustifyType,
	CoreComponentLayoutDirectionType,
	CoreLayoutProps,
} from "../../Core/Core.types";

export interface SpaceProps extends CoreLayoutProps {
	direction?: CoreComponentLayoutDirectionType;
	align?: ComponentAlignType;
	justify?: ComponentJustifyType;
	wide?: boolean;
}
