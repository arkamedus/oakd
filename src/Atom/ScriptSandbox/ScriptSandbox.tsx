import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react";
import { ScriptSandboxProps, ScriptSandboxStatus } from "./ScriptSandbox.types";
import "./ScriptSandbox.css";
import Title from "../Title/Title";
import Paragraph from "../Paragraph/Paragraph";
import Button from "../Button/Button";
import { Modal } from "../Modal/Modal";
import Content from "../../Layout/Content/Content";
import { IconBug } from "../../Icon/Icons.bin";

/**
 * ScriptSandbox
 * - Runs JS code in a sandboxed iframe (allow-scripts only).
 * - CSP blocks network (connect-src 'none') and most resource loads.
 * - Provides built-ins: print(text), background(color).
 * - Communicates via postMessage back to parent for print/status/error.
 */
const ScriptSandbox = forwardRef<HTMLDivElement, ScriptSandboxProps>(
	(
		{
			src,
			autoRun = false,
			controls = true,
			title = "Sandbox",
			initialBackground = "#ffffff",
			onPrint,
			onSuccess,
			onError,
			onStatus,
			className = "",
			style,
			...rest
		},
		ref,
	) => {
		const rootRef = useRef<HTMLDivElement>(null);
		const iframeRef = useRef<HTMLIFrameElement>(null);

		useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);

		const [runId, setRunId] = useState(0);
		const [fsModal, setFsModal] = useState<boolean>(false);
		const [status, setStatus] = useState<ScriptSandboxStatus>("idle");
		const [lastError, setLastError] = useState<string | null>(null);

		const setStatusSafe = (s: ScriptSandboxStatus) => {
			setStatus(s);
			onStatus?.(s);
		};

		const srcDoc = useMemo(() => {
			const csp = [
				"default-src 'none'",
				"base-uri 'none'",
				"form-action 'none'",
				"frame-ancestors 'none'",
				"connect-src 'none'",
				"img-src data:",
				"style-src 'unsafe-inline'",
				"script-src 'unsafe-inline'",
			].join("; ");

			// IMPORTANT: stable name so stack lines are parseable
			const SRC_NAME = "oakd-sandbox.js";

			const USER_MARKER = "<!--__OAKD_USER_SCRIPT_START__-->";

			let html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Security-Policy" content="${csp}">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { height: 100%; margin: 0; }
      body {
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
        background: ${initialBackground};
        color: #111;
      }
      #wrap { height: 100%; box-sizing: border-box; padding: 12px; }
      #out { white-space: pre-wrap; word-break: break-word; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace; font-size: 13px; line-height: 18px; }
      .line { padding: 2px 0; }
      .hint { opacity: 0.6; font-size: 12px; margin-bottom: 8px; }
    </style>
  </head>
  <body>
    <div id="wrap">
      <div id="out"></div>
    </div>
    <script>__OAKD_BOOTSTRAP__</script>
    ${USER_MARKER}
    <script>${src}//# sourceURL=${SRC_NAME}</script>
  </body>
</html>`;

			const wrappedUserCode = `
(function(){
  "use strict";

  const __OAKD_SRC_NAME = "${SRC_NAME}";
  let __OAKD_USER_LINE_OFFSET = 0;
  const __OAKD_USER_SCRIPT_START_LINE = __OAKD_USER_SCRIPT_START_LINE__;


  const __print = (...args) => {
    try {
      const text = args.map(a => String(a)).join(" ");
      parent.postMessage({ __oakd: true, type: "print", line: text }, "*");
      const el = document.createElement("div");
      el.className = "line";
      el.textContent = text;
      document.getElementById("out").appendChild(el);
    } catch {}
  };

  const __background = (color) => {
    try {
      const c = String(color);
      document.body.style.background = c;
      parent.postMessage({ __oakd: true, type: "background", color: c }, "*");
    } catch {}
  };

  const __parseStack = (stack) => {
    if (!stack) return { line: 0, column: 0 };
    const s = String(stack);
    const esc = __OAKD_SRC_NAME.replace(/[.*+?^\${}()|[\]\\]/g, "\\$&");
  
    let m = s.match(new RegExp(esc + ":(\\\\d+):(\\\\d+)"));
    if (m) return { line: +m[1], column: +m[2] };
  
    m = s.match(new RegExp(esc + ":(\\\\d+)"));
    if (m) return { line: +m[1], column: 0 };
  
    return { line: 0, column: 0 };
  };

  const __toUserLine = (abs) =>
    abs && __OAKD_USER_LINE_OFFSET ? Math.max(1, abs - __OAKD_USER_LINE_OFFSET) : abs || 0;

  const __postError = (errLike, fallbackMsg, fallbackLine, fallbackCol) => {
    const name = errLike?.name || "Error";
    const message = errLike?.message || fallbackMsg || "Unknown error";
    const stack = errLike?.stack ? String(errLike.stack) : "";
    const parsed = __parseStack(stack);

    const absLine = parsed.line || fallbackLine || 0;
    const absCol = parsed.column || fallbackCol || 0;
    parent.postMessage({
      __oakd: true,
      type: "error",
      error: {
        name,
        message,
        stack,
        line: (fallbackLine ? fallbackLine : __toUserLine(absLine)),
        column: absCol,
        absLine,
        absColumn: absCol
      }
    }, "*");
  };

  window.onerror = (msg, src, line, col, err) => {
   // console.log('window error A', line,(${html.split("\n").length}));
  //  __postError(err, msg, line - (${html.split("\n").length}), col);
    return true;
  };
  
  // Catch parse-time errors (SyntaxError in inline scripts) and forward them.
  // Needs capture=true so it sees resource/script parse errors.
  window.addEventListener("error", (ev) => {
    try {
      const e = ev || {};
      const msg = String(e.message || "Syntax error");
      const file = String(e.filename || "");
      if (file && file.indexOf(__OAKD_SRC_NAME) === -1) return; // ignore non-user scripts

      const absLine = typeof e.lineno === "number" ? e.lineno : 0;
      const line = (__OAKD_USER_SCRIPT_START_LINE && absLine >= __OAKD_USER_SCRIPT_START_LINE)
        ? Math.max(1, absLine - __OAKD_USER_SCRIPT_START_LINE + 1)
        : absLine;
       // console.log('window error')


      const col  = typeof e.colno === "number" ? e.colno : 0;

      // If the browser doesn't provide line/col here, we still propagate the error.
      __postError(
        e.error || { name: "SyntaxError", message: msg, stack: "" },
        msg,
        line,
        col
      );
      parent.postMessage({ __oakd: true, type: "status", status: "error" }, "*");
    } catch {}
  }, true);


  window.onunhandledrejection = (ev) => {
    __postError(ev?.reason, "Unhandled rejection", 0, 0);
  };

  const origLog = console.log;
  console.log = (...args) => {
    __print(args.map(a => {
      try { return typeof a === "string" ? a : JSON.stringify(a); }
      catch { return String(a); }
    }).join(" "));
    return origLog.apply(console, args);
  };
  
  parent.postMessage({ __oakd: true, type: "status", status: "running" }, "*");

  window.print = __print;
  window.background = __background;

  try {
    // ---- USER CODE OFFSET MARKER (DO NOT MOVE) ----
    try { throw new Error("__OAKD_MARKER__"); }catch (e) {const parsed = __parseStack(e.stack || "");__OAKD_USER_LINE_OFFSET = parsed.line || 0;}
    //# sourceURL=oakd-sandbox.js
    parent.postMessage({ __oakd: true, type: "status", status: "success" }, "*");
  } catch (e) {
    __postError(e, "Execution error", 0, 0);
    parent.postMessage({ __oakd: true, type: "status", status: "error" }, "*");
  }
})();
`;

			const userScriptStartLine =
				1 +
				(html.split(USER_MARKER)[0].match(/\n/g)?.length ?? 0) +
				wrappedUserCode.split("\n").length;
			//console.log("START", userScriptStartLine, wrappedUserCode.split("\n").length);
			const wrappedUserCodeWithLine = wrappedUserCode.replace(
				"__OAKD_USER_SCRIPT_START_LINE__",
				String(userScriptStartLine),
			);

			html = html.replace("__OAKD_BOOTSTRAP__", wrappedUserCodeWithLine);

			return html;
		}, [/*src,*/ runId, initialBackground]);

		// Listen for iframe messages
		useEffect(() => {
			const onMsg = (ev: MessageEvent) => {
				const iframeWin = iframeRef.current?.contentWindow;
				if (!iframeWin || ev.source !== iframeWin) return;

				const data = ev.data;
				if (!data || data.__oakd !== true) return;

				if (data.type === "print") {
					const line = String(data.line ?? "");
					onPrint?.(line);
				}

				if (data.type === "status") {
					const s = String(data.status);
					if (s === "running") {
						setLastError(null);
						setStatusSafe("running");
					} else if (s === "success") {
						setStatusSafe("success");
						onSuccess?.();
					} else if (s === "error") {
						setStatusSafe("error");
					}
				}

				if (data.type === "error") {
					const err = data.error || {};
					const name = err.name ? String(err.name) : "Error";
					const message = String(err.message ?? "Unknown error");
					const stack = err.stack ? String(err.stack) : "";
					const line = typeof err.line === "number" ? err.line : 0;
					const column = typeof err.column === "number" ? err.column : 0;

					// Build a full parent-visible message
					const full =
						`${name}: ${message}` +
						(line ? ` (line ${line}${column ? `:${column}` : ""})` : ""); // +
					// (stack ? `\n\n${stack}` : "");

					setLastError(full);
					setStatusSafe("error");

					onError?.({
						message: full, // full message with line + stack
						name,
						stack: stack || undefined,
						line: line || undefined,
						column: column || undefined,
					});
				}
			};

			window.addEventListener("message", onMsg);
			return () => window.removeEventListener("message", onMsg);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [onPrint, onError, onSuccess]);

		// Auto-run when src changes
		useEffect(() => {
			if (!autoRun) return;
			setStatusSafe("running");
			setRunId((n) => n + 1);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [src, autoRun]);

		const run = () => {
			setStatusSafe("running");
			setRunId((n) => n + 1);
		};

		const reset = () => {
			setLastError(null);
			setStatusSafe("reset");
			setRunId((n) => n + 1);
		};

		const disabled = false;
		const readOnly = false;

		const rootClasses = ["oakd", "script-sandbox", className]
			.filter(Boolean)
			.join(" ");

		return (
			<div ref={rootRef} className={rootClasses} style={style} {...rest}>
				{controls && (
					<div className="script-sandbox__header">
						<Paragraph className="script-sandbox__title">{title}</Paragraph>
						<div className="script-sandbox__controls">
							<Button
								className="script-sandbox__btn"
								onClick={run}
								disabled={disabled || readOnly}
								icon={"Play"}
							>
								Run
							</Button>
							<Button
								className="script-sandbox__btn secondary"
								onClick={reset}
								disabled={disabled}
								icon={"Refresh"}
							>
								Reset
							</Button>
							<Button
								className="script-sandbox__btn secondary"
								onClick={() => {
									const win = window.open(
										"",
										"_blank",
										"popup=yes,width=900,height=650",
									);
									if (!win) return;

									win.document.open();
									win.document.write(srcDoc);
									win.document.close();
								}}
								disabled={disabled}
								icon={"Resize"}
							>
								Launch
							</Button>
						</div>
					</div>
				)}

				{lastError && (
					<Paragraph className="script-sandbox__error" role="alert">
						<IconBug size={"small"} /> {lastError}
					</Paragraph>
				)}

				<div className="script-sandbox__frameWrap">
					<iframe
						ref={iframeRef}
						key={runId}
						title="ScriptSandbox"
						className="script-sandbox__frame"
						sandbox="allow-scripts"
						srcDoc={srcDoc}
					/>
				</div>

				<Paragraph className="script-sandbox__footer">
					Status: <span className={`st ${status}`}>{status}</span>
				</Paragraph>
			</div>
		);
	},
);

export default ScriptSandbox;
