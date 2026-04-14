import React from "react";
import { MarkdownRendererProps } from "./MarkdownRenderer.types";
import "./MarkdownRenderer.css";
import Title from "../Atom/Title/Title";
import Icon from "../Icon/Icon";
import Paragraph from "../Atom/Paragraph/Paragraph";
import { CoreComponentSizeType } from "../Core/Core.types";
import { CoreIconNameType } from "../Icon/Icons.bin";

interface IconProps {
  size: CoreComponentSizeType;
}

const iconProps: IconProps = {
  size: "small",
};

type SegmentMode = "normal" | "think";

interface Segment {
  mode: SegmentMode;
  text: string;
}

const SPECIAL_TOKEN_REGEX = /(<\|THINK\|>|<\|SEP\|>|<\|ASSISTANT\|>)/g;

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isRendering }) => {

  // replace tokenizeInline with this
  const tokenizeInline = (text: string, lineIndex: number, appendSpinner = false) => {
    const tokens = text.split(
      /(\*\*.*?\*\*|__.*?__|\[icon:[A-Za-z0-9]+\]|\[.+?\]\(.+?\)|=\)|=3|=D|=\\|D=|=S|XD|=\(|>=\()/g
    );

    const currentParts: React.ReactNode[] = [];

    tokens.forEach((token, tokenIndex) => {
      if (!token) return;

      const boldMatch = token.match(/^\*\*(.*?)\*\*$/);
      if (boldMatch) {
        currentParts.push(
          <strong key={`bold-${lineIndex}-${tokenIndex}`}>{boldMatch[1]}</strong>
        );
        return;
      }

      const italicMatch = token.match(/^__(.*?)__$/);
      if (italicMatch) {
        currentParts.push(
          <em key={`italic-${lineIndex}-${tokenIndex}`}>{italicMatch[1]}</em>
        );
        return;
      }

      const iconMatch = token.match(/^\[icon:([A-Za-z0-9]+)\]$/);
      if (iconMatch) {
        currentParts.push(
          <Icon
            key={`icon-${lineIndex}-${tokenIndex}`}
            name={iconMatch[1] as CoreIconNameType}
            {...iconProps}
          />
        );
        return;
      }

      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        currentParts.push(
          <a key={`link-${lineIndex}-${tokenIndex}`} href={linkMatch[1]}>
            {linkMatch[2]}
          </a>
        );
        return;
      }

      switch (token) {
        case "=)":
          currentParts.push(<Icon key={`emote-${lineIndex}-${tokenIndex}`} name="EmoteSmile" {...iconProps} />);
          break;
        case "=3":
          currentParts.push(<Icon key={`emote-${lineIndex}-${tokenIndex}`} name="EmoteCat" {...iconProps} />);
          break;
        case "=D":
          currentParts.push(<Icon key={`emote-${lineIndex}-${tokenIndex}`} name="EmoteGrin" {...iconProps} />);
          break;
        case "=\\":
          currentParts.push(<Icon key={`emote-${lineIndex}-${tokenIndex}`} name="EmoteMeh" {...iconProps} />);
          break;
        case "D=":
          currentParts.push(<Icon key={`emote-${lineIndex}-${tokenIndex}`} name="EmoteShock" {...iconProps} />);
          break;
        case "=S":
          currentParts.push(<Icon key={`emote-${lineIndex}-${tokenIndex}`} name="EmoteS" {...iconProps} />);
          break;
        case "XD":
          currentParts.push(<Icon key={`emote-${lineIndex}-${tokenIndex}`} name="EmoteLaugh" {...iconProps} />);
          break;
        case "=(":
          currentParts.push(<Icon key={`emote-${lineIndex}-${tokenIndex}`} name="EmoteFrown" {...iconProps} />);
          break;
        case ">=(":
          currentParts.push(<Icon key={`emote-${lineIndex}-${tokenIndex}`} name="EmoteAngry" {...iconProps} />);
          break;
        default:
          currentParts.push(token);
      }
    });

    if (appendSpinner) {
      currentParts.push(
        <Icon key={`spinner-${lineIndex}`} name="Spinner" {...iconProps} spin />
      );
    }

    return currentParts;
  };

  const parseSegments = (raw: string): Segment[] => {
    const parts = raw.split(SPECIAL_TOKEN_REGEX);
    const segments: Segment[] = [];

    let currentMode: SegmentMode = "normal";

    parts.forEach((part) => {
      if (!part) return;

      if (part === "<|THINK|>") {
        currentMode = "think";
        return;
      }

      if (part === "<|SEP|>" || part === "<|ASSISTANT|>") {
        currentMode = "normal";
        return;
      }

      segments.push({
        mode: currentMode,
        text: part,
      });
    });

    return segments;
  };

  // replace renderTextBlock with this
  const renderTextBlock = (
    text: string,
    mode: SegmentMode,
    segmentIndex: number,
    appendSpinner = false
  ): React.ReactNode[] => {
    const lines = text.split("\n");
    const rendered: React.ReactNode[] = [];
    let paragraphLines: string[] = [];
    let lastRenderableType: "title" | "paragraph" | null = null;

    const flushParagraph = (flushIndex: number, includeSpinner = false) => {
      if (!paragraphLines.length) return;

      const paragraphText = paragraphLines.join(" ").trim();
      paragraphLines = [];

      if (!paragraphText) return;

      const paragraph = (
        <Paragraph key={`paragraph-${mode}-${segmentIndex}-${flushIndex}`}>
          {tokenizeInline(paragraphText, flushIndex, includeSpinner)}
        </Paragraph>
      );

      if (mode === "think") {
        rendered.push(
          <blockquote key={`blockquote-${mode}-${segmentIndex}-${flushIndex}`}>
            {paragraph}
          </blockquote>
        );
      } else {
        rendered.push(paragraph);
      }

      lastRenderableType = "paragraph";
    };

    lines.forEach((line, lineIndex) => {
      const trimmed = line.trim();

      if (!trimmed) {
        flushParagraph(lineIndex);
        return;
      }

      if (trimmed.startsWith("# ")) {
        flushParagraph(lineIndex);

        const titleChildren: React.ReactNode[] = [trimmed.slice(2).trim()];

        if (appendSpinner && lineIndex === lines.length - 1) {
          titleChildren.push(
            <Icon key={`spinner-title-${mode}-${segmentIndex}-${lineIndex}`} name="Spinner" {...iconProps} spin />
          );
        }

        const titleNode = (
          <Title key={`title-${mode}-${segmentIndex}-${lineIndex}`}>
            {titleChildren}
          </Title>
        );

        if (mode === "think") {
          rendered.push(
            <blockquote key={`blockquote-title-${mode}-${segmentIndex}-${lineIndex}`}>
              {titleNode}
            </blockquote>
          );
        } else {
          rendered.push(titleNode);
        }

        lastRenderableType = "title";
        return;
      }

      paragraphLines.push(trimmed);
    });

    flushParagraph(lines.length, appendSpinner);

    if (appendSpinner && !lines.some((line) => line.trim()) && lastRenderableType === null) {
      const paragraph = (
        <Paragraph key={`paragraph-${mode}-${segmentIndex}-spinner-only`}>
          <Icon name="Spinner" {...iconProps} spin />
        </Paragraph>
      );

      if (mode === "think") {
        rendered.push(
          <blockquote key={`blockquote-${mode}-${segmentIndex}-spinner-only`}>
            {paragraph}
          </blockquote>
        );
      } else {
        rendered.push(paragraph);
      }
    }

    return rendered;
  };

  const renderLoadingNode = (mode: SegmentMode, key: string) => {
    const spinner = (
        <Icon name="Spinner" {...iconProps} spin/>

    );

    return mode === "think" ? (
      <blockquote key={`loading-blockquote-${key}`}>{spinner}</blockquote>
    ) : (
      spinner
    );
  };

  const renderContent = () => {
    const segments = parseSegments(content);

    if (!segments.length) {
      return isRendering
        ? [
          <Paragraph key="paragraph-empty-spinner">
            <Icon name="Spinner" {...iconProps} spin />
          </Paragraph>,
        ]
        : [];
    }

    return segments.flatMap((segment, segmentIndex) =>
      renderTextBlock(
        segment.text,
        segment.mode,
        segmentIndex,
        isRendering && segmentIndex === segments.length - 1
      )
    );
  };

  return (
    <div data-testid="MarkdownRenderer" className="oakd markdownrenderer">
      {renderContent()}
    </div>
  );
};

export default MarkdownRenderer;