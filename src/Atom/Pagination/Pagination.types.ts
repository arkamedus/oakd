import { CoreComponentSizeType } from "../../Core/Core.types";

export interface PaginationProps {
	maxPage?: number;
	currentPage?: number;
	onPageChange?: (page: number) => void;
	size?: CoreComponentSizeType;
	showPreviousNext?: boolean;
	showNumbers?: boolean;
	showEllipsis?: boolean;
	disabled?: boolean;
}
