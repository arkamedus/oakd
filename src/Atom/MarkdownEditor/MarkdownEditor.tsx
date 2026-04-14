import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "../Button/Button";
import { ButtonGroup } from "../Button/Button";
import CodeArea from "../CodeArea/CodeArea";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";
import MarkdownRenderer from "../MarkdownRenderer/MarkdownRenderer";
import "./MarkdownEditor.css";
import { MarkdownEditorProps } from "./MarkdownEditor.types";

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
	value,
	onChange,
	preview,
	onPreviewChange,
	className = "",
	style,
}) => {
	const [internalValue, setInternalValue] = useState(value ?? "");
	const [internalPreview, setInternalPreview] = useState(preview ?? false);
	const ref = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (value !== undefined) {
			setInternalValue(value);
		}
	}, [value]);

	const markdown = internalValue;
	const previewMode = preview !== undefined ? preview : internalPreview;

	const updateMarkdown = (next: string) => {
		setInternalValue(next);
		onChange?.(next);
	};

	const setPreviewMode = (next: boolean) => {
		if (preview === undefined) {
			setInternalPreview(next);
		}
		onPreviewChange?.(next);
	};

	const insertAtSelection = (
		before: string,
		after = "",
		fallbackToWholeValue = false,
	) => {
		const element = ref.current;
		if (!element) return;

		const selectionStart = element.selectionStart ?? 0;
		const selectionEnd = element.selectionEnd ?? 0;
		const hasSelection = selectionStart !== selectionEnd;
		const start = !hasSelection && fallbackToWholeValue ? 0 : selectionStart;
		const end =
			!hasSelection && fallbackToWholeValue ? markdown.length : selectionEnd;
		const selected = markdown.slice(start, end);
		const next =
			markdown.slice(0, start) +
			before +
			selected +
			after +
			markdown.slice(end);

		updateMarkdown(next);

		requestAnimationFrame(() => {
			element.focus();
			const cursorStart = start + before.length;
			const cursorEnd = cursorStart + selected.length;
			element.setSelectionRange(cursorStart, cursorEnd);
		});
	};

	const toolbar = useMemo(
		() => [
			{
				key: "bold",
				label: "Bold",
				onClick: () => insertAtSelection("**", "**", true),
			},
			{
				key: "italic",
				label: "Italic",
				onClick: () => insertAtSelection("_", "_", true),
			},
			{
				key: "heading",
				label: "Heading",
				onClick: () => insertAtSelection("\n# Heading\n"),
			},
			{
				key: "list",
				label: "List",
				onClick: () => insertAtSelection("\n- List item\n"),
			},
			{
				key: "code",
				label: "Code",
				onClick: () => insertAtSelection("\n```\ncode\n```\n"),
			},
			{
				key: "quote",
				label: "Quote",
				onClick: () => insertAtSelection("\n> Quote\n"),
			},
			{
				key: "image",
				label: "Image",
				onClick: () => insertAtSelection("![alt text](image-url)"),
			},
		],
		[markdown],
	);

	return (
		<div
			className={["oakd-markdown-editor", className].join(" ").trim()}
			style={style}
		>
			<Space direction="vertical" gap>
				<Space justify="between" align="center" wide>
					<ButtonGroup>
						<Button
							variant={previewMode ? "ghost" : "active"}
							onClick={() => setPreviewMode(false)}
							icon="Pen"
						>
							<Paragraph>Edit</Paragraph>
						</Button>
						<Button
							variant={previewMode ? "active" : "ghost"}
							onClick={() => setPreviewMode(true)}
							icon="Book"
						>
							<Paragraph>Preview</Paragraph>
						</Button>
					</ButtonGroup>

					{!previewMode ? (
						<Space gap align="center">
							<ButtonGroup>
								{toolbar.slice(0, 2).map((item) => (
									<Button
										key={item.key}
										onClick={item.onClick}
										icon={item.key === "bold" ? "Text" : "PenPaper"}
									>
										<Paragraph>{item.label}</Paragraph>
									</Button>
								))}
							</ButtonGroup>

							<ButtonGroup>
								{toolbar.slice(2).map((item) => (
									<Button
										key={item.key}
										onClick={item.onClick}
										icon={
											item.key === "heading"
												? "Hashtag"
												: item.key === "list"
													? "List"
													: item.key === "code"
														? "Code"
														: item.key === "quote"
															? "Comment"
															: "Picture"
										}
									>
										<Paragraph>{item.label}</Paragraph>
									</Button>
								))}
							</ButtonGroup>
						</Space>
					) : null}
				</Space>

				<div className="oakd-markdown-editor__surface">
					{previewMode ? (
						<MarkdownRenderer markdown={markdown} />
					) : (
						<CodeArea
							ref={ref}
							value={markdown}
							onChange={(event) => updateMarkdown(event.target.value)}
							grow
							highlightCurrentLine
						/>
					)}
				</div>
			</Space>
		</div>
	);
};

export default MarkdownEditor;
