import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import CodeArea from "./CodeArea";
import Content from "../../Layout/Content/Content";

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
    const lineControls = container.querySelectorAll(".codearea-gutter-line");
    expect(lineControls).toHaveLength(3);
    expect(Array.from(lineControls).map((line) => line.textContent)).toEqual([
      "1",
      "2",
      "3",
    ]);
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

    expect(
      container.querySelector(".codearea-linebg.is-current"),
    ).toBeInTheDocument();

    act(() => {
      fireEvent.blur(textarea);
    });

    expect(container.querySelector(".codearea-linebg.is-current")).toBeNull();
  });

  it("supports fill so the editor can occupy a bounded parent host", () => {
    const { container } = render(
      <Content style={{ height: "var(--oakd-surface-height-lg)" }}>
        <CodeArea fill defaultValue={"select *\nfrom workspace_sessions;"} />
      </Content>,
    );

    expect(screen.getByTestId("CodeArea")).toHaveClass("fill");
    expect(container.querySelector(".codearea-editor")).toBeInTheDocument();
    expect(screen.getByTestId("CodeAreaTextarea")).not.toHaveAttribute("style");
  });
});

 it("forwards namespaced editor overrides to the shared overlay host", () => {
  render(<CodeArea style={{ "--oakd-code-padding-x": "20px", "--oakd-code-line-height": "24px" } as React.CSSProperties} />);
  expect(screen.getByTestId("CodeArea").style.getPropertyValue("--oakd-code-padding-x")).toBe("20px");
  expect(screen.getByTestId("CodeArea").style.getPropertyValue("--oakd-code-line-height")).toBe("24px");
});

it("lets an empty rules array disable coloring even for a known language", () => {
  const { container } = render(<CodeArea language="javascript" rules={[]} value={'const status = "ready";'} />);
  expect(container.querySelector('.codearea-highlight [class^="tok-"]')).toBeNull();
});

it("forwards textarea attributes and composes selection, scroll, and Tab handlers", () => {
  const ref = React.createRef<HTMLTextAreaElement>();
  const select = jest.fn();
  const scroll = jest.fn();
  const key = jest.fn(event => event.preventDefault());
  render(<><label htmlFor="source">Source</label><CodeArea ref={ref} id="source" name="source" required rows={4} spellCheck autoComplete="on" autoCapitalize="sentences" autoCorrect="on" defaultValue="hello" onSelect={select} onScroll={scroll} onKeyDown={key} /></>);
  const input = screen.getByLabelText("Source");
  expect(ref.current).toBe(input);
  expect(input).toHaveAttribute("name", "source");
  expect(input).toHaveAttribute("rows", "4");
  expect(input).toHaveAttribute("spellcheck", "true");
  expect(input).toHaveAttribute("autocomplete", "on");
  expect(input).toHaveAttribute("autocapitalize", "sentences");
  expect(input).toHaveAttribute("autocorrect", "on");
  expect(input).toBeRequired();
  act(() => fireEvent.select(input));
  fireEvent.scroll(input);
  fireEvent.keyDown(input, { key: "Tab" });
  expect(select).toHaveBeenCalled();
  expect(scroll).toHaveBeenCalledTimes(1);
  expect(key).toHaveBeenCalledTimes(1);
  expect(input).toHaveValue("hello");
});
