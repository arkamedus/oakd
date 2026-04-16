import { CoreLayoutProps } from "../../Core/Core.types";

export interface RowProps extends CoreLayoutProps<HTMLDivElement> {
	wide?: boolean;
	grow?: boolean;
	fill?: boolean;
}
