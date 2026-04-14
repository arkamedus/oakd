// CodeArea.tsx
import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react";
import { CodeAreaProps, CodeAreaTokenRule } from "./CodeArea.types";
import "./CodeArea.css";

function escapeHtml(input: string): string {
	return input
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function getDefaultJsRules(): CodeAreaTokenRule[] {
	const keywords =
		"break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with|yield|async|await";
	const types = "string|number|boolean|any|unknown|never|void|null|undefined";
	const builtins = "console|window|document|JSON|Math|Date|Promise|Set|Map";

	return [
		{ className: "tok-comment", regex: /\/\*[\s\S]*?\*\//g },
		{ className: "tok-comment", regex: /\/\/.*$/gm },
		{ className: "tok-string", regex: /(["'`])(?:\\.|(?!\1)[^\\])*\1/g },
		{ className: "tok-number", regex: /\b\d+(\.\d+)?\b/g },
		{ className: "tok-keyword", regex: new RegExp(`\\b(${keywords})\\b`, "g") },
		{ className: "tok-type", regex: new RegExp(`\\b(${types})\\b`, "g") },
		{ className: "tok-builtin", regex: new RegExp(`\\b(${builtins})\\b`, "g") },
		{ className: "tok-boolean", regex: /\b(true|false)\b/g },
	];
}

function normalizeRegex(rx: RegExp): RegExp {
	return rx.global ? rx : new RegExp(rx.source, rx.flags + "g");
}

/**
 * Stable highlighter: earlier rules win; later rules can't recolor claimed chars.
 */
function highlightToHtml(value: string, rules: CodeAreaTokenRule[]): string {
	// stabilize trailing newline so last line keeps height
	const text = value.endsWith("\n") ? value + " " : value;
	if (!text) return "";

	const claimed = new Uint8Array(text.length);

	type Match = { start: number; end: number; className: string };
	const matches: Match[] = [];

	for (const rule of rules) {
		const rx = normalizeRegex(rule.regex);
		rx.lastIndex = 0;

		let m: RegExpExecArray | null;
		while ((m = rx.exec(text)) !== null) {
			const start = m.index;
			const end = start + m[0].length;

			if (end <= start) {
				rx.lastIndex = start + 1;
				continue;
			}

			let ok = true;
			for (let i = start; i < end && i < claimed.length; i++) {
				if (claimed[i]) {
					ok = false;
					break;
				}
			}
			if (!ok) continue;

			for (let i = start; i < end && i < claimed.length; i++) claimed[i] = 1;
			matches.push({ start, end, className: rule.className });
		}
	}

	matches.sort((a, b) => a.start - b.start);

	let out = "";
	let cursor = 0;

	for (const mm of matches) {
		if (mm.start > cursor) out += escapeHtml(text.slice(cursor, mm.start));
		out += `<span class="${mm.className}">${escapeHtml(
			text.slice(mm.start, mm.end),
		)}</span>`;
		cursor = mm.end;
	}

	if (cursor < text.length) out += escapeHtml(text.slice(cursor));
	return out;
}

function computeLineFromSelection(
	value: string,
	selectionStart: number,
): number {
	const clamped = Math.max(0, Math.min(selectionStart, value.length));
	let line = 1;
	for (let i = 0; i < clamped; i++) if (value.charCodeAt(i) === 10) line++;
	return line;
}

function getLineStartIndex(value: string, lineNumber1Based: number): number {
	if (lineNumber1Based <= 1) return 0;
	let line = 1;
	for (let i = 0; i < value.length; i++) {
		if (value.charCodeAt(i) === 10) {
			line++;
			if (line === lineNumber1Based) return i + 1;
		}
	}
	return value.length;
}

const CodeArea = forwardRef<HTMLTextAreaElement, CodeAreaProps>(
	(
		{
			value,
			defaultValue,
			placeholder = "",
			disabled = false,
			readOnly = false,
			codeType = "default",
			size = "default",
			grow = false,
			lineNumbers = false,
			highlightCurrentLine = false,
			errorLines = [],
			rules,
			className = "",
			style,
			onChange,
			onBlur,
			onFocus,
			onKeyDown,
			onKeyUp,
			...rest
		},
		ref,
	) => {
		const isControlled = value !== undefined;
		const [internalValue, setInternalValue] = useState<string>(
			defaultValue ?? value ?? "",
		);

		const textareaRef = useRef<HTMLTextAreaElement>(null);
		const highlightInnerRef = useRef<HTMLDivElement>(null);

		const [currentLine, setCurrentLine] = useState<number | null>(null);
		const [isFocused, setIsFocused] = useState(false);

		useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

		useEffect(() => {
			if (isControlled) setInternalValue(value ?? "");
		}, [isControlled, value]);

		const effectiveValue = isControlled ? (value ?? "") : internalValue;

		const effectiveRules = useMemo(
			() => (rules?.length ? rules : getDefaultJsRules()),
			[rules],
		);

		const highlightedHtml = useMemo(() => {
			return highlightToHtml(effectiveValue, effectiveRules) || "&nbsp;";
		}, [effectiveValue, effectiveRules]);

		const lineCount = useMemo(() => {
			const count = effectiveValue.split("\n").length || 1;
			return Math.max(1, count);
		}, [effectiveValue]);

		const errorSet = useMemo(() => {
			const s = new Set<number>();
			for (const n of errorLines) {
				if (Number.isFinite(n) && n >= 1) s.add(Math.floor(n));
			}
			return s;
		}, [errorLines]);

		const syncScroll = () => {
			const ta = textareaRef.current;
			const hi = highlightInnerRef.current;
			if (!ta || !hi) return;

			// ONE scroller: textarea
			// Overlay doesn't scroll; we translate inner by -scrollTop/-scrollLeft.
			const top = ta.scrollTop;
			const left = ta.scrollLeft;
			hi.style.transform = `translate(${-left}px, ${-top}px)`;
		};

		const [initialRows] = useState(() => {
			const v = (defaultValue ?? value ?? "").toString();
			const lines = v.split("\n").length || 1;
			return Math.max(3, lines); // pick your minimum
		});

		const updateCurrentLine = (nextValue?: string, forcedSel?: number) => {
			const ta = textareaRef.current;
			if (!ta) return;

			const v = nextValue ?? ta.value ?? "";
			const sel = forcedSel ?? ta.selectionStart ?? 0;
			setCurrentLine(computeLineFromSelection(v, sel));
		};

		useEffect(() => {
			requestAnimationFrame(syncScroll);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [lineNumbers, size]);

		const handleChange = (e: any) => {
			const nextVal = e.target.value;

			if (!isControlled) setInternalValue(nextVal);
			onChange?.(e);

			// do NOT compute line here (newline edges are transient)
			requestAnimationFrame(() => {
				updateCurrentLine(); // uses actual settled selectionStart
				syncScroll();
			});
		};

		const handleTabKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			const ta = textareaRef.current;
			if (!ta) return;

			e.preventDefault();
			const TAB = "\t";

			const start = ta.selectionStart ?? 0;
			const end = ta.selectionEnd ?? 0;

			const next =
				effectiveValue.slice(0, start) + TAB + effectiveValue.slice(end);

			if (!isControlled) setInternalValue(next);

			if (onChange) {
				const event = {
					...({} as any),
					target: { ...ta, value: next },
					currentTarget: { ...ta, value: next },
				};
				onChange(event);
			}

			requestAnimationFrame(() => {
				ta.focus();
				const pos = start + TAB.length;
				ta.setSelectionRange(pos, pos);
				updateCurrentLine(next);
				syncScroll();
			});
		};

		const jumpToLine = (lineNo: number) => {
			const ta = textareaRef.current;
			if (!ta) return;

			const clamped = Math.max(1, Math.min(lineNo, lineCount));
			const pos = getLineStartIndex(effectiveValue, clamped);

			ta.focus();
			ta.setSelectionRange(pos, pos);
			setCurrentLine(clamped);
			requestAnimationFrame(syncScroll);
		};

		const containerClasses = [
			"oakd",
			"standardized-reset",
			"standardized-text",
			"codearea-container",
			`type-${codeType}`,
			`size-${size}`,
			lineNumbers ? "has-gutter" : "",
			disabled ? "codearea-disabled" : "",
			grow ? "grow" : "",
			className,
		]
			.filter(Boolean)
			.join(" ");

		// Build "line background" rows in pure DOM flow (no pixel math)
		const lineRows = Array.from({ length: lineCount }, (_, i) => {
			const ln = i + 1;
			const isErr = errorSet.has(ln);
			const isCur =
				highlightCurrentLine &&
				isFocused &&
				currentLine !== null &&
				ln === currentLine;

			return (
				<div
					key={ln}
					className={[
						"codearea-linebg",
						isCur ? "is-current" : "",
						isErr ? "is-error" : "",
					]
						.filter(Boolean)
						.join(" ")}
				/>
			);
		});

		return (
			<div data-testid="CodeArea" className={containerClasses} style={style}>
				<div className="codearea-editor">
					{/* Overlay (no scroll) */}
					<div className="codearea-overlay" aria-hidden="true">
						<div ref={highlightInnerRef} className="codearea-overlay-inner">
							{lineNumbers && (
								<div className="codearea-gutter">
									{Array.from({ length: lineCount }, (_, i) => {
										const ln = i + 1;
										const isErr = errorSet.has(ln);
										return (
											<button
												key={ln}
												type="button"
												className={[
													"codearea-gutter-line",
													isErr ? "is-error" : "",
												]
													.filter(Boolean)
													.join(" ")}
												onMouseDown={(ev) => ev.preventDefault()}
												onClick={() => jumpToLine(ln)}
												tabIndex={-1}
											>
												{ln}
											</button>
										);
									})}
								</div>
							)}

							{/* line backgrounds are FLOW-BASED (always aligned) */}
							<div className="codearea-linebg-layer">{lineRows}</div>

							{/* highlighted code */}
							<pre className="codearea-highlight">
								<code
									className="codearea-code"
									dangerouslySetInnerHTML={{ __html: highlightedHtml }}
								/>
							</pre>
						</div>
					</div>

					{/* Single scroller */}
					<textarea
						{...rest}
						style={style}
						ref={textareaRef}
						readOnly={readOnly}
						rows={initialRows}
						className="codearea-textarea"
						value={effectiveValue}
						placeholder={placeholder}
						disabled={disabled}
						aria-disabled={disabled}
						onChange={handleChange}
						onBlur={(e) => {
							setIsFocused(false);
							setCurrentLine(null);
							onBlur?.(e);
						}}
						onFocus={(e) => {
							setIsFocused(true);
							onFocus?.(e);
							requestAnimationFrame(() => {
								updateCurrentLine();
								syncScroll();
							});
						}}
						onScroll={syncScroll}
						onSelect={() => updateCurrentLine(effectiveValue)}
						onKeyDown={(e) => {
							if (e.key === "Tab") {
								handleTabKey(e);
								return;
							}
							onKeyDown?.(e);
							requestAnimationFrame(() => updateCurrentLine(effectiveValue));
						}}
						onKeyUp={(e) => {
							onKeyUp?.(e);
							requestAnimationFrame(() => updateCurrentLine(effectiveValue));
						}}
						spellCheck={false}
						autoCapitalize="off"
						autoCorrect="off"
						autoComplete="off"
						data-testid="CodeAreaTextarea"
					/>
				</div>
			</div>
		);
	},
);

export default CodeArea;
