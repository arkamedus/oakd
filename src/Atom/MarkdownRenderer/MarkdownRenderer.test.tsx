import React from "react";
import { render, screen } from "@testing-library/react";
import MarkdownRenderer from "./MarkdownRenderer";

describe("MarkdownRenderer Component", () => {
  it("renders headings and inline formatting", () => {
    render(<MarkdownRenderer markdown={"# Hello\n\nThis is **bold** text."} />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("bold").tagName).toBe("STRONG");
  });

  it("renders code blocks through CodeArea", () => {
    render(<MarkdownRenderer markdown={"```\nconst answer = 42;\n```"} />);
    expect(screen.getByTestId("CodeAreaTextarea")).toHaveValue("const answer = 42;");
  });

  it("renders think sections, inline icons, and loader state", () => {
    render(
      <MarkdownRenderer
        content={"<|THINK|>Review [icon:Bulb]\n<|ASSISTANT|>Done =D"}
        isRendering
      />,
    );

    expect(screen.getByText("Review")).toBeInTheDocument();
    expect(screen.getAllByTestId("Icon").length).toBeGreaterThan(1);
  });

  it("attaches the loader to the last list item while rendering", () => {
    const { container } = render(
      <MarkdownRenderer
        content={"- First item\n- Second item"}
        isRendering
      />,
    );

    const listItems = container.querySelectorAll("li");
    expect(listItems).toHaveLength(2);
    expect(listItems[1].querySelector('[data-testid="Icon"]')).not.toBeNull();
  });

  it("attaches the loader to the final block in mixed streamed content", () => {
    const { container } = render(
      <MarkdownRenderer
        content={`<|THINK|>Streaming partial reasoning...
<|ASSISTANT|>Drafting the visible answer
- asd
- asd
whasd`}
        isRendering
      />,
    );

    const listItems = container.querySelectorAll("li");
    expect(listItems[1].querySelector('[data-testid="Icon"]')).toBeNull();
    const paragraphs = Array.from(container.querySelectorAll("p"));
    const lastParagraph = paragraphs[paragraphs.length - 1];
    expect(lastParagraph).toHaveTextContent("whasd");
    expect(lastParagraph.querySelector('[data-testid="Icon"]')).not.toBeNull();
  });
});

it.each(["", "text", "unknown"])("leaves %s fences uncolored", (language) => {
  const source = 'const status = "ready";\nconsole.log(status);';
  const { container } = render(<MarkdownRenderer markdown={'```' + language + '\n' + source + '\n```'} />);
  expect(screen.getByTestId("CodeAreaTextarea")).toHaveValue(source);
  expect(container.querySelector('.codearea-highlight [class^="tok-"]')).toBeNull();
});

it.each([
  ["javascript", "const status = true;", ".tok-keyword", "const"],
  ["js", "const status = true;", ".tok-keyword", "const"],
  ["typescript", "type Status = string;", ".tok-keyword", "type"],
  ["ts", "type Status = string;", ".tok-keyword", "type"],
  ["bash", 'echo "ready"', ".tok-builtin", "echo"],
  ["go", "package main", ".tok-keyword", "package"],
  ["fortran", "program status", ".tok-keyword", "program"],
  ["css", ".status { display: grid; }", ".tok-keyword", "display"],
  ["json", '{"status": "ready"}', ".tok-type", '"status"'],
])("uses %s fence rules", (language, source, selector, token) => {
  const { container } = render(<MarkdownRenderer markdown={'```' + language + '\n' + source + '\n```'} />);
  expect(container.querySelector(selector)).toHaveTextContent(token);
  expect(screen.getByTestId("CodeAreaTextarea")).toHaveValue(source);
});

it("uses the declared language even when the content resembles another language", () => {
  const { container } = render(<MarkdownRenderer markdown={'```json\nconst status = "ready";\nconsole.log(status);\n```'} />);
  expect(container.querySelector('.tok-keyword')).toBeNull();
  expect(container.querySelector('.tok-builtin')).toBeNull();
  expect(container.querySelector('.tok-string')).toHaveTextContent('"ready"');
});
