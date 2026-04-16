import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import CodeArea from "./CodeArea";

describe("CodeArea Component", () => {
  it("renders the provided source in the textarea", () => {
    render(<CodeArea defaultValue={"const answer = 42;"} />);
    expect(screen.getByTestId("CodeAreaTextarea")).toHaveValue(
      "const answer = 42;",
    );
  });

  it("shows a line-number gutter when enabled", () => {
    const { container } = render(
      <CodeArea defaultValue={"a\nb\nc"} lineNumbers />,
    );
    expect(container.querySelector(".codearea-gutter")).toBeInTheDocument();
    expect(container.querySelectorAll(".codearea-gutter-line")).toHaveLength(3);
  });

  it("notifies callers when the source changes", () => {
    const handleChange = jest.fn();
    render(
      <CodeArea defaultValue={"let count = 0;"} onChange={handleChange} />,
    );

    fireEvent.change(screen.getByTestId("CodeAreaTextarea"), {
      target: { value: "let count = 1;" },
    });

    expect(handleChange).toHaveBeenCalled();
    expect(screen.getByTestId("CodeAreaTextarea")).toHaveValue(
      "let count = 1;",
    );
  });

  it("clears current-line highlighting when focus leaves the editor", () => {
    const { container } = render(
      <CodeArea
        defaultValue={"first line\nsecond line"}
        highlightCurrentLine
        lineNumbers
      />,
    );

    const textarea = screen.getByTestId("CodeAreaTextarea");
    act(() => {
      fireEvent.focus(textarea);
      fireEvent.select(textarea, {
        target: { selectionStart: 11, selectionEnd: 11 },
      });
    });

    expect(container.querySelector(".codearea-linebg.is-current")).toBeInTheDocument();

    act(() => {
      fireEvent.blur(textarea);
    });

    expect(container.querySelector(".codearea-linebg.is-current")).toBeNull();
  });

  it("supports fill so the editor can occupy a bounded parent host", () => {
    const { container } = render(
      <div style={{ width: 720, height: 360, display: "flex" }}>
        <CodeArea
          fill
          defaultValue={"select *\nfrom workspace_sessions;"}
        />
      </div>,
    );

    expect(screen.getByTestId("CodeArea")).toHaveClass("fill");
    expect(container.querySelector(".codearea-editor")).toBeInTheDocument();
    expect(screen.getByTestId("CodeAreaTextarea")).not.toHaveAttribute("style");
  });
});
