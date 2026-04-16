import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { ContextMenuProps } from "./ContextMenu.types";
import "./ContextMenu.css";
import Content from "../../Layout/Content/Content";

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

	const close = () => {
		setIsOpen(false);
		onOpenChange?.(false);
	};

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
				close();
			}
		};

		document.addEventListener("mousedown", onMouseDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("mousedown", onMouseDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [isOpen]);

	useLayoutEffect(() => {
		if (!isOpen || !menuRef.current) return;
		const rect = menuRef.current.getBoundingClientRect();
		const maxX = Math.max(offset, window.innerWidth - rect.width - offset);
		const maxY = Math.max(offset, window.innerHeight - rect.height - offset);
		setPosition({
			x: Math.min(anchor.x, maxX),
			y: Math.min(anchor.y, maxY),
		});
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
				onMouseDownCapture={(event) => {
					if (isOpen && event.button === 0) {
						close();
					}
				}}
				onContextMenu={(event) => {
					if (disabled) return;
					event.preventDefault();
					const next = { x: event.clientX + offset, y: event.clientY + offset };
					setAnchor(next);
					setPosition(next);
					setIsOpen(true);
					onOpenChange?.(true);
				}}
			>
				{children}
			</Content>
			{isOpen
				? ReactDOM.createPortal(
						<Content
							ref={menuRef}
							data-testid="ContextMenu"
							className="oakd context-menu"
							style={{ left: position.x, top: position.y }}
							onClick={() => close()}
						>
							{content}
						</Content>,
						document.body,
					)
				: null}
		</>
	);
};

export default ContextMenu;
