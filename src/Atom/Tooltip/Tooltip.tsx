import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import Content from "../../Layout/Content/Content";
import Card from "../Card/Card";
import { TooltipProps } from "./Tooltip.types";
import "./Tooltip.css";

const Tooltip: React.FC<TooltipProps> = ({
	children,
	content,
	interaction = "hover",
	direction = "top-left",
	open,
	defaultOpen = false,
	onOpenChange,
	disabled = false,
	pad = true,
	wide = false,
	className = "",
	onMouseEnter,
	onMouseLeave,
	onFocusCapture,
	onBlurCapture,
	...rest
}) => {
	const [internalOpen, setInternalOpen] = useState(defaultOpen);
	const isOpen = open ?? internalOpen;
	const rootRef = useRef<HTMLDivElement>(null);
	const popupRef = useRef<HTMLDivElement>(null);

	const setOpen = useCallback(
		(next: boolean) => {
			if (disabled || next === isOpen) return;
			if (open === undefined) setInternalOpen(next);
			onOpenChange?.(next);
		},
		[disabled, isOpen, onOpenChange, open],
	);

	const returnFocus = useCallback(() => {
		rootRef.current
			?.querySelector<HTMLElement>("button, [href], input, [tabindex]")
			?.focus();
	}, []);

	useEffect(() => {
		if (!isOpen) return;
		const handleMouseDown = (event: MouseEvent) => {
			if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
		};
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpen(false);
				returnFocus();
			}
		};
		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, returnFocus, setOpen]);

	useLayoutEffect(() => {
		if (interaction !== "click" || !isOpen) return;
		const popup = popupRef.current;
		popup
			?.querySelector<HTMLElement>("button:not([disabled]), [href], input")
			?.focus();
	}, [interaction, isOpen]);

	return (
		<Content
			{...rest}
			ref={rootRef}
			className={["tooltip", wide ? "wide" : "", className]
				.filter(Boolean)
				.join(" ")}
			onMouseEnter={(event) => {
				if (interaction === "hover") setOpen(true);
				onMouseEnter?.(event);
			}}
			onMouseLeave={(event) => {
				if (interaction === "hover") setOpen(false);
				onMouseLeave?.(event);
			}}
			onFocusCapture={(event) => {
				if (interaction === "hover") setOpen(true);
				onFocusCapture?.(event);
			}}
			onBlurCapture={(event) => {
				if (
					interaction === "hover" &&
					!event.currentTarget.contains(event.relatedTarget as Node | null)
				) {
					setOpen(false);
				}
				onBlurCapture?.(event);
			}}
		>
			<Content
				className="tooltip__trigger"
				onClick={() => {
					if (interaction === "click") setOpen(!isOpen);
				}}
				aria-haspopup={interaction === "click" ? "dialog" : undefined}
				aria-expanded={interaction === "click" ? isOpen : undefined}
			>
				{children}
			</Content>
			{isOpen && interaction === "hover" ? (
				<Content className={["tooltip__bridge", direction].join(" ")} />
			) : null}
			{isOpen ? (
				<Card
					ref={popupRef}
					className={["tooltip__content", direction].join(" ")}
					pad={pad}
					role={interaction === "click" ? "dialog" : "tooltip"}
					tabIndex={interaction === "click" ? -1 : undefined}
				>
					{content}
				</Card>
			) : null}
		</Content>
	);
};

export default Tooltip;
