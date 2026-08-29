import React, { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ScrollArea from "./ScrollArea";
import { ScrollAreaHandle } from "./ScrollArea.types";
it("exposes scrolling and reports reaching the end", () => {
	const onReachEnd = jest.fn();
	const ref = createRef<ScrollAreaHandle>();
	render(
		<ScrollArea
			ref={ref}
			orientation="both"
			scrollbar="hidden"
			onReachEnd={onReachEnd}
		>
			Body
		</ScrollArea>,
	);
	const area = screen.getByText("Body");
	expect(area).toHaveClass(
		"oakd-scroll-area--both",
		"oakd-scroll-area--scrollbar-hidden",
	);
	fireEvent.scroll(area);
	expect(onReachEnd).toHaveBeenCalled();
	expect(ref.current?.element).toBe(area);
});
