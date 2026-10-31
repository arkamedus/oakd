import React, {
	useCallback,
	useEffect,
	useId,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { DropdownProps } from "./Dropdown.types";
import "./Dropdown.css";
import Button from "../Button/Button";
import { getAdaptiveDropdownPlacement } from "./dropdownPlacement";
import Card from "../Card/Card";
import Content from "../../Layout/Content/Content";
import Paragraph from "../Paragraph/Paragraph";

const Dropdown: React.FC<DropdownProps> = ({
	children,
	triggerProps,
	type = "button",
	onClick,
	direction = "bottom-left",
	fixed = false,
	grow = false,
	label = "Toggle Dropdown",
	size = "default",
	className = "",
	onFocusCapture,
	onKeyDown,
	onKeyDownCapture,
	onPointerDownCapture,
	placementThreshold = 0.6,
	style,
	wide = false,
	open,
	defaultOpen = false,
	onOpenChange,
	disabled = false,
	closeOnSelect = false,
	...rest
}) => {
	const menuId = useId();
	const [internalOpen, setInternalOpen] = useState(defaultOpen);
	const isOpen = open ?? internalOpen;
	const [adaptiveDirection, setAdaptiveDirection] = useState(direction);
	const [placementStyle, setPlacementStyle] = useState<React.CSSProperties>({});
	const dropdownRef = useRef<HTMLDivElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	useImperativeHandle(triggerProps?.ref, () => triggerRef.current!);
	const setOpen = useCallback(
		(next: boolean) => {
			if (open === undefined) setInternalOpen(next);
			onOpenChange?.(next);
		},
		[onOpenChange, open],
	);

	const syncPlacement = useCallback(() => {
		if (!dropdownRef.current) {
			return;
		}
		const placement = getAdaptiveDropdownPlacement(
			dropdownRef.current,
			direction,
			placementThreshold,
		);
		setAdaptiveDirection(placement.direction);
		setPlacementStyle(placement.style);
	}, [direction, placementThreshold]);

	const closeDropdown = useCallback(
		(returnFocus = false) => {
			setOpen(false);
			if (returnFocus) triggerRef.current?.focus();
		},
		[setOpen],
	);
	const toggleDropdown = useCallback(() => {
		if (disabled) return;
		syncPlacement();
		setOpen(!isOpen);
	}, [disabled, isOpen, setOpen, syncPlacement]);

	const handleClickOutside = useCallback(
		(event: MouseEvent) => {
			const target = event.target as Node | null;
			if (
				target &&
				(dropdownRef.current?.contains(target) ||
					menuRef.current?.contains(target))
			) {
				return;
			}
			closeDropdown();
		},
		[closeDropdown],
	);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [handleClickOutside]);

	useEffect(() => {
		if (!isOpen) return;
		syncPlacement();
		window.addEventListener("resize", syncPlacement);
		window.addEventListener("scroll", syncPlacement, true);
		return () => {
			window.removeEventListener("resize", syncPlacement);
			window.removeEventListener("scroll", syncPlacement, true);
		};
	}, [isOpen, syncPlacement]);

	const menu = (
		<Card
			ref={menuRef}
			id={menuId}
			role="presentation"
			className={[
				"oakd-dropdown-content",
				adaptiveDirection,
				fixed ? "fixed" : "",
				isOpen ? "active" : "",
				wide ? "wide" : "",
				grow ? "grow" : "",
				className,
			]
				.filter(Boolean)
				.join(" ")}
			style={fixed ? { ...placementStyle, ...style } : style}
			onClick={() => {
				if (closeOnSelect) closeDropdown(true);
			}}
			onKeyDown={(event) => {
				const items = Array.from(
					menuRef.current?.querySelectorAll<HTMLElement>(
						'button:not([disabled]), [href], [role="menuitem"]',
					) || [],
				);
				const current = items.indexOf(document.activeElement as HTMLElement);
				if (event.key === "ArrowDown") {
					event.preventDefault();
					items[(current + 1 + items.length) % items.length]?.focus();
				} else if (event.key === "ArrowUp") {
					event.preventDefault();
					items[(current - 1 + items.length) % items.length]?.focus();
				} else if (event.key === "Escape") closeDropdown(true);
			}}
		>
			{children}
		</Card>
	);

	return (
		<Content
			className={[
				"oakd-dropdown-container",
				wide ? "wide" : "",
				grow ? "grow" : "",
				className,
			]
				.filter(Boolean)
				.join(" ")}
			ref={dropdownRef}
			onFocusCapture={(event) => {
				syncPlacement();
			}}
			onKeyDown={(event) => {
				if (!event.defaultPrevented && event.key === "Escape") {
					closeDropdown(true);
				}
			}}
			onKeyDownCapture={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					syncPlacement();
				}
			}}
			onPointerDownCapture={(event) => {
				syncPlacement();
			}}
			style={style}
		>
			<Button
				{...rest}
				{...triggerProps}
				ref={triggerRef}
				onFocusCapture={(event) => {
					onFocusCapture?.(event);
					triggerProps?.onFocusCapture?.(event);
				}}
				onKeyDownCapture={(event) => {
					onKeyDownCapture?.(event);
					triggerProps?.onKeyDownCapture?.(event);
				}}
				onPointerDownCapture={(event) => {
					onPointerDownCapture?.(event);
					triggerProps?.onPointerDownCapture?.(event);
				}}
				onKeyDown={(event) => {
					onKeyDown?.(event);
					triggerProps?.onKeyDown?.(event);
				}}
				size={size}
				htmlType={triggerProps?.type ?? type}
				onClick={(event) => {
					onClick?.(event);
					triggerProps?.onClick?.(event);
					if (!event.defaultPrevented) toggleDropdown();
				}}
				aria-haspopup={
					triggerProps?.["aria-haspopup"] ?? rest["aria-haspopup"] ?? true
				}
				aria-controls={menuId}
				aria-expanded={isOpen}
				disabled={disabled || triggerProps?.disabled}
				className={["oakd-dropdown-trigger", triggerProps?.className]
					.filter(Boolean)
					.join(" ")}
			>
				{typeof label === "string" ? <Paragraph>{label}</Paragraph> : label}
			</Button>
			{isOpen && fixed && typeof document !== "undefined"
				? createPortal(menu, document.body)
				: menu}
		</Content>
	);
};

export default Dropdown;
