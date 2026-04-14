import { CoreComponentSizeType } from "../../Core/Core.types";

export interface PaginationProps {
	maxPage?: number;
	currentPage?: number;
	onPageChange?: (page: number) => void;
	size?: Exclude<CoreComponentSizeType, "huge">;
	showPreviousNext?: boolean;
	showNumbers?: boolean;
	showEllipsis?: boolean;
	disabled?: boolean;
	className?: string;
}
