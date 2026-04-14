import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import MarkdownEditor from "./MarkdownEditor";

describe("MarkdownEditor Component", () => {
  it("renders markdown in the editor surface", () => {
    render(<MarkdownEditor value={"# Draft"} />);
    expect(screen.getByTestId("CodeAreaTextarea")).toHaveValue("# Draft");
  });

  it("toggles preview mode", () => {
    render(<MarkdownEditor value={"# Preview"} />);
    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    expect(
      screen.getByRole("heading", {
        name: "Preview",
      }),
    ).toBeInTheDocument();
  });

  it("inserts markdown syntax from the toolbar", () => {
    render(<MarkdownEditor value={"Text"} />);
    fireEvent.click(screen.getByRole("button", { name: "Bold" }));
    expect(screen.getByTestId("CodeAreaTextarea")).toHaveValue("**Text**");
  });
});
