import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import ReactDOM from "react-dom";
import { ContextMenuProps } from "./ContextMenu.types";
import "./ContextMenu.css";
import Content from "../../Layout/Content/Content";
import { clampFloatingPosition } from "../Dropdown/dropdownPlacement";
import Card from "../Card/Card";

const ContextMenu: React.FC<ContextMenuProps> = ({
	children,
	content,
	disabled = false,
	offset = 8,
	onOpenChange,
	className = "",
	style,
	...rest
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [anchor, setAnchor] = useState({ x: 0, y: 0 });
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const triggerRef = useRef<HTMLDivElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	const close = useCallback(
		(returnFocus = false) => {
			setIsOpen(false);
			onOpenChange?.(false);
			if (returnFocus) triggerRef.current?.focus();
		},
		[onOpenChange],
	);
	const openAt = useCallback(
		(x: number, y: number) => {
			const next = { x, y };
			setAnchor(next);
			setPosition(next);
			setIsOpen(true);
			onOpenChange?.(true);
		},
		[onOpenChange],
	);

	useEffect(() => {
		if (!isOpen) return;

		const onMouseDown = (event: MouseEvent) => {
			const target = event.target as Node;
			if (
				menuRef.current &&
				!menuRef.current.contains(target) &&
				triggerRef.current &&
				!triggerRef.current.contains(target)
			) {
				close();
			}
		};

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				close(true);
			}
		};

		document.addEventListener("mousedown", onMouseDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("mousedown", onMouseDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [close, isOpen]);

	useLayoutEffect(() => {
		if (!isOpen || !menuRef.current) return;
		const rect = menuRef.current.getBoundingClientRect();
		setPosition(
			clampFloatingPosition(
				anchor.x,
				anchor.y,
				rect.width,
				rect.height,
				offset,
			),
		);
		menuRef.current
			.querySelector<HTMLElement>(
				'[role="menuitem"], button:not([disabled]), [href]',
			)
			?.focus();
	}, [isOpen, anchor, offset]);

	return (
		<>
			<Content
				{...rest}
				ref={triggerRef}
				className={["oakd", "context-menu-trigger", className]
					.filter(Boolean)
					.join(" ")}
				style={style}
				tabIndex={disabled ? undefined : 0}
				aria-haspopup="menu"
				onMouseDownCapture={(event) => {
					if (isOpen && event.button === 0) {
						close();
					}
				}}
				onKeyDown={(event) => {
					if (disabled) return;
					if (
						event.key === "ContextMenu" ||
						(event.shiftKey && event.key === "F10")
					) {
						event.preventDefault();
						const rect = triggerRef.current?.getBoundingClientRect();
						openAt((rect?.left || 0) + offset, (rect?.bottom || 0) + offset);
					}
				}}
				onContextMenu={(event) => {
					if (disabled) return;
					event.preventDefault();
					openAt(event.clientX + offset, event.clientY + offset);
				}}
			>
				{children}
			</Content>
			{isOpen
				? ReactDOM.createPortal(
						<Card
							ref={menuRef}
							data-testid="ContextMenu"
							role="menu"
							className="oakd context-menu"
							style={{ left: position.x, top: position.y }}
							onClick={() => close()}
						>
							{content}
						</Card>,
						document.body,
					)
				: null}
		</>
	);
};

export default ContextMenu;
