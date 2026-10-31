import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import MarkdownEditor from "./MarkdownEditor";

describe("MarkdownEditor Component", () => {
  it("filters icons and inserts the chosen icon at the editor cursor", () => {
    const onChange = jest.fn();
    render(<MarkdownEditor value="Hello world" onChange={onChange} />);
    const editor = screen.getByTestId(
      "CodeAreaTextarea",
    ) as HTMLTextAreaElement;
    editor.setSelectionRange(6, 6);
    fireEvent.click(screen.getByRole("button", { name: "Icon" }));
    expect(screen.getByRole("separator")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Insert Folder icon" }),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: "Search icons" }), {
      target: { value: "cHeCk" },
    });
    expect(
      screen.queryByRole("button", { name: "Insert Folder icon" }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Insert Check icon" }));
    expect(editor).toHaveValue("Hello [icon:Check]world");
    expect(onChange).toHaveBeenCalledWith("Hello [icon:Check]world");
    expect(
      screen.getByRole("button", { name: "Icon" }),
    ).toHaveAttribute("aria-expanded", "false");
  });

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
    expect(screen.getByRole("button", { name: "Preview" })).toHaveClass(
      "type-active",
    );
  });

  it("inserts markdown syntax from the toolbar", () => {
    render(<MarkdownEditor value={"Text"} />);
    fireEvent.click(screen.getByRole("button", { name: "Bold" }));
    expect(screen.getByTestId("CodeAreaTextarea")).toHaveValue("**Text**");
  });
});
