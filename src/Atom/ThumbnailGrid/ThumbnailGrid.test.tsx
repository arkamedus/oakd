import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ThumbnailGrid from "./ThumbnailGrid";
it("supports selection, disabled, loading, custom preview and empty states", () => {
	const change = jest.fn();
	const { rerender } = render(
		<ThumbnailGrid
			items={[
				{ id: 1, value: 1, title: "One" },
				{ id: 2, value: 2, title: "Two", disabled: true },
			]}
			value={1}
			onChange={change}
			renderPreview={() => "Preview"}
		/>,
	);
	expect(screen.getByRole("button", { name: /One/ })).toHaveAttribute(
		"aria-pressed",
		"true",
	);
	fireEvent.click(screen.getByRole("button", { name: /One/ }));
	expect(change).toHaveBeenCalled();
	expect(screen.getByRole("button", { name: /Two/ })).toBeDisabled();
	rerender(<ThumbnailGrid items={[]} empty="Empty" />);
	expect(screen.getByText("Empty")).toBeInTheDocument();
});
