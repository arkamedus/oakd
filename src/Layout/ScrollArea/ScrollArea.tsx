import React, {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useLayoutEffect,
	useRef,
} from "react";
import Content from "../Content/Content";
import "./ScrollArea.css";
import { ScrollAreaHandle, ScrollAreaProps } from "./ScrollArea.types";

const ScrollArea = forwardRef<ScrollAreaHandle, ScrollAreaProps>(
	(
		{
			orientation = "vertical",
			scrollbar = "native",
			stickToEnd = false,
			endThreshold = 8,
			onReachEnd,
			onScroll,
			children,
			className,
			...rest
		},
		ref,
	) => {
		const elementRef = useRef<HTMLDivElement>(null);
		const pinnedRef = useRef(stickToEnd);
		const isAtEnd = useCallback(() => {
			const element = elementRef.current;
			return (
				!element ||
				element.scrollHeight - element.scrollTop - element.clientHeight <=
					endThreshold
			);
		}, [endThreshold]);
		const scrollToEnd = useCallback((behavior: ScrollBehavior = "auto") => {
			const element = elementRef.current;
			if (element) element.scrollTo({ top: element.scrollHeight, behavior });
		}, []);
		useImperativeHandle(
			ref,
			() => ({
				element: elementRef.current,
				scrollTo: (options) => elementRef.current?.scrollTo(options),
				scrollToEnd,
			}),
			[scrollToEnd],
		);
		useLayoutEffect(() => {
			if (stickToEnd && pinnedRef.current) scrollToEnd();
		}, [children, scrollToEnd, stickToEnd]);
		return (
			<Content
				{...rest}
				ref={elementRef}
				className={[
					"oakd-scroll-area",
					`oakd-scroll-area--${orientation}`,
					`oakd-scroll-area--scrollbar-${scrollbar}`,
					className,
				]
					.filter(Boolean)
					.join(" ")}
				onScroll={(event) => {
					const atEnd = isAtEnd();
					pinnedRef.current = atEnd;
					if (atEnd) onReachEnd?.();
					onScroll?.(event);
				}}
			>
				{children}
			</Content>
		);
	},
);
ScrollArea.displayName = "ScrollArea";
export default ScrollArea;
