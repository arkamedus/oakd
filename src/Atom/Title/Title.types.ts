import {
	CoreComponentProps,
	CoreComponentSizeType,
} from "../../Core/Core.types";

export interface TitleProps extends CoreComponentProps<HTMLHeadingElement> {
	size?: CoreComponentSizeType;
}
