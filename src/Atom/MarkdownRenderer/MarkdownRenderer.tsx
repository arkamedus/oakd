import React from "react";
import Icon from "../../Icon/Icon";
import { CoreIconNameType } from "../../Icon/Icons.bin";
import Paragraph from "../Paragraph/Paragraph";
import Title from "../Title/Title";
import Space from "../Space/Space";
import CodeArea from "../CodeArea/CodeArea";
import "./MarkdownRenderer.css";
import { MarkdownRendererProps } from "./MarkdownRenderer.types";

type SegmentMode = "normal" | "think";

interface Segment {
	mode: SegmentMode;
	text: string;
}

const SPECIAL_TOKEN_REGEX = /(<\|THINK\|>|<\|SEP\|>|<\|ASSISTANT\|>)/g;
const EMOTE_ICON_MAP: Record<string, CoreIconNameType> = {
	"=)": "EmoteSmile",
	"=3": "EmoteCat",
	"=D": "EmoteGrin",
	"=\\": "EmoteMeh",
	"D=": "EmoteShock",
	"=S": "EmoteS",
	XD: "EmoteLaugh",
	"=(": "EmoteFrown",
	">=(": "EmoteAngry",
};
const INLINE_REGEX =
	/!\[([^\]]*)\]\(([^)]+)\)|\[icon:([A-Za-z0-9]+)\]|\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|__([^_]+)__|_([^_]+)_|(=\)|=3|=D|=\\|D=|=S|XD|=\(|>=\()/g;

const parseSegments = (raw: string): Segment[] => {
	const parts = raw.split(SPECIAL_TOKEN_REGEX);
	const segments: Segment[] = [];
	let currentMode: SegmentMode = "normal";

	parts.forEach((part) => {
		if (!part) {
			return;
		}

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

const hasRemainingRenderableContent = (lines: string[], startIndex: number) => {
	for (let index = startIndex; index < lines.length; index += 1) {
		if (lines[index].trim()) {
			return true;
		}
	}

	return false;
};

const parseInline = (
	text: string,
	keyPrefix: string,
	appendSpinner = false,
): React.ReactNode[] => {
	const nodes: React.ReactNode[] = [];
	let lastIndex = 0;
	let match: RegExpExecArray | null;

	INLINE_REGEX.lastIndex = 0;

	while ((match = INLINE_REGEX.exec(text)) !== null) {
		if (match.index > lastIndex) {
			nodes.push(text.slice(lastIndex, match.index));
		}

		if (match[1] !== undefined) {
			nodes.push(
				<img
					key={`${keyPrefix}-${match.index}`}
					src={match[2]}
					alt={match[1]}
				/>,
			);
		} else if (match[3] !== undefined) {
			nodes.push(
				<Icon
					key={`${keyPrefix}-${match.index}`}
					name={match[3] as CoreIconNameType}
					size="small"
				/>,
			);
		} else if (match[4] !== undefined) {
			nodes.push(
				<a key={`${keyPrefix}-${match.index}`} href={match[5]}>
					{match[4]}
				</a>,
			);
		} else if (match[6] !== undefined) {
			nodes.push(<code key={`${keyPrefix}-${match.index}`}>{match[6]}</code>);
		} else if (match[7] !== undefined) {
			nodes.push(
				<strong key={`${keyPrefix}-${match.index}`}>{match[7]}</strong>,
			);
		} else if (match[8] !== undefined) {
			nodes.push(<em key={`${keyPrefix}-${match.index}`}>{match[8]}</em>);
		} else if (match[9] !== undefined) {
			nodes.push(<em key={`${keyPrefix}-${match.index}`}>{match[9]}</em>);
		} else if (match[10] !== undefined) {
			const iconName = EMOTE_ICON_MAP[match[10]];
			if (iconName) {
				nodes.push(
					<Icon
						key={`${keyPrefix}-${match.index}`}
						name={iconName}
						size="small"
					/>,
				);
			}
		}

		lastIndex = INLINE_REGEX.lastIndex;
	}

	if (lastIndex < text.length) {
		nodes.push(text.slice(lastIndex));
	}

	if (appendSpinner) {
		nodes.push(
			<Icon key={`${keyPrefix}-spinner`} name="Spinner" size="small" spin />,
		);
	}

	return nodes;
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
	markdown,
	content,
	isRendering = false,
	className = "",
	style,
}) => {
	const source = (markdown ?? content ?? "").replace(/\r\n/g, "\n");
	const segments = parseSegments(source);
	const blocks: React.ReactNode[] = [];

	const wrapBlock = (
		node: React.ReactNode,
		mode: SegmentMode,
		key: string,
		variant: "block" | "quote" = "block",
	) => {
		if (variant === "quote") {
			return (
				<blockquote key={key} className="oakd-markdown-renderer__quote">
					{node}
				</blockquote>
			);
		}

		if (mode === "think") {
			return (
				<div key={key} className="oakd-markdown-renderer__think">
					{node}
				</div>
			);
		}

		return <React.Fragment key={key}>{node}</React.Fragment>;
	};

	const renderSegment = (
		segment: Segment,
		segmentIndex: number,
		appendSpinner: boolean,
	) => {
		const lines = segment.text.split("\n");
		let index = 0;
		let appendedSpinner = false;

		const claimSpinner = (nextIndex: number) => {
			if (!appendSpinner || appendedSpinner) {
				return false;
			}
			if (hasRemainingRenderableContent(lines, nextIndex)) {
				return false;
			}
			appendedSpinner = true;
			return true;
		};

		while (index < lines.length) {
			const line = lines[index];
			const trimmed = line.trim();

			if (!trimmed) {
				index++;
				continue;
			}

			if (trimmed.startsWith("```")) {
				const codeLines: string[] = [];
				index++;
				while (index < lines.length && !lines[index].trim().startsWith("```")) {
					codeLines.push(lines[index]);
					index++;
				}
				index++;
				const key = `code-${segmentIndex}-${index}`;
				blocks.push(
					wrapBlock(
						<CodeArea value={codeLines.join("\n")} readOnly lineNumbers grow />,
						segment.mode,
						key,
					),
				);
				continue;
			}

			if (/^#{1,6}\s/.test(trimmed)) {
				const level = trimmed.match(/^#+/)?.[0].length || 1;
				const key = `heading-${segmentIndex}-${index}`;
				blocks.push(
					wrapBlock(
						<Title size={level === 1 ? "large" : "default"}>
							{parseInline(
								trimmed.replace(/^#{1,6}\s*/, ""),
								key,
								claimSpinner(index + 1),
							)}
						</Title>,
						segment.mode,
						key,
					),
				);
				index++;
				continue;
			}

			if (/^(---|\*\*\*|___)$/.test(trimmed)) {
				const key = `hr-${segmentIndex}-${index}`;
				blocks.push(wrapBlock(<hr />, segment.mode, key));
				index++;
				continue;
			}

			if (/^>\s/.test(trimmed)) {
				const quoteLines: string[] = [];
				while (index < lines.length && /^>\s/.test(lines[index].trim())) {
					quoteLines.push(lines[index].trim().replace(/^>\s*/, ""));
					index++;
				}
				const key = `quote-${segmentIndex}-${index}`;
				blocks.push(
					wrapBlock(
						<Paragraph>
							{parseInline(quoteLines.join(" "), key, claimSpinner(index))}
						</Paragraph>,
						segment.mode,
						key,
						"quote",
					),
				);
				continue;
			}

			if (/^(-|\*|\+)\s/.test(trimmed)) {
				const listItems: Array<{ key: number; text: string }> = [];
				while (
					index < lines.length &&
					/^(-|\*|\+)\s/.test(lines[index].trim())
				) {
					const itemText = lines[index].trim().replace(/^(-|\*|\+)\s*/, "");
					listItems.push({ key: index, text: itemText });
					index++;
				}

				const key = `ul-${segmentIndex}-${index}`;
				const spinner = claimSpinner(index);
				const list = (
					<ul>
						{listItems.map((item, itemIndex) => (
							<li key={`ul-item-${segmentIndex}-${item.key}`}>
								<Paragraph>
									{parseInline(
										item.text,
										`ul-item-${segmentIndex}-${item.key}`,
										spinner && itemIndex === listItems.length - 1,
									)}
								</Paragraph>
							</li>
						))}
					</ul>
				);
				blocks.push(wrapBlock(list, segment.mode, key));
				continue;
			}

			if (/^\d+\.\s/.test(trimmed)) {
				const listItems: Array<{ key: number; text: string }> = [];
				while (index < lines.length && /^\d+\.\s/.test(lines[index].trim())) {
					const itemText = lines[index].trim().replace(/^\d+\.\s*/, "");
					listItems.push({ key: index, text: itemText });
					index++;
				}

				const key = `ol-${segmentIndex}-${index}`;
				const spinner = claimSpinner(index);
				const list = (
					<ol>
						{listItems.map((item, itemIndex) => (
							<li key={`ol-item-${segmentIndex}-${item.key}`}>
								<Paragraph>
									{parseInline(
										item.text,
										`ol-item-${segmentIndex}-${item.key}`,
										spinner && itemIndex === listItems.length - 1,
									)}
								</Paragraph>
							</li>
						))}
					</ol>
				);
				blocks.push(wrapBlock(list, segment.mode, key));
				continue;
			}

			const paragraphLines = [line];
			index++;
			while (index < lines.length && lines[index].trim()) {
				if (
					/^#{1,6}\s/.test(lines[index].trim()) ||
					/^(-|\*|\+)\s/.test(lines[index].trim()) ||
					/^\d+\.\s/.test(lines[index].trim()) ||
					/^>\s/.test(lines[index].trim()) ||
					/^(---|\*\*\*|___)$/.test(lines[index].trim()) ||
					lines[index].trim().startsWith("```")
				) {
					break;
				}
				paragraphLines.push(lines[index]);
				index++;
			}

			const key = `paragraph-${segmentIndex}-${index}`;
			blocks.push(
				wrapBlock(
					<Paragraph>
						{parseInline(paragraphLines.join(" "), key, claimSpinner(index))}
					</Paragraph>,
					segment.mode,
					key,
				),
			);
		}

		if (appendSpinner && !appendedSpinner) {
			blocks.push(
				wrapBlock(
					<Paragraph>
						<Icon name="Spinner" size="small" spin />
					</Paragraph>,
					segment.mode,
					`spinner-${segmentIndex}`,
				),
			);
		}
	};

	if (!segments.length && isRendering) {
		blocks.push(
			<Paragraph key="spinner-empty">
				<Icon name="Spinner" size="small" spin />
			</Paragraph>,
		);
	} else {
		segments.forEach((segment, index) => {
			renderSegment(
				segment,
				index,
				isRendering && index === segments.length - 1,
			);
		});
	}

	return (
		<div
			className={["oakd-markdown-renderer", className]
				.filter(Boolean)
				.join(" ")}
			style={style}
			data-testid="MarkdownRenderer"
		>
			<Space direction="vertical" gap>
				{blocks}
			</Space>
		</div>
	);
};

export default MarkdownRenderer;
